import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{
  transitionsJson: string;
  initialOffset: number;
  start: number;
  end: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "transitionsJson", label: "transitionsJson", kind: "string" },
  { id: "initialOffset", label: "initialOffset", kind: "number" },
  { id: "start", label: "start", kind: "number" },
  { id: "end", label: "end", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const t = H.zoneTransitions(i.transitionsJson);
  H.check(
    i.start < i.end &&
      Math.abs(i.start) <= 1e12 &&
      Math.abs(i.end) <= 1e12 &&
      Math.abs(i.initialOffset) <= 86400,
  );
  t.forEach((v, j) =>
    H.check(
      !j
        ? v.before === i.initialOffset
        : v.at > t[j - 1].at && v.before === t[j - 1].after,
    ),
  );
  let offset = i.initialOffset,
    p = i.start;
  for (const v of t) if (v.at <= i.start) offset = v.after;
  const spans: H.OffsetSpan[] = [];
  for (const v of t)
    if (v.at > i.start && v.at < i.end) {
      spans.push({ start: p, end: v.at, offset });
      p = v.at;
      offset = v.after;
    }
  spans.push({ start: p, end: i.end, offset });
  return H.finish({ spans });
};
export const example = {
  input: {
    transitionsJson:
      '[{"at": 10, "before": 0, "after": 2}, {"at": 20, "before": 2, "after": 0}]',
    initialOffset: 0,
    start: 0,
    end: 30,
  },
  output: {
    result: {
      spans: [
        { start: 0, end: 10, offset: 0 },
        { start: 10, end: 20, offset: 2 },
        { start: 20, end: 30, offset: 0 },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "zone/offset-transition-effective-spans",
  title: "Time Zone Offset Effective Span Table",
  description:
    "Supplied synthetic civil-second offset observations only, no IANA database, DST rule inference or leap seconds; derive bounded half-open UTC effective spans from a complete ordered transition chain, clipping to explicit UTC endpoints. ",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v, context) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;

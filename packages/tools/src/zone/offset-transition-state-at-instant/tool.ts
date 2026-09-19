import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{
  transitionsJson: string;
  initialOffset: number;
  instant: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "transitionsJson", label: "transitionsJson", kind: "string" },
  { id: "initialOffset", label: "initialOffset", kind: "number" },
  { id: "instant", label: "instant", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const t = H.zoneTransitions(i.transitionsJson);
  H.check(Math.abs(i.initialOffset) <= 86400 && Math.abs(i.instant) <= 1e12);
  t.forEach((v, j) =>
    H.check(
      !j
        ? v.before === i.initialOffset
        : v.at > t[j - 1].at && v.before === t[j - 1].after,
    ),
  );
  let at = -1;
  t.forEach((v, j) => {
    if (v.at <= i.instant) at = j;
  });
  return H.finish({
    offset: at < 0 ? i.initialOffset : t[at].after,
    transitionIndex: at < 0 ? null : at,
  });
};
export const example = {
  input: {
    transitionsJson:
      '[{"at": 10, "before": 0, "after": 2}, {"at": 20, "before": 2, "after": 0}]',
    initialOffset: 0,
    instant: 10,
  },
  output: { result: { offset: 2, transitionIndex: 0 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "zone/offset-transition-state-at-instant",
  title: "Time Zone Offset State at Instant",
  description:
    "Supplied synthetic civil-second offset observations only, no IANA database, DST rule inference or leap seconds; lookup explicit offset state at an instant, transitions effective inclusively and initial offset valid before the first. ",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v, context) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;

import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{ spansJson: string; start: number; end: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "spansJson", label: "spansJson", kind: "string" },
  { id: "start", label: "start", kind: "number" },
  { id: "end", label: "end", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const s = H.zoneSpans(i.spansJson);
  H.check(i.start <= i.end);
  let p = i.start;
  const gaps: number[][] = [];
  for (const v of [...s].sort((a, b) => a.start - b.start)) {
    const start = Math.max(i.start, v.start),
      end = Math.min(i.end, v.end);
    if (start >= end) continue;
    if (start > p) gaps.push([p, start]);
    p = Math.max(p, end);
  }
  if (p < i.end) gaps.push([p, i.end]);
  return H.finish({ gaps });
};
export const example = {
  input: {
    spansJson:
      '[{"start":1,"end":2,"offset":0},{"start":3,"end":4,"offset":0}]',
    start: 0,
    end: 5,
  },
  output: {
    result: {
      gaps: [
        [0, 1],
        [2, 3],
        [4, 5],
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "zone/offset-span-coverage-gaps",
  title: "Time Zone Offset Span Coverage Gaps",
  description:
    "Supplied synthetic civil-second offset observations only, no IANA database, DST rule inference or leap seconds; audit uncovered portions of a finite UTC window after unioning all supplied coverage regardless of offsets; not a claim of timezone rule completeness. ",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v, context) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;

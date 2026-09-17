import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ runs: readonly (readonly number[])[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "runs", kind: "matrix", label: "runs" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.runs.every((r) => r.every((x, j) => j === 0 || x >= r[j - 1])));
  const positions = i.runs.map(() => 0),
    plan: { run: number; index: number; value: number }[] = [];
  while (true) {
    let best = -1;
    for (let j = 0; j < i.runs.length; j++)
      if (
        positions[j] < i.runs[j].length &&
        (best < 0 || i.runs[j][positions[j]] < i.runs[best][positions[best]])
      )
        best = j;
    if (best < 0) break;
    const index = positions[best]++;
    plan.push({ run: best, index, value: i.runs[best][index] });
    H.check(plan.length <= 16384);
  }
  return H.finish({ plan });
};
export const example = {
  input: {
    runs: [
      [1, 3],
      [1, 2],
    ],
  },
  output: {
    result: {
      plan: [
        { run: 0, index: 0, value: 1 },
        { run: 1, index: 0, value: 1 },
        { run: 1, index: 1, value: 2 },
        { run: 0, index: 1, value: 3 },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "order/sort-run-merge-plan",
  title: "Sorted Run Merge Plan",
  description:
    "Produce a stable merge provenance plan for sorted numeric runs, breaking equal keys by earlier run index without mutating runs.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;

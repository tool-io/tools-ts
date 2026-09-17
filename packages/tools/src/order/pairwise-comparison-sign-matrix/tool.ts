import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ values: readonly number[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "values", kind: "numberList", label: "values" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  return H.finish({
    matrix: i.values.map((a) =>
      i.values.map((b) => (a < b ? -1 : a > b ? 1 : 0)),
    ),
  });
};
export const example = {
  input: { values: [2, 1, 2] },
  output: {
    result: {
      matrix: [
        [0, 1, 0],
        [-1, 0, -1],
        [0, 1, 0],
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "order/pairwise-comparison-sign-matrix",
  title: "Pairwise Comparison Sign Matrix",
  description:
    "Return the exact pairwise comparison sign matrix for finite numeric values; zero retains ties rather than forcing an order.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;

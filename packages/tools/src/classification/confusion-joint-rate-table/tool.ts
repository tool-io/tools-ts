import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  matrix: readonly (readonly number[])[];
  labels: readonly string[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "matrix", label: "matrix", kind: "matrix" },
  { id: "labels", label: "labels", kind: "stringList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.confusion(i.matrix, i.labels);
  const total = i.matrix.flat().reduce((s, x) => s + x, 0);
  return H.finish({
    total,
    rates: i.matrix.map((row) => row.map((x) => (total ? x / total : null))),
  });
};
export const example = {
  input: {
    matrix: [
      [2, 1],
      [0, 1],
    ],
    labels: ["a", "b"],
  },
  output: {
    result: {
      total: 4,
      rates: [
        [0.5, 0.25],
        [0, 0.25],
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classification/confusion-joint-rate-table",
  title: "Confusion Joint Rate Table",
  description:
    "Explicit nonnegative square confusion table with unique supplied labels, actual rows and predicted columns; normalize joint observed weight by total support, preserving null on a zero-total table; does not estimate a joint population distribution.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;

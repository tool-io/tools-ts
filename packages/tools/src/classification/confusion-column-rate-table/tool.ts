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
  const totals = i.labels.map((_, j) =>
    i.matrix.reduce((s, row) => s + row[j], 0),
  );
  return H.finish({
    rates: i.matrix.map((row) =>
      row.map((x, j) => (totals[j] ? x / totals[j] : null)),
    ),
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
      rates: [
        [1, 0.5],
        [0, 0.5],
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classification/confusion-column-rate-table",
  title: "Confusion Column Rate Table",
  description:
    "Explicit nonnegative square confusion table with unique supplied labels, actual rows and predicted columns; normalize each predicted column independently with null for zero-support columns; no calibrated probability claim.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;

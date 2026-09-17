import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  matrix: readonly (readonly number[])[];
  labels: readonly string[];
  order: readonly string[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "matrix", label: "matrix", kind: "matrix" },
  { id: "labels", label: "labels", kind: "stringList" },
  { id: "order", label: "order", kind: "stringList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.confusion(i.matrix, i.labels);
  H.check(
    i.order.length === i.labels.length &&
      H.unique(i.order).length === i.order.length &&
      i.order.every((x) => i.labels.includes(x)),
  );
  const indexes = i.order.map((x) => i.labels.indexOf(x));
  return H.finish({
    labels: [...i.order],
    matrix: indexes.map((j) => indexes.map((k) => i.matrix[j][k])),
  });
};
export const example = {
  input: {
    matrix: [
      [2, 1],
      [0, 1],
    ],
    labels: ["a", "b"],
    order: ["b", "a"],
  },
  output: {
    result: {
      labels: ["b", "a"],
      matrix: [
        [1, 0],
        [1, 2],
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classification/confusion-label-axis-reorder",
  title: "Confusion Label Axis Reorder",
  description:
    "Explicit nonnegative square confusion table with unique supplied labels, actual rows and predicted columns; reorder both axes by a complete explicit label permutation without changing counts or label identity.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;

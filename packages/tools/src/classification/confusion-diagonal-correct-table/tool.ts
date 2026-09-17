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
  return H.finish({
    correct: i.labels.map((label, j) => ({ label, value: i.matrix[j][j] })),
    totalCorrect: i.labels.reduce((s, _, j) => s + i.matrix[j][j], 0),
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
      correct: [
        { label: "a", value: 2 },
        { label: "b", value: 1 },
      ],
      totalCorrect: 3,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classification/confusion-diagonal-correct-table",
  title: "Confusion Diagonal Correct Table",
  description:
    "Explicit nonnegative square confusion table with unique supplied labels, actual rows and predicted columns; report diagonal correct counts separately by label and in total; not a normalized accuracy estimate.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;

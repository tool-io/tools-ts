import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  matrix: readonly (readonly number[])[];
  labels: readonly string[];
  rejectLabel: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "matrix", label: "matrix", kind: "matrix" },
  { id: "labels", label: "labels", kind: "stringList" },
  { id: "rejectLabel", label: "rejectLabel", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.confusion(i.matrix, i.labels);
  const at = i.labels.indexOf(i.rejectLabel);
  H.check(at >= 0);
  return H.finish({
    actualLabels: [...i.labels],
    predictedLabels: i.labels.filter((_, j) => j !== at),
    accepted: i.matrix.map((row) => row.filter((_, j) => j !== at)),
    rejected: i.matrix.map((row) => row[at]),
  });
};
export const example = {
  input: {
    matrix: [
      [2, 1],
      [0, 1],
    ],
    labels: ["a", "b"],
    rejectLabel: "b",
  },
  output: {
    result: {
      actualLabels: ["a", "b"],
      predictedLabels: ["a"],
      accepted: [[2], [0]],
      rejected: [1, 1],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classification/confusion-reject-column-partition",
  title: "Confusion Reject Column Partition",
  description:
    "Explicit nonnegative square confusion table with unique supplied labels, actual rows and predicted columns; partition one explicit predicted reject column without removing actual rows or relabeling rejected observations as errors.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;

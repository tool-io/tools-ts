import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  matrix: readonly (readonly number[])[];
  labels: readonly string[];
  groups: readonly string[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "matrix", label: "matrix", kind: "matrix" },
  { id: "labels", label: "labels", kind: "stringList" },
  { id: "groups", label: "groups", kind: "stringList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.confusion(i.matrix, i.labels);
  H.check(i.groups.length === i.labels.length);
  const labels = H.unique(i.groups);
  return H.finish({
    labels,
    matrix: labels.map((a) =>
      labels.map((b) =>
        i.matrix.reduce(
          (s, row, j) =>
            s +
            row.reduce(
              (t, x, k) => t + (i.groups[j] === a && i.groups[k] === b ? x : 0),
              0,
            ),
          0,
        ),
      ),
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
    groups: ["all", "all"],
  },
  output: { result: { labels: ["all"], matrix: [[4]] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classification/confusion-label-class-collapse",
  title: "Confusion Label Class Collapse",
  description:
    "Explicit nonnegative square confusion table with unique supplied labels, actual rows and predicted columns; collapse both axes through explicit per-label group names, summing every count exactly once; first group appearance defines output order.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;

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
    classes: i.labels.map((label, j) => {
      const tp = i.matrix[j][j],
        fn = i.matrix[j].reduce((s, x) => s + x, 0) - tp,
        fp = i.matrix.reduce((s, r) => s + r[j], 0) - tp;
      return { label, tp, fp, fn, tn: total - tp - fp - fn };
    }),
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
      classes: [
        { label: "a", tp: 2, fp: 0, fn: 1, tn: 1 },
        { label: "b", tp: 1, fp: 1, fn: 0, tn: 2 },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classification/confusion-one-versus-rest-records",
  title: "Confusion One Versus Rest Records",
  description:
    "Explicit nonnegative square confusion table with unique supplied labels, actual rows and predicted columns; derive full one-versus-rest TP/FP/FN/TN records for every label; no division, threshold choice or prevalence adjustment.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  scores: readonly (readonly number[])[];
  labels: readonly string[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "scores", label: "scores", kind: "matrix" },
  { id: "labels", label: "labels", kind: "stringList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.scoreRows(i.scores, i.labels);
  return H.finish({
    predictions: i.scores.map((row) => {
      const score = Math.max(...row);
      return {
        score,
        labels: i.labels.filter((_, j) => row[j] === score),
        tied: row.filter((x) => x === score).length > 1,
      };
    }),
  });
};
export const example = {
  input: {
    scores: [
      [0.5, 0.5],
      [0.1, 0.9],
    ],
    labels: ["a", "b"],
  },
  output: {
    result: {
      predictions: [
        { score: 0.5, labels: ["a", "b"], tied: true },
        { score: 0.9, labels: ["b"], tied: false },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classification/prediction-top-label-tie-audit",
  title: "Prediction Top Label Tie Audit",
  description:
    "Audit every maximum-probability label tie from explicit nonnegative unit-sum score rows; retain all ties and do not assume calibration or pick a hidden winner.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;

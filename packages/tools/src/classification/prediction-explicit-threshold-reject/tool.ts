import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  scores: readonly (readonly number[])[];
  labels: readonly string[];
  threshold: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "scores", label: "scores", kind: "matrix" },
  { id: "labels", label: "labels", kind: "stringList" },
  { id: "threshold", label: "threshold", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.scoreRows(i.scores, i.labels);
  H.unit(i.threshold);
  return H.finish({
    predictions: i.scores.map((row) => {
      const score = Math.max(...row),
        labels = i.labels.filter((_, j) => row[j] === score);
      return {
        score,
        label: score >= i.threshold && labels.length === 1 ? labels[0] : null,
        rejected: score < i.threshold || labels.length !== 1,
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
    threshold: 0.8,
  },
  output: {
    result: {
      predictions: [
        { score: 0.5, label: null, rejected: true },
        { score: 0.9, label: "b", rejected: false },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "Prediction Explicit Threshold Reject Map",
      "machine learning",
      "classification metrics",
    ],
    collections: ["ai", "data"],
    fields: ["classification", "machine learning", "classification metrics"],
    keywords: ["machine learning", "classification metrics"],
  },
  id: "classification/prediction-explicit-threshold-reject",
  title: "Prediction Explicit Threshold Reject Map",
  description:
    "Apply a supplied inclusive maximum-score threshold to explicit unit-sum probability rows, rejecting unresolved top ties rather than guessing a label; not a validated decision policy.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit bounded result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          predictions: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                score: { type: "number" },
                label: { anyOf: [{ type: "string" }, { type: "null" }] },
                rejected: { type: "boolean" },
              },
              required: ["score", "label", "rejected"],
            },
          },
        },
        required: ["predictions"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;

import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  probability,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly score: number;
  readonly threshold: number;
  readonly inclusive: boolean;
};
export type Output = { readonly accepted: boolean; readonly boundary: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    score: { type: "number", minimum: 0, maximum: 1 },
    threshold: { type: "number", minimum: 0, maximum: 1 },
    inclusive: { type: "boolean" },
  },
  required: ["score", "threshold", "inclusive"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { accepted: { type: "boolean" }, boundary: { type: "boolean" } },
  required: ["accepted", "boundary"],
} as const;
/** Compute similarity threshold equal score label from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { score, threshold, inclusive } = input;
  const compute = (): Output => {
    probability(score);
    probability(threshold);
    return {
      accepted: inclusive ? score >= threshold : score > threshold,
      boundary: score === threshold,
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { score: 0.5, threshold: 0.5, inclusive: true },
  output: { accepted: true, boundary: true },
} satisfies ToolExample<Input, Output>;
export const similarityThresholdEqualScoreLabelTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "similarity/similarity-threshold-equal-score-label",
  title: "Similarity Threshold Equal Score Label Tool",
  description:
    "Compute similarity threshold equal score label from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "score",
        label: "Score",
        required: true,
        valueType: { type: "number" },
      },
      {
        id: "threshold",
        label: "Threshold",
        required: true,
        valueType: { type: "number" },
      },
      {
        id: "inclusive",
        label: "Inclusive",
        required: true,
        valueType: { type: "boolean" },
      },
    ],
    outputs: [
      { id: "accepted", label: "Accepted", valueType: { type: "boolean" } },
      { id: "boundary", label: "Boundary", valueType: { type: "boolean" } },
    ],
  },
});
export const run = similarityThresholdEqualScoreLabelTool.execute;
export default similarityThresholdEqualScoreLabelTool;

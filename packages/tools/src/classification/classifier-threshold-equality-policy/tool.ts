import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly score: number;
  readonly threshold: number;
  readonly equalityIsPositive: boolean;
};
export type Output = {
  readonly positive: boolean;
  readonly equalityEncountered: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    score: { type: "number" },
    threshold: { type: "number" },
    equalityIsPositive: { type: "boolean" },
  },
  required: ["score", "threshold", "equalityIsPositive"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    positive: { type: "boolean" },
    equalityEncountered: { type: "boolean" },
  },
  required: ["positive", "equalityEncountered"],
} as const;
/** Apply an explicit positive-class equality policy to a finite scalar classifier threshold. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { score, threshold, equalityIsPositive } = request;
  const compute = (): Output => {
    return {
      positive:
        score > threshold || (score === threshold && equalityIsPositive),
      equalityEncountered: score === threshold,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { score: 0.6, threshold: 0.6, equalityIsPositive: true },
  output: { positive: true, equalityEncountered: true },
} satisfies ToolExample<Input, Output>;
export const classifierThresholdEqualityPolicyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "classification/classifier-threshold-equality-policy",
    title: "Classifier Threshold Equality Policy Tool",
    description:
      "Apply an explicit positive-class equality policy to a finite scalar classifier threshold.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        score: { type: "number" },
        threshold: { type: "number" },
        equalityIsPositive: { type: "boolean" },
      },
      required: ["score", "threshold", "equalityIsPositive"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        positive: { type: "boolean" },
        equalityEncountered: { type: "boolean" },
      },
      required: ["positive", "equalityEncountered"],
    },
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
          id: "equalityIsPositive",
          label: "Equality Is Positive",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "positive", label: "Positive", valueType: { type: "boolean" } },
        {
          id: "equalityEncountered",
          label: "Equality Encountered",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = classifierThresholdEqualityPolicyTool.execute;
export default classifierThresholdEqualityPolicyTool;

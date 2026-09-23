import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly score: number;
  readonly threshold: number;
  readonly higherMatches: boolean;
  readonly equalityAccepted: boolean;
};
export type Output = {
  readonly acceptedUnderRule: boolean;
  readonly tied: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    score: { type: "number" },
    threshold: { type: "number" },
    higherMatches: { type: "boolean" },
    equalityAccepted: { type: "boolean" },
  },
  required: ["score", "threshold", "higherMatches", "equalityAccepted"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    acceptedUnderRule: { type: "boolean" },
    tied: { type: "boolean" },
  },
  required: ["acceptedUnderRule", "tied"],
} as const;
/** Calculate verification threshold equality flag from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { score, threshold, higherMatches, equalityAccepted } = request;
  const compute = (): Output => {
    return {
      acceptedUnderRule:
        (score - threshold) * (higherMatches ? 1 : -1) > 0 ||
        (score === threshold && equalityAccepted),
      tied: score === threshold,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    score: 0.5,
    threshold: 0.5,
    higherMatches: true,
    equalityAccepted: true,
  },
  output: { acceptedUnderRule: true, tied: true },
} satisfies ToolExample<Input, Output>;
export const verificationThresholdEqualityFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biometrics/verification-threshold-equality-flag",
    title: "Verification Threshold Equality Flag Tool",
    description:
      "Calculate verification threshold equality flag from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        score: { type: "number" },
        threshold: { type: "number" },
        higherMatches: { type: "boolean" },
        equalityAccepted: { type: "boolean" },
      },
      required: ["score", "threshold", "higherMatches", "equalityAccepted"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        acceptedUnderRule: { type: "boolean" },
        tied: { type: "boolean" },
      },
      required: ["acceptedUnderRule", "tied"],
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
          id: "higherMatches",
          label: "Higher Matches",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "equalityAccepted",
          label: "Equality Accepted",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "acceptedUnderRule",
          label: "Accepted Under Rule",
          valueType: { type: "boolean" },
        },
        { id: "tied", label: "Tied", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = verificationThresholdEqualityFlagTool.execute;
export default verificationThresholdEqualityFlagTool;

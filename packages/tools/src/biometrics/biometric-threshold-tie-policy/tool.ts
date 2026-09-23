import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly score: number;
  readonly threshold: number;
  readonly higherMatches: boolean;
  readonly acceptTie: boolean;
};
export type Output = {
  readonly accepted: boolean;
  readonly tie: boolean;
  readonly margin: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    score: { type: "number" },
    threshold: { type: "number" },
    higherMatches: { type: "boolean" },
    acceptTie: { type: "boolean" },
  },
  required: ["score", "threshold", "higherMatches", "acceptTie"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    accepted: { type: "boolean" },
    tie: { type: "boolean" },
    margin: { type: "number" },
  },
  required: ["accepted", "tie", "margin"],
} as const;
/** Evaluate one supplied biometric score under an explicit direction/tie policy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { score, threshold, higherMatches, acceptTie } = request;
  const compute = (): Output => {
    const tie = score === threshold;
    return {
      accepted: tie
        ? acceptTie
        : higherMatches
          ? score > threshold
          : score < threshold,
      tie,
      margin: (higherMatches ? 1 : -1) * (score - threshold),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { score: 0.7, threshold: 0.7, higherMatches: true, acceptTie: false },
  output: { accepted: false, tie: true, margin: 0 },
} satisfies ToolExample<Input, Output>;
export const biometricThresholdTiePolicyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biometrics/biometric-threshold-tie-policy",
    title: "Biometric Threshold Tie Policy Tool",
    description:
      "Evaluate one supplied biometric score under an explicit direction/tie policy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        score: { type: "number" },
        threshold: { type: "number" },
        higherMatches: { type: "boolean" },
        acceptTie: { type: "boolean" },
      },
      required: ["score", "threshold", "higherMatches", "acceptTie"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        accepted: { type: "boolean" },
        tie: { type: "boolean" },
        margin: { type: "number" },
      },
      required: ["accepted", "tie", "margin"],
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
          id: "acceptTie",
          label: "Accept Tie",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "accepted", label: "Accepted", valueType: { type: "boolean" } },
        { id: "tie", label: "Tie", valueType: { type: "boolean" } },
        { id: "margin", label: "Margin", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = biometricThresholdTiePolicyTool.execute;
export default biometricThresholdTiePolicyTool;

import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly originalConcentration: number;
  readonly wellMixedVolume: number;
  readonly withdrawnVolume: number;
  readonly replacementConcentration: number;
};
export type Output = {
  readonly finalConcentration: number;
  readonly retainedOriginalFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    originalConcentration: { type: "number", minimum: 0 },
    wellMixedVolume: { type: "number", exclusiveMinimum: 0 },
    withdrawnVolume: { type: "number", minimum: 0 },
    replacementConcentration: { type: "number", minimum: 0 },
  },
  required: [
    "originalConcentration",
    "wellMixedVolume",
    "withdrawnVolume",
    "replacementConcentration",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    finalConcentration: { type: "number" },
    retainedOriginalFraction: { type: "number" },
  },
  required: ["finalConcentration", "retainedOriginalFraction"],
} as const;
/** Calculate concentration after explicit well-mixed withdrawal and equal-volume replacement under additive compatible volumes. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    originalConcentration,
    wellMixedVolume,
    withdrawnVolume,
    replacementConcentration,
  } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isFinite(wellMixedVolume) && wellMixedVolume > 0,
      "wellMixedVolume",
    ),
      wellMixedVolume);
    H.domain(
      withdrawnVolume >= 0 && withdrawnVolume <= wellMixedVolume,
      "withdrawnVolume",
    );
    H.domain(
      originalConcentration >= 0 && replacementConcentration >= 0,
      "originalConcentration",
    );
    return {
      finalConcentration:
        originalConcentration * (1 - withdrawnVolume / wellMixedVolume) +
        replacementConcentration * (withdrawnVolume / wellMixedVolume),
      retainedOriginalFraction: 1 - withdrawnVolume / wellMixedVolume,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    originalConcentration: 10,
    wellMixedVolume: 100,
    withdrawnVolume: 20,
    replacementConcentration: 0,
  },
  output: { finalConcentration: 8, retainedOriginalFraction: 0.8 },
} satisfies ToolExample<Input, Output>;
export const concentrationWithdrawalReplacementFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data", "learn"],
        fields: ["proportions", "mathematics"],
        keywords: ["proportions", "mathematics"],
      },
      id: "proportions/concentration-withdrawal-replacement-factor",
      title: "Concentration Withdrawal Replacement Factor",
      description:
        "Calculate concentration after explicit well-mixed withdrawal and equal-volume replacement under additive compatible volumes.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          originalConcentration: { type: "number", minimum: 0 },
          wellMixedVolume: { type: "number", exclusiveMinimum: 0 },
          withdrawnVolume: { type: "number", minimum: 0 },
          replacementConcentration: { type: "number", minimum: 0 },
        },
        required: [
          "originalConcentration",
          "wellMixedVolume",
          "withdrawnVolume",
          "replacementConcentration",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          finalConcentration: { type: "number" },
          retainedOriginalFraction: { type: "number" },
        },
        required: ["finalConcentration", "retainedOriginalFraction"],
      },
      ports: {
        inputs: [
          {
            id: "originalConcentration",
            label: "Original Concentration",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "wellMixedVolume",
            label: "Well Mixed Volume",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "withdrawnVolume",
            label: "Withdrawn Volume",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "replacementConcentration",
            label: "Replacement Concentration",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "finalConcentration",
            label: "Final Concentration",
            valueType: { type: "number" },
          },
          {
            id: "retainedOriginalFraction",
            label: "Retained Original Fraction",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = concentrationWithdrawalReplacementFactorTool.execute;
export default concentrationWithdrawalReplacementFactorTool;

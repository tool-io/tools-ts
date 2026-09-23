import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly treatmentMean: number;
  readonly controlMean: number;
  readonly pooledSd: number;
  readonly correction: number;
  readonly improvementIsLower: boolean;
};
export type Output = {
  readonly rawDifference: number;
  readonly standardizedDifference: number;
  readonly orientedEffect: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    treatmentMean: { type: "number" },
    controlMean: { type: "number" },
    pooledSd: { type: "number", exclusiveMinimum: 0 },
    correction: { type: "number", exclusiveMinimum: 0 },
    improvementIsLower: { type: "boolean" },
  },
  required: [
    "treatmentMean",
    "controlMean",
    "pooledSd",
    "correction",
    "improvementIsLower",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rawDifference: { type: "number" },
    standardizedDifference: { type: "number" },
    orientedEffect: { type: "number" },
  },
  required: ["rawDifference", "standardizedDifference", "orientedEffect"],
} as const;
/** A supplied research contrast and explicit standardized-effect correction, without inferring efficacy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    treatmentMean,
    controlMean,
    pooledSd,
    correction,
    improvementIsLower,
  } = request;
  const compute = (): Output => {
    H.positive(pooledSd);
    H.positive(correction);
    return {
      rawDifference: treatmentMean - controlMean,
      standardizedDifference:
        (correction * (treatmentMean - controlMean)) / pooledSd,
      orientedEffect:
        ((improvementIsLower ? -1 : 1) *
          correction *
          (treatmentMean - controlMean)) /
        pooledSd,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    treatmentMean: 4,
    controlMean: 6,
    pooledSd: 2,
    correction: 0.9,
    improvementIsLower: true,
  },
  output: {
    rawDifference: -2,
    standardizedDifference: -0.9,
    orientedEffect: 0.9,
  },
} satisfies ToolExample<Input, Output>;
export const chiropracticStudyEffectSizeOneContrastTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "chiropractic/chiropractic-study-effect-size-one-contrast",
      title: "Chiropractic Study Effect Size One Contrast Tool",
      description:
        "A supplied research contrast and explicit standardized-effect correction, without inferring efficacy.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          treatmentMean: { type: "number" },
          controlMean: { type: "number" },
          pooledSd: { type: "number", exclusiveMinimum: 0 },
          correction: { type: "number", exclusiveMinimum: 0 },
          improvementIsLower: { type: "boolean" },
        },
        required: [
          "treatmentMean",
          "controlMean",
          "pooledSd",
          "correction",
          "improvementIsLower",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          rawDifference: { type: "number" },
          standardizedDifference: { type: "number" },
          orientedEffect: { type: "number" },
        },
        required: ["rawDifference", "standardizedDifference", "orientedEffect"],
      },
      ports: {
        inputs: [
          {
            id: "treatmentMean",
            label: "Treatment Mean",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "controlMean",
            label: "Control Mean",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "pooledSd",
            label: "Pooled Sd",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "correction",
            label: "Correction",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "improvementIsLower",
            label: "Improvement Is Lower",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "rawDifference",
            label: "Raw Difference",
            valueType: { type: "number" },
          },
          {
            id: "standardizedDifference",
            label: "Standardized Difference",
            valueType: { type: "number" },
          },
          {
            id: "orientedEffect",
            label: "Oriented Effect",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = chiropracticStudyEffectSizeOneContrastTool.execute;
export default chiropracticStudyEffectSizeOneContrastTool;

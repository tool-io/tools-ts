import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly referenceLength: number;
  readonly targetLength: number;
  readonly referenceFrequency: number;
  readonly equalTensionDensity: boolean;
};
export type Output = {
  readonly lengthRatio: number;
  readonly predictedFrequency: number;
  readonly assumptionSatisfied: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    referenceLength: { type: "number", exclusiveMinimum: 0 },
    targetLength: { type: "number", exclusiveMinimum: 0 },
    referenceFrequency: { type: "number", exclusiveMinimum: 0 },
    equalTensionDensity: { type: "boolean" },
  },
  required: [
    "referenceLength",
    "targetLength",
    "referenceFrequency",
    "equalTensionDensity",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lengthRatio: { type: "number" },
    predictedFrequency: { type: "number" },
    assumptionSatisfied: { type: "boolean" },
  },
  required: ["lengthRatio", "predictedFrequency", "assumptionSatisfied"],
} as const;
/** Ideal string f∝1/L; flag records whether the caller affirms equal tension and linear density. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    referenceLength,
    targetLength,
    referenceFrequency,
    equalTensionDensity,
  } = request;
  const compute = (): Output => {
    H.positive(referenceLength);
    H.positive(targetLength);
    H.positive(referenceFrequency);
    return {
      lengthRatio: referenceLength / targetLength,
      predictedFrequency: (referenceFrequency * referenceLength) / targetLength,
      assumptionSatisfied: equalTensionDensity,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    referenceLength: 0.6,
    targetLength: 0.4,
    referenceFrequency: 220,
    equalTensionDensity: true,
  },
  output: {
    lengthRatio: 1.4999999999999998,
    predictedFrequency: 330,
    assumptionSatisfied: true,
  },
} satisfies ToolExample<Input, Output>;
export const instrumentStringSpeakingLengthRatioTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "ethnomusicology/instrument-string-speaking-length-ratio",
      title: "Instrument String Speaking Length Ratio Tool",
      description:
        "Ideal string f∝1/L; flag records whether the caller affirms equal tension and linear density.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          referenceLength: { type: "number", exclusiveMinimum: 0 },
          targetLength: { type: "number", exclusiveMinimum: 0 },
          referenceFrequency: { type: "number", exclusiveMinimum: 0 },
          equalTensionDensity: { type: "boolean" },
        },
        required: [
          "referenceLength",
          "targetLength",
          "referenceFrequency",
          "equalTensionDensity",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          lengthRatio: { type: "number" },
          predictedFrequency: { type: "number" },
          assumptionSatisfied: { type: "boolean" },
        },
        required: ["lengthRatio", "predictedFrequency", "assumptionSatisfied"],
      },
      ports: {
        inputs: [
          {
            id: "referenceLength",
            label: "Reference Length",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "targetLength",
            label: "Target Length",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "referenceFrequency",
            label: "Reference Frequency",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "equalTensionDensity",
            label: "Equal Tension Density",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "lengthRatio",
            label: "Length Ratio",
            valueType: { type: "number" },
          },
          {
            id: "predictedFrequency",
            label: "Predicted Frequency",
            valueType: { type: "number" },
          },
          {
            id: "assumptionSatisfied",
            label: "Assumption Satisfied",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = instrumentStringSpeakingLengthRatioTool.execute;
export default instrumentStringSpeakingLengthRatioTool;

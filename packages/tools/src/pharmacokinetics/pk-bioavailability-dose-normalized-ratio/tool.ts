import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly testAuc: number;
  readonly referenceAuc: number;
  readonly testAmount: number;
  readonly referenceAmount: number;
};
export type Output = {
  readonly testNormalized: number;
  readonly referenceNormalized: number;
  readonly relativeFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    testAuc: { type: "number", minimum: 0 },
    referenceAuc: { type: "number", exclusiveMinimum: 0 },
    testAmount: { type: "number", exclusiveMinimum: 0 },
    referenceAmount: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["testAuc", "referenceAuc", "testAmount", "referenceAmount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    testNormalized: { type: "number" },
    referenceNormalized: { type: "number" },
    relativeFraction: { type: "number" },
  },
  required: ["testNormalized", "referenceNormalized", "relativeFraction"],
} as const;
/** Supplied exposure normalization for a research comparison. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { testAuc, referenceAuc, testAmount, referenceAmount } = request;
  const compute = (): Output => {
    H.domain(testAuc >= 0);
    H.positive(referenceAuc);
    H.positive(testAmount);
    H.positive(referenceAmount);
    return {
      testNormalized: testAuc / testAmount,
      referenceNormalized: referenceAuc / referenceAmount,
      relativeFraction:
        (testAuc * referenceAmount) / (referenceAuc * testAmount),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    testAuc: 40,
    referenceAuc: 50,
    testAmount: 100,
    referenceAmount: 100,
  },
  output: {
    testNormalized: 0.4,
    referenceNormalized: 0.5,
    relativeFraction: 0.8,
  },
} satisfies ToolExample<Input, Output>;
export const pkBioavailabilityDoseNormalizedRatioTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "pharmacokinetics/pk-bioavailability-dose-normalized-ratio",
      title: "PK Bioavailability Dose Normalized Ratio Tool",
      description: "Supplied exposure normalization for a research comparison.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          testAuc: { type: "number", minimum: 0 },
          referenceAuc: { type: "number", exclusiveMinimum: 0 },
          testAmount: { type: "number", exclusiveMinimum: 0 },
          referenceAmount: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["testAuc", "referenceAuc", "testAmount", "referenceAmount"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          testNormalized: { type: "number" },
          referenceNormalized: { type: "number" },
          relativeFraction: { type: "number" },
        },
        required: ["testNormalized", "referenceNormalized", "relativeFraction"],
      },
      ports: {
        inputs: [
          {
            id: "testAuc",
            label: "Test Auc",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "referenceAuc",
            label: "Reference Auc",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "testAmount",
            label: "Test Amount",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "referenceAmount",
            label: "Reference Amount",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "testNormalized",
            label: "Test Normalized",
            valueType: { type: "number" },
          },
          {
            id: "referenceNormalized",
            label: "Reference Normalized",
            valueType: { type: "number" },
          },
          {
            id: "relativeFraction",
            label: "Relative Fraction",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = pkBioavailabilityDoseNormalizedRatioTool.execute;
export default pkBioavailabilityDoseNormalizedRatioTool;

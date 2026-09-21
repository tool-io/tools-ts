import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly baseRent: number;
  readonly qualityIndex: number;
  readonly referenceIndex: number;
  readonly elasticity: number;
};
export type Output = {
  readonly adjustmentFactor: number;
  readonly adjustedRent: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    baseRent: { type: "number", minimum: 0 },
    qualityIndex: { type: "number", exclusiveMinimum: 0 },
    referenceIndex: { type: "number", exclusiveMinimum: 0 },
    elasticity: { type: "number" },
  },
  required: ["baseRent", "qualityIndex", "referenceIndex", "elasticity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    adjustmentFactor: { type: "number" },
    adjustedRent: { type: "number" },
  },
  required: ["adjustmentFactor", "adjustedRent"],
} as const;
/** Caller-parameterized power adjustment, without inferring agronomic quality or a market rental valuation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { baseRent, qualityIndex, referenceIndex, elasticity } = request;
  const compute = (): Output => {
    H.domain(baseRent >= 0);
    H.positive(qualityIndex);
    H.positive(referenceIndex);
    return {
      adjustmentFactor: (qualityIndex / referenceIndex) ** elasticity,
      adjustedRent: baseRent * (qualityIndex / referenceIndex) ** elasticity,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    baseRent: 100,
    qualityIndex: 120,
    referenceIndex: 100,
    elasticity: 1,
  },
  output: { adjustmentFactor: 1.2, adjustedRent: 120 },
} satisfies ToolExample<Input, Output>;
export const agriculturalLandQualityRentAdjustmentTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "agricultural-economics/agricultural-land-quality-rent-adjustment",
      title: "Agricultural Land Quality Rent Adjustment Tool",
      description:
        "Caller-parameterized power adjustment, without inferring agronomic quality or a market rental valuation.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          baseRent: { type: "number", minimum: 0 },
          qualityIndex: { type: "number", exclusiveMinimum: 0 },
          referenceIndex: { type: "number", exclusiveMinimum: 0 },
          elasticity: { type: "number" },
        },
        required: ["baseRent", "qualityIndex", "referenceIndex", "elasticity"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          adjustmentFactor: { type: "number" },
          adjustedRent: { type: "number" },
        },
        required: ["adjustmentFactor", "adjustedRent"],
      },
      ports: {
        inputs: [
          {
            id: "baseRent",
            label: "Base Rent",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "qualityIndex",
            label: "Quality Index",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "referenceIndex",
            label: "Reference Index",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "elasticity",
            label: "Elasticity",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "adjustmentFactor",
            label: "Adjustment Factor",
            valueType: { type: "number" },
          },
          {
            id: "adjustedRent",
            label: "Adjusted Rent",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = agriculturalLandQualityRentAdjustmentTool.execute;
export default agriculturalLandQualityRentAdjustmentTool;

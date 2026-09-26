import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observedPrice: number;
  readonly observedQuality: number;
  readonly referenceQuality: number;
  readonly elasticity: number;
};
export type Output = { readonly adjustedPrice: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedPrice: { type: "number" },
    observedQuality: { type: "number", exclusiveMinimum: 0 },
    referenceQuality: { type: "number", exclusiveMinimum: 0 },
    elasticity: { type: "number" },
  },
  required: [
    "observedPrice",
    "observedQuality",
    "referenceQuality",
    "elasticity",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { adjustedPrice: { type: "number" } },
  required: ["adjustedPrice"],
} as const;
/** Quality-adjusted historic price under an explicitly supplied power-law quality model; no grade equivalence is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observedPrice, observedQuality, referenceQuality, elasticity } =
    request;
  const compute = (): Output => {
    H.positive(observedQuality);
    H.positive(referenceQuality);
    return {
      adjustedPrice:
        observedPrice * (referenceQuality / observedQuality) ** elasticity,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    observedPrice: 12,
    observedQuality: 2,
    referenceQuality: 3,
    elasticity: 1,
  },
  output: { adjustedPrice: 18 },
} satisfies ToolExample<Input, Output>;
export const historicPriceQualityAdjustmentCallerFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "economic-history/historic-price-quality-adjustment-caller-factor",
      title: "Historic Price Quality Adjustment Caller Factor Tool",
      description:
        "Quality-adjusted historic price under an explicitly supplied power-law quality model; no grade equivalence is inferred.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          observedPrice: { type: "number" },
          observedQuality: { type: "number", exclusiveMinimum: 0 },
          referenceQuality: { type: "number", exclusiveMinimum: 0 },
          elasticity: { type: "number" },
        },
        required: [
          "observedPrice",
          "observedQuality",
          "referenceQuality",
          "elasticity",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { adjustedPrice: { type: "number" } },
        required: ["adjustedPrice"],
      },
      ports: {
        inputs: [
          {
            id: "observedPrice",
            label: "Observed Price",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "observedQuality",
            label: "Observed Quality",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "referenceQuality",
            label: "Reference Quality",
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
            id: "adjustedPrice",
            label: "Adjusted Price",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = historicPriceQualityAdjustmentCallerFactorTool.execute;
export default historicPriceQualityAdjustmentCallerFactorTool;

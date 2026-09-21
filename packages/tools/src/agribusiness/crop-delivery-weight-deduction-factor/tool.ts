import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly grossWeight: number;
  readonly deductionFraction: number;
};
export type Output = {
  readonly netWeight: number;
  readonly deductedWeight: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossWeight: { type: "number", minimum: 0 },
    deductionFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["grossWeight", "deductionFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    netWeight: { type: "number" },
    deductedWeight: { type: "number" },
  },
  required: ["netWeight", "deductedWeight"],
} as const;
/** Calculate crop delivery weight deduction factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { grossWeight, deductionFraction } = request;
  const compute = (): Output => {
    H.domain(grossWeight >= 0);
    H.probability(deductionFraction);
    return {
      netWeight: grossWeight * (1 - deductionFraction),
      deductedWeight: grossWeight * deductionFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { grossWeight: 1000, deductionFraction: 0.05 },
  output: { netWeight: 950, deductedWeight: 50 },
} satisfies ToolExample<Input, Output>;
export const cropDeliveryWeightDeductionFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agribusiness/crop-delivery-weight-deduction-factor",
    title: "Crop Delivery Weight Deduction Factor Tool",
    description:
      "Calculate crop delivery weight deduction factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossWeight: { type: "number", minimum: 0 },
        deductionFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["grossWeight", "deductionFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        netWeight: { type: "number" },
        deductedWeight: { type: "number" },
      },
      required: ["netWeight", "deductedWeight"],
    },
    ports: {
      inputs: [
        {
          id: "grossWeight",
          label: "Gross Weight",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "deductionFraction",
          label: "Deduction Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "netWeight", label: "Net Weight", valueType: { type: "number" } },
        {
          id: "deductedWeight",
          label: "Deducted Weight",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = cropDeliveryWeightDeductionFactorTool.execute;
export default cropDeliveryWeightDeductionFactorTool;

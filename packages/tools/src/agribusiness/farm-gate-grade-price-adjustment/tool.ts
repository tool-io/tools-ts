import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly basePricePerUnit: number;
  readonly gradePremiumPerUnit: number;
  readonly quantity: number;
};
export type Output = {
  readonly adjustedPricePerUnit: number;
  readonly totalValue: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    basePricePerUnit: { type: "number", minimum: 0 },
    gradePremiumPerUnit: { type: "number" },
    quantity: { type: "number", minimum: 0 },
  },
  required: ["basePricePerUnit", "gradePremiumPerUnit", "quantity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    adjustedPricePerUnit: { type: "number" },
    totalValue: { type: "number" },
  },
  required: ["adjustedPricePerUnit", "totalValue"],
} as const;
/** Apply a supplied signed grade premium or discount to a farm-gate unit price and compatible quantity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { basePricePerUnit, gradePremiumPerUnit, quantity } = request;
  const compute = (): Output => {
    H.domain(
      basePricePerUnit >= 0 &&
        basePricePerUnit + gradePremiumPerUnit >= 0 &&
        quantity >= 0,
      "basePricePerUnit",
    );
    return {
      adjustedPricePerUnit: basePricePerUnit + gradePremiumPerUnit,
      totalValue: (basePricePerUnit + gradePremiumPerUnit) * quantity,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { basePricePerUnit: 20, gradePremiumPerUnit: 2, quantity: 100 },
  output: { adjustedPricePerUnit: 22, totalValue: 2200 },
} satisfies ToolExample<Input, Output>;
export const farmGateGradePriceAdjustmentTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["cost", "learn"],
      fields: ["agribusiness", "agriculture"],
      keywords: ["agribusiness", "agriculture"],
    },
    id: "agribusiness/farm-gate-grade-price-adjustment",
    title: "Farm Gate Grade Price Adjustment",
    description:
      "Apply a supplied signed grade premium or discount to a farm-gate unit price and compatible quantity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        basePricePerUnit: { type: "number", minimum: 0 },
        gradePremiumPerUnit: { type: "number" },
        quantity: { type: "number", minimum: 0 },
      },
      required: ["basePricePerUnit", "gradePremiumPerUnit", "quantity"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        adjustedPricePerUnit: { type: "number" },
        totalValue: { type: "number" },
      },
      required: ["adjustedPricePerUnit", "totalValue"],
    },
    ports: {
      inputs: [
        {
          id: "basePricePerUnit",
          label: "Base Price Per Unit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "gradePremiumPerUnit",
          label: "Grade Premium Per Unit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "quantity",
          label: "Quantity",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "adjustedPricePerUnit",
          label: "Adjusted Price Per Unit",
          valueType: { type: "number" },
        },
        {
          id: "totalValue",
          label: "Total Value",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = farmGateGradePriceAdjustmentTool.execute;
export default farmGateGradePriceAdjustmentTool;

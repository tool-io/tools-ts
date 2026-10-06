import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly baseUnitPrice: number;
  readonly suppliedPremiumPerUnit: number;
  readonly quantity: number;
};
export type Output = {
  readonly premiumValue: number;
  readonly totalValue: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    baseUnitPrice: { type: "number" },
    suppliedPremiumPerUnit: { type: "number" },
    quantity: { type: "number", minimum: 0 },
  },
  required: ["baseUnitPrice", "suppliedPremiumPerUnit", "quantity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    premiumValue: { type: "number" },
    totalValue: { type: "number" },
  },
  required: ["premiumValue", "totalValue"],
} as const;
/** Apply an explicit signed quality-price adjustment to supplied farm output quantity without determining grade. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { baseUnitPrice, suppliedPremiumPerUnit, quantity } = request;
  const compute = (): Output => {
    H.domain(quantity >= 0, "quantity");
    return {
      premiumValue: suppliedPremiumPerUnit * quantity,
      totalValue: (baseUnitPrice + suppliedPremiumPerUnit) * quantity,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { baseUnitPrice: 10, suppliedPremiumPerUnit: 2, quantity: 50 },
  output: { premiumValue: 100, totalValue: 600 },
} satisfies ToolExample<Input, Output>;
export const farmOutputQualityPremiumTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "agricultural-economics",
        "agricultural economics",
        "agriculture",
      ],
      keywords: ["agricultural economics", "agriculture"],
    },
    id: "agricultural-economics/farm-output-quality-premium",
    title: "Farm Output Quality Premium",
    description:
      "Apply an explicit signed quality-price adjustment to supplied farm output quantity without determining grade.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        baseUnitPrice: { type: "number" },
        suppliedPremiumPerUnit: { type: "number" },
        quantity: { type: "number", minimum: 0 },
      },
      required: ["baseUnitPrice", "suppliedPremiumPerUnit", "quantity"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        premiumValue: { type: "number" },
        totalValue: { type: "number" },
      },
      required: ["premiumValue", "totalValue"],
    },
    ports: {
      inputs: [
        {
          id: "baseUnitPrice",
          label: "Base Unit Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedPremiumPerUnit",
          label: "Supplied Premium Per Unit",
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
          id: "premiumValue",
          label: "Premium Value",
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
export const run = farmOutputQualityPremiumTool.execute;
export default farmOutputQualityPremiumTool;

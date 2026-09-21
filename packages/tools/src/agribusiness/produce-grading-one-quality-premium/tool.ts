import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly quantity: number;
  readonly basePrice: number;
  readonly gradePremium: number;
  readonly acceptedFraction: number;
};
export type Output = {
  readonly acceptedQuantity: number;
  readonly premiumValue: number;
  readonly totalValue: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    quantity: { type: "number", minimum: 0 },
    basePrice: { type: "number", minimum: 0 },
    gradePremium: { type: "number" },
    acceptedFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["quantity", "basePrice", "gradePremium", "acceptedFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    acceptedQuantity: { type: "number" },
    premiumValue: { type: "number" },
    totalValue: { type: "number" },
  },
  required: ["acceptedQuantity", "premiumValue", "totalValue"],
} as const;
/** Apply an explicit per-unit grade premium, allowing a negative supplied premium to represent a discount. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { quantity, basePrice, gradePremium, acceptedFraction } = request;
  const compute = (): Output => {
    H.domain(quantity >= 0 && basePrice >= 0);
    H.probability(acceptedFraction);
    return {
      acceptedQuantity: quantity * acceptedFraction,
      premiumValue: quantity * acceptedFraction * gradePremium,
      totalValue:
        quantity * basePrice + quantity * acceptedFraction * gradePremium,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    quantity: 100,
    basePrice: 2,
    gradePremium: 0.5,
    acceptedFraction: 0.8,
  },
  output: { acceptedQuantity: 80, premiumValue: 40, totalValue: 240 },
} satisfies ToolExample<Input, Output>;
export const produceGradingOneQualityPremiumTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agribusiness/produce-grading-one-quality-premium",
    title: "Produce Grading One Quality Premium Tool",
    description:
      "Apply an explicit per-unit grade premium, allowing a negative supplied premium to represent a discount.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        quantity: { type: "number", minimum: 0 },
        basePrice: { type: "number", minimum: 0 },
        gradePremium: { type: "number" },
        acceptedFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["quantity", "basePrice", "gradePremium", "acceptedFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        acceptedQuantity: { type: "number" },
        premiumValue: { type: "number" },
        totalValue: { type: "number" },
      },
      required: ["acceptedQuantity", "premiumValue", "totalValue"],
    },
    ports: {
      inputs: [
        {
          id: "quantity",
          label: "Quantity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "basePrice",
          label: "Base Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "gradePremium",
          label: "Grade Premium",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "acceptedFraction",
          label: "Accepted Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "acceptedQuantity",
          label: "Accepted Quantity",
          valueType: { type: "number" },
        },
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
export const run = produceGradingOneQualityPremiumTool.execute;
export default produceGradingOneQualityPremiumTool;

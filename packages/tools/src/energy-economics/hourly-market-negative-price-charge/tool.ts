import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly marketPricePerEnergy: number;
  readonly purchasedEnergy: number;
};
export type Output = {
  readonly signedCost: number;
  readonly negativePrice: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    marketPricePerEnergy: { type: "number" },
    purchasedEnergy: { type: "number", minimum: 0 },
  },
  required: ["marketPricePerEnergy", "purchasedEnergy"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signedCost: { type: "number" },
    negativePrice: { type: "boolean" },
  },
  required: ["signedCost", "negativePrice"],
} as const;
/** Multiply an explicit signed hourly market price by nonnegative purchased energy without removing negative-price credits. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { marketPricePerEnergy, purchasedEnergy } = request;
  const compute = (): Output => {
    H.domain(purchasedEnergy >= 0, "purchasedEnergy");
    return {
      signedCost: marketPricePerEnergy * purchasedEnergy,
      negativePrice: marketPricePerEnergy < 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { marketPricePerEnergy: -20, purchasedEnergy: 3 },
  output: { signedCost: -60, negativePrice: true },
} satisfies ToolExample<Input, Output>;
export const hourlyMarketNegativePriceChargeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "energy-economics/hourly-market-negative-price-charge",
    title: "Hourly Market Negative Price Charge Tool",
    description:
      "Multiply an explicit signed hourly market price by nonnegative purchased energy without removing negative-price credits.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        marketPricePerEnergy: { type: "number" },
        purchasedEnergy: { type: "number", minimum: 0 },
      },
      required: ["marketPricePerEnergy", "purchasedEnergy"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signedCost: { type: "number" },
        negativePrice: { type: "boolean" },
      },
      required: ["signedCost", "negativePrice"],
    },
    ports: {
      inputs: [
        {
          id: "marketPricePerEnergy",
          label: "Market Price Per Energy",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "purchasedEnergy",
          label: "Purchased Energy",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "signedCost",
          label: "Signed Cost",
          valueType: { type: "number" },
        },
        {
          id: "negativePrice",
          label: "Negative Price",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = hourlyMarketNegativePriceChargeTool.execute;
export default hourlyMarketNegativePriceChargeTool;

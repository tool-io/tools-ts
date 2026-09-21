import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly hammerPrice: number;
  readonly premiumRate: number;
  readonly taxRate: number;
  readonly taxPremium: boolean;
};
export type Output = {
  readonly premium: number;
  readonly tax: number;
  readonly total: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    hammerPrice: { type: "number", minimum: 0 },
    premiumRate: { type: "number", minimum: 0 },
    taxRate: { type: "number", minimum: 0 },
    taxPremium: { type: "boolean" },
  },
  required: ["hammerPrice", "premiumRate", "taxRate", "taxPremium"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    premium: { type: "number" },
    tax: { type: "number" },
    total: { type: "number" },
  },
  required: ["premium", "tax", "total"],
} as const;
/** Explicit hammer-price premium and tax-base convention; no auction or jurisdiction rule is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { hammerPrice, premiumRate, taxRate, taxPremium } = request;
  const compute = (): Output => {
    H.domain(hammerPrice >= 0 && premiumRate >= 0 && taxRate >= 0);
    return {
      premium: hammerPrice * premiumRate,
      tax:
        (hammerPrice + (taxPremium ? hammerPrice * premiumRate : 0)) * taxRate,
      total:
        hammerPrice * (1 + premiumRate) +
        (hammerPrice + (taxPremium ? hammerPrice * premiumRate : 0)) * taxRate,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    hammerPrice: 1000,
    premiumRate: 0.1,
    taxRate: 0.2,
    taxPremium: true,
  },
  output: { premium: 100, tax: 220, total: 1320 },
} satisfies ToolExample<Input, Output>;
export const farmAuctionBuyerPremiumBaseTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agribusiness/farm-auction-buyer-premium-base",
    title: "Farm Auction Buyer Premium Base Tool",
    description:
      "Explicit hammer-price premium and tax-base convention; no auction or jurisdiction rule is inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        hammerPrice: { type: "number", minimum: 0 },
        premiumRate: { type: "number", minimum: 0 },
        taxRate: { type: "number", minimum: 0 },
        taxPremium: { type: "boolean" },
      },
      required: ["hammerPrice", "premiumRate", "taxRate", "taxPremium"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        premium: { type: "number" },
        tax: { type: "number" },
        total: { type: "number" },
      },
      required: ["premium", "tax", "total"],
    },
    ports: {
      inputs: [
        {
          id: "hammerPrice",
          label: "Hammer Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "premiumRate",
          label: "Premium Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "taxRate",
          label: "Tax Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "taxPremium",
          label: "Tax Premium",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "premium", label: "Premium", valueType: { type: "number" } },
        { id: "tax", label: "Tax", valueType: { type: "number" } },
        { id: "total", label: "Total", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = farmAuctionBuyerPremiumBaseTool.execute;
export default farmAuctionBuyerPremiumBaseTool;

import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly acceptedQuantity: number;
  readonly basePrice: number;
  readonly premiumPerUnit: number;
  readonly premiumEligibleFraction: number;
};
export type Output = {
  readonly basePayment: number;
  readonly premium: number;
  readonly total: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    acceptedQuantity: { type: "number", minimum: 0 },
    basePrice: { type: "number", minimum: 0 },
    premiumPerUnit: { type: "number", minimum: 0 },
    premiumEligibleFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: [
    "acceptedQuantity",
    "basePrice",
    "premiumPerUnit",
    "premiumEligibleFraction",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    basePayment: { type: "number" },
    premium: { type: "number" },
    total: { type: "number" },
  },
  required: ["basePayment", "premium", "total"],
} as const;
/** Calculate public food purchase quality premium term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    acceptedQuantity,
    basePrice,
    premiumPerUnit,
    premiumEligibleFraction,
  } = request;
  const compute = (): Output => {
    H.domain(acceptedQuantity >= 0 && basePrice >= 0 && premiumPerUnit >= 0);
    H.probability(premiumEligibleFraction);
    return {
      basePayment: acceptedQuantity * basePrice,
      premium: acceptedQuantity * premiumEligibleFraction * premiumPerUnit,
      total:
        acceptedQuantity * basePrice +
        acceptedQuantity * premiumEligibleFraction * premiumPerUnit,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    acceptedQuantity: 100,
    basePrice: 10,
    premiumPerUnit: 2,
    premiumEligibleFraction: 0.5,
  },
  output: { basePayment: 1000, premium: 100, total: 1100 },
} satisfies ToolExample<Input, Output>;
export const publicFoodPurchaseQualityPremiumTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "agricultural-policy/public-food-purchase-quality-premium-term",
      title: "Public Food Purchase Quality Premium Term Tool",
      description:
        "Calculate public food purchase quality premium term from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          acceptedQuantity: { type: "number", minimum: 0 },
          basePrice: { type: "number", minimum: 0 },
          premiumPerUnit: { type: "number", minimum: 0 },
          premiumEligibleFraction: { type: "number", minimum: 0, maximum: 1 },
        },
        required: [
          "acceptedQuantity",
          "basePrice",
          "premiumPerUnit",
          "premiumEligibleFraction",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          basePayment: { type: "number" },
          premium: { type: "number" },
          total: { type: "number" },
        },
        required: ["basePayment", "premium", "total"],
      },
      ports: {
        inputs: [
          {
            id: "acceptedQuantity",
            label: "Accepted Quantity",
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
            id: "premiumPerUnit",
            label: "Premium Per Unit",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "premiumEligibleFraction",
            label: "Premium Eligible Fraction",
            required: true,
            valueType: { type: "number", unit: "1" },
          },
        ],
        outputs: [
          {
            id: "basePayment",
            label: "Base Payment",
            valueType: { type: "number" },
          },
          { id: "premium", label: "Premium", valueType: { type: "number" } },
          { id: "total", label: "Total", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = publicFoodPurchaseQualityPremiumTermTool.execute;
export default publicFoodPurchaseQualityPremiumTermTool;

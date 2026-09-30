import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly redeemed: number;
  readonly returned: number;
  readonly issued: number;
  readonly discountPerRedemption: number;
};
export type Output = {
  readonly netRedemptions: number;
  readonly rate: number;
  readonly netDiscountCost: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    redeemed: { type: "integer", minimum: 0 },
    returned: { type: "integer", minimum: 0 },
    issued: { type: "integer", minimum: 1 },
    discountPerRedemption: { type: "number", minimum: 0 },
  },
  required: ["redeemed", "returned", "issued", "discountPerRedemption"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    netRedemptions: { type: "integer" },
    rate: { type: "number" },
    netDiscountCost: { type: "number" },
  },
  required: ["netRedemptions", "rate", "netDiscountCost"],
} as const;
/** Calculate coupon redemption returns adjusted count from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { redeemed, returned, issued, discountPerRedemption } = request;
  const compute = (): Output => {
    H.integer(issued, 1);
    H.integer(redeemed, 0, issued);
    H.integer(returned, 0, redeemed);
    H.domain(discountPerRedemption >= 0);
    return {
      netRedemptions: redeemed - returned,
      rate: (redeemed - returned) / issued,
      netDiscountCost: (redeemed - returned) * discountPerRedemption,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { redeemed: 100, returned: 20, issued: 400, discountPerRedemption: 5 },
  output: { netRedemptions: 80, rate: 0.2, netDiscountCost: 400 },
} satisfies ToolExample<Input, Output>;
export const couponRedemptionReturnsAdjustedCountTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "marketing/coupon-redemption-returns-adjusted-count",
      title: "Coupon Redemption Returns Adjusted Count Tool",
      description:
        "Calculate coupon redemption returns adjusted count from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          redeemed: { type: "integer", minimum: 0 },
          returned: { type: "integer", minimum: 0 },
          issued: { type: "integer", minimum: 1 },
          discountPerRedemption: { type: "number", minimum: 0 },
        },
        required: ["redeemed", "returned", "issued", "discountPerRedemption"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          netRedemptions: { type: "integer" },
          rate: { type: "number" },
          netDiscountCost: { type: "number" },
        },
        required: ["netRedemptions", "rate", "netDiscountCost"],
      },
      ports: {
        inputs: [
          {
            id: "redeemed",
            label: "Redeemed",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "returned",
            label: "Returned",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "issued",
            label: "Issued",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "discountPerRedemption",
            label: "Discount Per Redemption",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "netRedemptions",
            label: "Net Redemptions",
            valueType: { type: "integer" },
          },
          { id: "rate", label: "Rate", valueType: { type: "number" } },
          {
            id: "netDiscountCost",
            label: "Net Discount Cost",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = couponRedemptionReturnsAdjustedCountTool.execute;
export default couponRedemptionReturnsAdjustedCountTool;

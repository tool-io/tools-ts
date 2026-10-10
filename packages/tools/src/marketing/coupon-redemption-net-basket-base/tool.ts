import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly basketAmount: number;
  readonly excludedAmount: number;
  readonly suppliedCouponFraction: number;
};
export type Output = {
  readonly eligibleBasket: number;
  readonly couponAmount: number;
  readonly netBasket: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    basketAmount: { type: "number", minimum: 0 },
    excludedAmount: { type: "number", minimum: 0 },
    suppliedCouponFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["basketAmount", "excludedAmount", "suppliedCouponFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eligibleBasket: { type: "number" },
    couponAmount: { type: "number" },
    netBasket: { type: "number" },
  },
  required: ["eligibleBasket", "couponAmount", "netBasket"],
} as const;
/** Apply an explicit coupon fraction to a supplied eligible basket after exclusions without inferring coupon restrictions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { basketAmount, excludedAmount, suppliedCouponFraction } = request;
  const compute = (): Output => {
    H.domain(
      basketAmount >= 0 &&
        excludedAmount >= 0 &&
        excludedAmount <= basketAmount,
      "basketAmount",
    );
    (H.domain(
      suppliedCouponFraction >= 0 && suppliedCouponFraction <= 1,
      "suppliedCouponFraction",
    ),
      suppliedCouponFraction);
    return {
      eligibleBasket: basketAmount - excludedAmount,
      couponAmount: (basketAmount - excludedAmount) * suppliedCouponFraction,
      netBasket:
        basketAmount - (basketAmount - excludedAmount) * suppliedCouponFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    basketAmount: 100,
    excludedAmount: 20,
    suppliedCouponFraction: 0.25,
  },
  output: { eligibleBasket: 80, couponAmount: 20, netBasket: 80 },
} satisfies ToolExample<Input, Output>;
export const couponRedemptionNetBasketBaseTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["marketing", "business and finance"],
      keywords: ["marketing", "business and finance"],
    },
    id: "marketing/coupon-redemption-net-basket-base",
    title: "Coupon Redemption Net Basket Base",
    description:
      "Apply an explicit coupon fraction to a supplied eligible basket after exclusions without inferring coupon restrictions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        basketAmount: { type: "number", minimum: 0 },
        excludedAmount: { type: "number", minimum: 0 },
        suppliedCouponFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["basketAmount", "excludedAmount", "suppliedCouponFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eligibleBasket: { type: "number" },
        couponAmount: { type: "number" },
        netBasket: { type: "number" },
      },
      required: ["eligibleBasket", "couponAmount", "netBasket"],
    },
    ports: {
      inputs: [
        {
          id: "basketAmount",
          label: "Basket Amount",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "excludedAmount",
          label: "Excluded Amount",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedCouponFraction",
          label: "Supplied Coupon Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "eligibleBasket",
          label: "Eligible Basket",
          valueType: { type: "number" },
        },
        {
          id: "couponAmount",
          label: "Coupon Amount",
          valueType: { type: "number" },
        },
        { id: "netBasket", label: "Net Basket", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = couponRedemptionNetBasketBaseTool.execute;
export default couponRedemptionNetBasketBaseTool;

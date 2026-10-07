import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly lineValue: number;
  readonly basketValue: number;
  readonly basketCoupon: number;
};
export type Output = {
  readonly lineDiscount: number;
  readonly discountedLineValue: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lineValue: { type: "number", minimum: 0 },
    basketValue: { type: "number", exclusiveMinimum: 0 },
    basketCoupon: { type: "number", minimum: 0 },
  },
  required: ["lineValue", "basketValue", "basketCoupon"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lineDiscount: { type: "number" },
    discountedLineValue: { type: "number" },
  },
  required: ["lineDiscount", "discountedLineValue"],
} as const;
/** Allocate a supplied basket coupon proportionally to one line value without rounding or selecting promotion eligibility. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { lineValue, basketValue, basketCoupon } = request;
  const compute = (): Output => {
    (H.domain(Number.isFinite(basketValue) && basketValue > 0, "basketValue"),
      basketValue);
    H.domain(lineValue >= 0 && lineValue <= basketValue, "lineValue");
    H.domain(basketCoupon >= 0 && basketCoupon <= basketValue, "basketCoupon");
    return {
      lineDiscount: (lineValue / basketValue) * basketCoupon,
      discountedLineValue: lineValue - (lineValue / basketValue) * basketCoupon,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { lineValue: 30, basketValue: 120, basketCoupon: 20 },
  output: { lineDiscount: 5, discountedLineValue: 25 },
} satisfies ToolExample<Input, Output>;
export const basketCouponProratedLineDiscountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "business-analytics",
        "business analytics",
        "business and finance",
      ],
      keywords: ["business analytics", "business and finance"],
    },
    id: "business-analytics/basket-coupon-prorated-line-discount",
    title: "Basket Coupon Prorated Line Discount",
    description:
      "Allocate a supplied basket coupon proportionally to one line value without rounding or selecting promotion eligibility.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lineValue: { type: "number", minimum: 0 },
        basketValue: { type: "number", exclusiveMinimum: 0 },
        basketCoupon: { type: "number", minimum: 0 },
      },
      required: ["lineValue", "basketValue", "basketCoupon"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lineDiscount: { type: "number" },
        discountedLineValue: { type: "number" },
      },
      required: ["lineDiscount", "discountedLineValue"],
    },
    ports: {
      inputs: [
        {
          id: "lineValue",
          label: "Line Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "basketValue",
          label: "Basket Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "basketCoupon",
          label: "Basket Coupon",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "lineDiscount",
          label: "Line Discount",
          valueType: { type: "number" },
        },
        {
          id: "discountedLineValue",
          label: "Discounted Line Value",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = basketCouponProratedLineDiscountTool.execute;
export default basketCouponProratedLineDiscountTool;

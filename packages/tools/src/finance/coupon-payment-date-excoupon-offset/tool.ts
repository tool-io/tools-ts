import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly daysToPayment: number;
  readonly exCouponDays: number;
};
export type Output = {
  readonly daysToExCoupon: number;
  readonly exCoupon: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    daysToPayment: { type: "integer" },
    exCouponDays: { type: "integer", minimum: 0 },
  },
  required: ["daysToPayment", "exCouponDays"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    daysToExCoupon: { type: "integer" },
    exCoupon: { type: "boolean" },
  },
  required: ["daysToExCoupon", "exCoupon"],
} as const;
/** Locate an explicit ex-coupon boundary relative to payment, with entry at the boundary. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { daysToPayment, exCouponDays } = input;
  const compute = (): Output => {
    H.integer(exCouponDays, 0);
    const daysToExCoupon = daysToPayment - exCouponDays;
    return { daysToExCoupon, exCoupon: daysToExCoupon <= 0 };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { daysToPayment: 8, exCouponDays: 5 },
  output: { daysToExCoupon: 3, exCoupon: false },
} satisfies ToolExample<Input, Output>;
export const couponPaymentDateExcouponOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "finance/coupon-payment-date-excoupon-offset",
    title: "Coupon Payment Date Excoupon Offset Tool",
    description:
      "Locate an explicit ex-coupon boundary relative to payment, with entry at the boundary.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        daysToPayment: { type: "integer" },
        exCouponDays: { type: "integer", minimum: 0 },
      },
      required: ["daysToPayment", "exCouponDays"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        daysToExCoupon: { type: "integer" },
        exCoupon: { type: "boolean" },
      },
      required: ["daysToExCoupon", "exCoupon"],
    },
    ports: {
      inputs: [
        {
          id: "daysToPayment",
          label: "Days To Payment",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "exCouponDays",
          label: "Ex Coupon Days",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "daysToExCoupon",
          label: "Days To Ex Coupon",
          valueType: { type: "integer" },
        },
        { id: "exCoupon", label: "Ex Coupon", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = couponPaymentDateExcouponOffsetTool.execute;
export default couponPaymentDateExcouponOffsetTool;

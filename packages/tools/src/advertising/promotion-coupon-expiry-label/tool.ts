import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly couponCode: string;
  readonly expiryDate: string;
  readonly asOfDate: string;
};
export type Output = { readonly label: string; readonly expired: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    couponCode: { type: "string", maxLength: 8192 },
    expiryDate: { type: "string", maxLength: 8192 },
    asOfDate: { type: "string", maxLength: 8192 },
  },
  required: ["couponCode", "expiryDate", "asOfDate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    label: { type: "string", maxLength: 8192 },
    expired: { type: "boolean" },
  },
  required: ["label", "expired"],
} as const;
/** Label a coupon with an explicit inclusive expiry date and compare an explicit as-of date, without redeeming or checking other terms. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { couponCode, expiryDate, asOfDate } = request;
  const compute = (): Output => {
    const namedDate = (value: string, field: string): Date => {
      H.domain(/^\d{4}-\d{2}-\d{2}(?![\s\S])/.test(value), field);
      const date = new Date(value + "T00:00:00Z");
      H.domain(
        Number.isFinite(date.getTime()) &&
          date.toISOString().slice(0, 10) === value,
        field,
      );
      return date;
    };
    H.domain(couponCode.length > 0, "couponCode");
    const e = namedDate(expiryDate, "expiryDate").getTime(),
      t = namedDate(asOfDate, "asOfDate").getTime();
    return {
      label: couponCode + " valid through " + expiryDate,
      expired: t > e,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    couponCode: "SAVE10",
    expiryDate: "2026-11-01",
    asOfDate: "2026-11-01",
  },
  output: { label: "SAVE10 valid through 2026-11-01", expired: false },
} satisfies ToolExample<Input, Output>;
export const promotionCouponExpiryLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "advertising/promotion-coupon-expiry-label",
    title: "Promotion Coupon Expiry Label Tool",
    description:
      "Label a coupon with an explicit inclusive expiry date and compare an explicit as-of date, without redeeming or checking other terms.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        couponCode: { type: "string", maxLength: 8192 },
        expiryDate: { type: "string", maxLength: 8192 },
        asOfDate: { type: "string", maxLength: 8192 },
      },
      required: ["couponCode", "expiryDate", "asOfDate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        label: { type: "string", maxLength: 8192 },
        expired: { type: "boolean" },
      },
      required: ["label", "expired"],
    },
    ports: {
      inputs: [
        {
          id: "couponCode",
          label: "Coupon Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "expiryDate",
          label: "Expiry Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "asOfDate",
          label: "As Of Date",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "label", label: "Label", valueType: { type: "string" } },
        { id: "expired", label: "Expired", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = promotionCouponExpiryLabelTool.execute;
export default promotionCouponExpiryLabelTool;

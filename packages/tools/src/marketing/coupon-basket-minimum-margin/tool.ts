import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly basketSubtotal: number;
  readonly minimumSubtotal: number;
};
export type Output = { readonly margin: number; readonly eligible: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    basketSubtotal: { type: "number", minimum: 0 },
    minimumSubtotal: { type: "number", minimum: 0 },
  },
  required: ["basketSubtotal", "minimumSubtotal"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { margin: { type: "number" }, eligible: { type: "boolean" } },
  required: ["margin", "eligible"],
} as const;
/** Compare a basket subtotal with an explicit inclusive coupon minimum, without applying exclusions or issuing a discount. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { basketSubtotal, minimumSubtotal } = request;
  const compute = (): Output => {
    H.domain(basketSubtotal >= 0 && minimumSubtotal >= 0, "basketSubtotal");
    return {
      margin: basketSubtotal - minimumSubtotal,
      eligible: basketSubtotal >= minimumSubtotal,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { basketSubtotal: 55, minimumSubtotal: 50 },
  output: { margin: 5, eligible: true },
} satisfies ToolExample<Input, Output>;
export const couponBasketMinimumMarginTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "marketing/coupon-basket-minimum-margin",
    title: "Coupon Basket Minimum Margin Tool",
    description:
      "Compare a basket subtotal with an explicit inclusive coupon minimum, without applying exclusions or issuing a discount.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        basketSubtotal: { type: "number", minimum: 0 },
        minimumSubtotal: { type: "number", minimum: 0 },
      },
      required: ["basketSubtotal", "minimumSubtotal"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { margin: { type: "number" }, eligible: { type: "boolean" } },
      required: ["margin", "eligible"],
    },
    ports: {
      inputs: [
        {
          id: "basketSubtotal",
          label: "Basket Subtotal",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "minimumSubtotal",
          label: "Minimum Subtotal",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "margin", label: "Margin", valueType: { type: "number" } },
        { id: "eligible", label: "Eligible", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = couponBasketMinimumMarginTool.execute;
export default couponBasketMinimumMarginTool;

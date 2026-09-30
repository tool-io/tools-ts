import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly price: number;
  readonly fixedDiscount: number;
  readonly percentDiscount: number;
};
export type Output = {
  readonly fixedThenPercent: number;
  readonly percentThenFixed: number;
  readonly gap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    price: { type: "number" },
    fixedDiscount: { type: "number", minimum: 0 },
    percentDiscount: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["price", "fixedDiscount", "percentDiscount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fixedThenPercent: { type: "number" },
    percentThenFixed: { type: "number" },
    gap: { type: "number" },
  },
  required: ["fixedThenPercent", "percentThenFixed", "gap"],
} as const;
/** Compare uncapped arithmetic orderings; signed totals are retained rather than applying an unstated checkout floor. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { price, fixedDiscount, percentDiscount } = request;
  const compute = (): Output => {
    H.domain(fixedDiscount >= 0 && price >= fixedDiscount);
    H.probability(percentDiscount);
    return {
      fixedThenPercent: (price - fixedDiscount) * (1 - percentDiscount),
      percentThenFixed: price * (1 - percentDiscount) - fixedDiscount,
      gap: fixedDiscount * percentDiscount,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { price: 100, fixedDiscount: 20, percentDiscount: 0.1 },
  output: { fixedThenPercent: 72, percentThenFixed: 70, gap: 2 },
} satisfies ToolExample<Input, Output>;
export const couponStackPercentFixedOrderGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "marketing/coupon-stack-percent-fixed-order-gap",
    title: "Coupon Stack Percent Fixed Order Gap Tool",
    description:
      "Compare uncapped arithmetic orderings; signed totals are retained rather than applying an unstated checkout floor.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        price: { type: "number" },
        fixedDiscount: { type: "number", minimum: 0 },
        percentDiscount: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["price", "fixedDiscount", "percentDiscount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fixedThenPercent: { type: "number" },
        percentThenFixed: { type: "number" },
        gap: { type: "number" },
      },
      required: ["fixedThenPercent", "percentThenFixed", "gap"],
    },
    ports: {
      inputs: [
        {
          id: "price",
          label: "Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "fixedDiscount",
          label: "Fixed Discount",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "percentDiscount",
          label: "Percent Discount",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "fixedThenPercent",
          label: "Fixed Then Percent",
          valueType: { type: "number" },
        },
        {
          id: "percentThenFixed",
          label: "Percent Then Fixed",
          valueType: { type: "number" },
        },
        { id: "gap", label: "Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = couponStackPercentFixedOrderGapTool.execute;
export default couponStackPercentFixedOrderGapTool;

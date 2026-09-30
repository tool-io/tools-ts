import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly price: number;
  readonly fixedDiscount: number;
  readonly fractionDiscount: number;
};
export type Output = {
  readonly fixedThenFraction: number;
  readonly fractionThenFixed: number;
  readonly difference: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    price: { type: "number", minimum: 0 },
    fixedDiscount: { type: "number", minimum: 0 },
    fractionDiscount: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["price", "fixedDiscount", "fractionDiscount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fixedThenFraction: { type: "number" },
    fractionThenFixed: { type: "number" },
    difference: { type: "number" },
  },
  required: ["fixedThenFraction", "fractionThenFixed", "difference"],
} as const;
/** Compare uncapped additive and fractional discount order; negative intermediate prices are retained. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { price, fixedDiscount, fractionDiscount } = request;
  const compute = (): Output => {
    H.domain(price >= 0 && fixedDiscount >= 0);
    H.probability(fractionDiscount);
    return {
      fixedThenFraction: (price - fixedDiscount) * (1 - fractionDiscount),
      fractionThenFixed: price * (1 - fractionDiscount) - fixedDiscount,
      difference: fixedDiscount * fractionDiscount,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { price: 100, fixedDiscount: 10, fractionDiscount: 0.2 },
  output: { fixedThenFraction: 72, fractionThenFixed: 70, difference: 2 },
} satisfies ToolExample<Input, Output>;
export const offerStackOrderDifferenceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "marketing/offer-stack-order-difference",
    title: "Offer Stack Order Difference Tool",
    description:
      "Compare uncapped additive and fractional discount order; negative intermediate prices are retained.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        price: { type: "number", minimum: 0 },
        fixedDiscount: { type: "number", minimum: 0 },
        fractionDiscount: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["price", "fixedDiscount", "fractionDiscount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fixedThenFraction: { type: "number" },
        fractionThenFixed: { type: "number" },
        difference: { type: "number" },
      },
      required: ["fixedThenFraction", "fractionThenFixed", "difference"],
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
          id: "fractionDiscount",
          label: "Fraction Discount",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "fixedThenFraction",
          label: "Fixed Then Fraction",
          valueType: { type: "number" },
        },
        {
          id: "fractionThenFixed",
          label: "Fraction Then Fixed",
          valueType: { type: "number" },
        },
        {
          id: "difference",
          label: "Difference",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = offerStackOrderDifferenceTool.execute;
export default offerStackOrderDifferenceTool;

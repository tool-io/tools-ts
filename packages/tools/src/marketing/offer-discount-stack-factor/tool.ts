import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly discountFractions: readonly number[];
  readonly basePrice: number;
};
export type Output = {
  readonly remainingFactor: number;
  readonly finalPrice: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    discountFractions: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    basePrice: { type: "number", minimum: 0 },
  },
  required: ["discountFractions", "basePrice"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    remainingFactor: { type: "number" },
    finalPrice: { type: "number" },
  },
  required: ["remainingFactor", "finalPrice"],
} as const;
/** Apply successive multiplicative caller-supplied discounts, without adding percentage rates. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { discountFractions, basePrice } = request;
  const compute = (): Output => {
    H.domain(
      discountFractions.every((x) => x >= 0 && x <= 1) && basePrice >= 0,
    );
    return {
      remainingFactor: discountFractions.reduce((a, b) => a * (1 - b), 1),
      finalPrice:
        basePrice * discountFractions.reduce((a, b) => a * (1 - b), 1),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { discountFractions: [0.2, 0.25], basePrice: 100 },
  output: {
    remainingFactor: 0.6000000000000001,
    finalPrice: 60.00000000000001,
  },
} satisfies ToolExample<Input, Output>;
export const offerDiscountStackFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "marketing/offer-discount-stack-factor",
    title: "Offer Discount Stack Factor Tool",
    description:
      "Apply successive multiplicative caller-supplied discounts, without adding percentage rates.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        discountFractions: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        basePrice: { type: "number", minimum: 0 },
      },
      required: ["discountFractions", "basePrice"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        remainingFactor: { type: "number" },
        finalPrice: { type: "number" },
      },
      required: ["remainingFactor", "finalPrice"],
    },
    ports: {
      inputs: [
        {
          id: "discountFractions",
          label: "Discount Fractions",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "basePrice",
          label: "Base Price",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "remainingFactor",
          label: "Remaining Factor",
          valueType: { type: "number" },
        },
        {
          id: "finalPrice",
          label: "Final Price",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = offerDiscountStackFactorTool.execute;
export default offerDiscountStackFactorTool;

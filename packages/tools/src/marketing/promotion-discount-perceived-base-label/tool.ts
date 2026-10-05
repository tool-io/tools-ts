import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly originalPrice: number;
  readonly discountAmount: number;
};
export type Output = {
  readonly discountPercentOfOriginal: number;
  readonly finalPrice: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    originalPrice: { type: "number", exclusiveMinimum: 0 },
    discountAmount: { type: "number", minimum: 0 },
  },
  required: ["originalPrice", "discountAmount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    discountPercentOfOriginal: { type: "number" },
    finalPrice: { type: "number" },
  },
  required: ["discountPercentOfOriginal", "finalPrice"],
} as const;
/** Express an explicit promotion discount against its original-price base, without modelling consumer perception. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { originalPrice, discountAmount } = request;
  const compute = (): Output => {
    (H.domain(originalPrice > 0, "originalPrice"), originalPrice);
    H.domain(
      discountAmount >= 0 && discountAmount <= originalPrice,
      "discountAmount",
    );
    return {
      discountPercentOfOriginal: (100 * discountAmount) / originalPrice,
      finalPrice: originalPrice - discountAmount,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { originalPrice: 80, discountAmount: 20 },
  output: { discountPercentOfOriginal: 25, finalPrice: 60 },
} satisfies ToolExample<Input, Output>;
export const promotionDiscountPerceivedBaseLabelTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "marketing/promotion-discount-perceived-base-label",
      title: "Promotion Discount Perceived Base Label Tool",
      description:
        "Express an explicit promotion discount against its original-price base, without modelling consumer perception.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          originalPrice: { type: "number", exclusiveMinimum: 0 },
          discountAmount: { type: "number", minimum: 0 },
        },
        required: ["originalPrice", "discountAmount"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          discountPercentOfOriginal: { type: "number" },
          finalPrice: { type: "number" },
        },
        required: ["discountPercentOfOriginal", "finalPrice"],
      },
      ports: {
        inputs: [
          {
            id: "originalPrice",
            label: "Original Price",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "discountAmount",
            label: "Discount Amount",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "discountPercentOfOriginal",
            label: "Discount Percent Of Original",
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
export const run = promotionDiscountPerceivedBaseLabelTool.execute;
export default promotionDiscountPerceivedBaseLabelTool;

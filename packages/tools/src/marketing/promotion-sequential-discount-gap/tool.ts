import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly initialPrice: number;
  readonly firstDiscountFraction: number;
  readonly secondDiscountFraction: number;
};
export type Output = {
  readonly sequentialPrice: number;
  readonly summedDiscountPrice: number;
  readonly sequentialMinusSummed: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    initialPrice: { type: "number", minimum: 0 },
    firstDiscountFraction: { type: "number", minimum: 0, maximum: 1 },
    secondDiscountFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["initialPrice", "firstDiscountFraction", "secondDiscountFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sequentialPrice: { type: "number" },
    summedDiscountPrice: { type: "number" },
    sequentialMinusSummed: { type: "number" },
  },
  required: ["sequentialPrice", "summedDiscountPrice", "sequentialMinusSummed"],
} as const;
/** Compare two explicit sequential percentage discounts with their additive-discount arithmetic without selecting promotion policy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { initialPrice, firstDiscountFraction, secondDiscountFraction } =
    request;
  const compute = (): Output => {
    H.domain(initialPrice >= 0, "initialPrice");
    (H.domain(
      firstDiscountFraction >= 0 && firstDiscountFraction <= 1,
      "firstDiscountFraction",
    ),
      firstDiscountFraction);
    (H.domain(
      secondDiscountFraction >= 0 && secondDiscountFraction <= 1,
      "secondDiscountFraction",
    ),
      secondDiscountFraction);
    return {
      sequentialPrice:
        initialPrice *
        (1 - firstDiscountFraction) *
        (1 - secondDiscountFraction),
      summedDiscountPrice:
        initialPrice * (1 - firstDiscountFraction - secondDiscountFraction),
      sequentialMinusSummed:
        initialPrice * firstDiscountFraction * secondDiscountFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    initialPrice: 100,
    firstDiscountFraction: 0.2,
    secondDiscountFraction: 0.25,
  },
  output: {
    sequentialPrice: 60,
    summedDiscountPrice: 55.00000000000001,
    sequentialMinusSummed: 5,
  },
} satisfies ToolExample<Input, Output>;
export const promotionSequentialDiscountGapTool = H.defineSchemaCalculation<
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
    id: "marketing/promotion-sequential-discount-gap",
    title: "Promotion Sequential Discount Gap",
    description:
      "Compare two explicit sequential percentage discounts with their additive-discount arithmetic without selecting promotion policy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        initialPrice: { type: "number", minimum: 0 },
        firstDiscountFraction: { type: "number", minimum: 0, maximum: 1 },
        secondDiscountFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: [
        "initialPrice",
        "firstDiscountFraction",
        "secondDiscountFraction",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sequentialPrice: { type: "number" },
        summedDiscountPrice: { type: "number" },
        sequentialMinusSummed: { type: "number" },
      },
      required: [
        "sequentialPrice",
        "summedDiscountPrice",
        "sequentialMinusSummed",
      ],
    },
    ports: {
      inputs: [
        {
          id: "initialPrice",
          label: "Initial Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstDiscountFraction",
          label: "First Discount Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondDiscountFraction",
          label: "Second Discount Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "sequentialPrice",
          label: "Sequential Price",
          valueType: { type: "number" },
        },
        {
          id: "summedDiscountPrice",
          label: "Summed Discount Price",
          valueType: { type: "number" },
        },
        {
          id: "sequentialMinusSummed",
          label: "Sequential Minus Summed",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = promotionSequentialDiscountGapTool.execute;
export default promotionSequentialDiscountGapTool;

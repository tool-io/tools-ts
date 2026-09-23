import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly priorQuantity: number;
  readonly currentQuantity: number;
  readonly priorPrice: number;
  readonly currentPrice: number;
};
export type Output = {
  readonly quantityEffect: number;
  readonly priceEffect: number;
  readonly totalChange: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    priorQuantity: { type: "number", minimum: 0 },
    currentQuantity: { type: "number", minimum: 0 },
    priorPrice: { type: "number", minimum: 0 },
    currentPrice: { type: "number", minimum: 0 },
  },
  required: ["priorQuantity", "currentQuantity", "priorPrice", "currentPrice"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    quantityEffect: { type: "number" },
    priceEffect: { type: "number" },
    totalChange: { type: "number" },
  },
  required: ["quantityEffect", "priceEffect", "totalChange"],
} as const;
/** Sequential price-volume bridge applies quantity change at prior price, then price change at current quantity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { priorQuantity, currentQuantity, priorPrice, currentPrice } = request;
  const compute = (): Output => {
    H.domain(
      priorQuantity >= 0 &&
        currentQuantity >= 0 &&
        priorPrice >= 0 &&
        currentPrice >= 0,
    );
    return {
      quantityEffect: (currentQuantity - priorQuantity) * priorPrice,
      priceEffect: currentQuantity * (currentPrice - priorPrice),
      totalChange: currentQuantity * currentPrice - priorQuantity * priorPrice,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    priorQuantity: 100,
    currentQuantity: 120,
    priorPrice: 10,
    currentPrice: 12,
  },
  output: { quantityEffect: 200, priceEffect: 240, totalChange: 440 },
} satisfies ToolExample<Input, Output>;
export const revenueWaterfallOneCategoryChangeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "business-analytics/revenue-waterfall-one-category-change",
    title: "Revenue Waterfall One Category Change Tool",
    description:
      "Sequential price-volume bridge applies quantity change at prior price, then price change at current quantity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        priorQuantity: { type: "number", minimum: 0 },
        currentQuantity: { type: "number", minimum: 0 },
        priorPrice: { type: "number", minimum: 0 },
        currentPrice: { type: "number", minimum: 0 },
      },
      required: [
        "priorQuantity",
        "currentQuantity",
        "priorPrice",
        "currentPrice",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        quantityEffect: { type: "number" },
        priceEffect: { type: "number" },
        totalChange: { type: "number" },
      },
      required: ["quantityEffect", "priceEffect", "totalChange"],
    },
    ports: {
      inputs: [
        {
          id: "priorQuantity",
          label: "Prior Quantity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "currentQuantity",
          label: "Current Quantity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "priorPrice",
          label: "Prior Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "currentPrice",
          label: "Current Price",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "quantityEffect",
          label: "Quantity Effect",
          valueType: { type: "number" },
        },
        {
          id: "priceEffect",
          label: "Price Effect",
          valueType: { type: "number" },
        },
        {
          id: "totalChange",
          label: "Total Change",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = revenueWaterfallOneCategoryChangeTool.execute;
export default revenueWaterfallOneCategoryChangeTool;

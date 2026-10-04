import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly basePrice: number;
  readonly currentPrice: number;
  readonly fixedQuantity: number;
};
export type Output = {
  readonly baseCost: number;
  readonly currentCost: number;
  readonly costChange: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    basePrice: { type: "number", minimum: 0 },
    currentPrice: { type: "number", minimum: 0 },
    fixedQuantity: { type: "number", minimum: 0 },
  },
  required: ["basePrice", "currentPrice", "fixedQuantity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    baseCost: { type: "number" },
    currentCost: { type: "number" },
    costChange: { type: "number" },
  },
  required: ["baseCost", "currentCost", "costChange"],
} as const;
/** Return one fixed-basket item's base cost, current cost and signed cost change for price-index aggregation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { basePrice, currentPrice, fixedQuantity } = request;
  const compute = (): Output => {
    H.domain(
      basePrice >= 0 && currentPrice >= 0 && fixedQuantity >= 0,
      "basePrice",
    );
    return {
      baseCost: basePrice * fixedQuantity,
      currentCost: currentPrice * fixedQuantity,
      costChange: (currentPrice - basePrice) * fixedQuantity,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { basePrice: 4, currentPrice: 5, fixedQuantity: 10 },
  output: { baseCost: 40, currentCost: 50, costChange: 10 },
} satisfies ToolExample<Input, Output>;
export const priceIndexSingleBasketItemTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "economics/price-index-single-basket-item",
    title: "Price Index Single Basket Item Tool",
    description:
      "Return one fixed-basket item's base cost, current cost and signed cost change for price-index aggregation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        basePrice: { type: "number", minimum: 0 },
        currentPrice: { type: "number", minimum: 0 },
        fixedQuantity: { type: "number", minimum: 0 },
      },
      required: ["basePrice", "currentPrice", "fixedQuantity"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        baseCost: { type: "number" },
        currentCost: { type: "number" },
        costChange: { type: "number" },
      },
      required: ["baseCost", "currentCost", "costChange"],
    },
    ports: {
      inputs: [
        {
          id: "basePrice",
          label: "Base Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "currentPrice",
          label: "Current Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "fixedQuantity",
          label: "Fixed Quantity",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "baseCost", label: "Base Cost", valueType: { type: "number" } },
        {
          id: "currentCost",
          label: "Current Cost",
          valueType: { type: "number" },
        },
        {
          id: "costChange",
          label: "Cost Change",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = priceIndexSingleBasketItemTool.execute;
export default priceIndexSingleBasketItemTool;

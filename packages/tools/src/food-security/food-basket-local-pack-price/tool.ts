import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly packPrice: number;
  readonly packQuantity: number;
  readonly requiredQuantity: number;
};
export type Output = {
  readonly fractionalPackCost: number;
  readonly wholePacksNeeded: number;
  readonly wholePackCost: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    packPrice: { type: "number", minimum: 0 },
    packQuantity: { type: "number", exclusiveMinimum: 0 },
    requiredQuantity: { type: "number", minimum: 0 },
  },
  required: ["packPrice", "packQuantity", "requiredQuantity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fractionalPackCost: { type: "number" },
    wholePacksNeeded: { type: "integer" },
    wholePackCost: { type: "number" },
  },
  required: ["fractionalPackCost", "wholePacksNeeded", "wholePackCost"],
} as const;
/** Calculate fractional and whole-pack cost from explicit local price and compatible quantities without looking up food prices. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { packPrice, packQuantity, requiredQuantity } = request;
  const compute = (): Output => {
    H.domain(packPrice >= 0 && requiredQuantity >= 0, "packPrice");
    (H.domain(packQuantity > 0, "packQuantity"), packQuantity);
    return {
      fractionalPackCost: packPrice * (requiredQuantity / packQuantity),
      wholePacksNeeded: Math.ceil(requiredQuantity / packQuantity),
      wholePackCost: Math.ceil(requiredQuantity / packQuantity) * packPrice,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { packPrice: 3, packQuantity: 2, requiredQuantity: 5 },
  output: { fractionalPackCost: 7.5, wholePacksNeeded: 3, wholePackCost: 9 },
} satisfies ToolExample<Input, Output>;
export const foodBasketLocalPackPriceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["cost", "learn"],
      fields: ["food-security", "food security", "agriculture"],
      keywords: ["food security", "agriculture"],
    },
    id: "food-security/food-basket-local-pack-price",
    title: "Food Basket Local Pack Price",
    description:
      "Calculate fractional and whole-pack cost from explicit local price and compatible quantities without looking up food prices.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        packPrice: { type: "number", minimum: 0 },
        packQuantity: { type: "number", exclusiveMinimum: 0 },
        requiredQuantity: { type: "number", minimum: 0 },
      },
      required: ["packPrice", "packQuantity", "requiredQuantity"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fractionalPackCost: { type: "number" },
        wholePacksNeeded: { type: "integer" },
        wholePackCost: { type: "number" },
      },
      required: ["fractionalPackCost", "wholePacksNeeded", "wholePackCost"],
    },
    ports: {
      inputs: [
        {
          id: "packPrice",
          label: "Pack Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "packQuantity",
          label: "Pack Quantity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "requiredQuantity",
          label: "Required Quantity",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "fractionalPackCost",
          label: "Fractional Pack Cost",
          valueType: { type: "number" },
        },
        {
          id: "wholePacksNeeded",
          label: "Whole Packs Needed",
          valueType: { type: "integer" },
        },
        {
          id: "wholePackCost",
          label: "Whole Pack Cost",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = foodBasketLocalPackPriceTool.execute;
export default foodBasketLocalPackPriceTool;

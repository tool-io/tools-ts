import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly basePrice: number;
  readonly currentPrice: number;
  readonly baseQuantity: number;
  readonly totalBaseValue: number;
};
export type Output = {
  readonly baseWeight: number;
  readonly weightedPriceRelative: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    basePrice: { type: "number", exclusiveMinimum: 0 },
    currentPrice: { type: "number", minimum: 0 },
    baseQuantity: { type: "number", minimum: 0 },
    totalBaseValue: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["basePrice", "currentPrice", "baseQuantity", "totalBaseValue"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    baseWeight: { type: "number" },
    weightedPriceRelative: { type: "number" },
  },
  required: ["baseWeight", "weightedPriceRelative"],
} as const;
/** One Laspeyres index contribution, without multiplying the returned normalized contribution by 100. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { basePrice, currentPrice, baseQuantity, totalBaseValue } = request;
  const compute = (): Output => {
    H.positive(basePrice);
    H.domain(currentPrice >= 0 && baseQuantity >= 0);
    H.positive(totalBaseValue);
    H.domain(basePrice * baseQuantity <= totalBaseValue);
    return {
      baseWeight: (basePrice * baseQuantity) / totalBaseValue,
      weightedPriceRelative: (currentPrice * baseQuantity) / totalBaseValue,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    basePrice: 10,
    currentPrice: 12,
    baseQuantity: 5,
    totalBaseValue: 100,
  },
  output: { baseWeight: 0.5, weightedPriceRelative: 0.6 },
} satisfies ToolExample<Input, Output>;
export const producerPriceIndexSingleWeightTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agricultural-economics/producer-price-index-single-weight",
    title: "Producer Price Index Single Weight Tool",
    description:
      "One Laspeyres index contribution, without multiplying the returned normalized contribution by 100.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        basePrice: { type: "number", exclusiveMinimum: 0 },
        currentPrice: { type: "number", minimum: 0 },
        baseQuantity: { type: "number", minimum: 0 },
        totalBaseValue: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["basePrice", "currentPrice", "baseQuantity", "totalBaseValue"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        baseWeight: { type: "number" },
        weightedPriceRelative: { type: "number" },
      },
      required: ["baseWeight", "weightedPriceRelative"],
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
          id: "baseQuantity",
          label: "Base Quantity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalBaseValue",
          label: "Total Base Value",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "baseWeight",
          label: "Base Weight",
          valueType: { type: "number" },
        },
        {
          id: "weightedPriceRelative",
          label: "Weighted Price Relative",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = producerPriceIndexSingleWeightTool.execute;
export default producerPriceIndexSingleWeightTool;

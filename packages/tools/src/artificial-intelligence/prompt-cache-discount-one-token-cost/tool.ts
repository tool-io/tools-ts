import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly tokens: number;
  readonly basePerMillion: number;
  readonly cachedFraction: number;
  readonly cachedPriceFraction: number;
};
export type Output = {
  readonly uncachedTokens: number;
  readonly cachedTokens: number;
  readonly totalCost: number;
  readonly savings: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    tokens: { type: "integer", minimum: 0 },
    basePerMillion: { type: "number", minimum: 0 },
    cachedFraction: { type: "number", minimum: 0, maximum: 1 },
    cachedPriceFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: [
    "tokens",
    "basePerMillion",
    "cachedFraction",
    "cachedPriceFraction",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    uncachedTokens: { type: "number" },
    cachedTokens: { type: "number" },
    totalCost: { type: "number" },
    savings: { type: "number" },
  },
  required: ["uncachedTokens", "cachedTokens", "totalCost", "savings"],
} as const;
/** Caller-supplied token pricing and cached share, without a provider price lookup. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { tokens, basePerMillion, cachedFraction, cachedPriceFraction } =
    request;
  const compute = (): Output => {
    H.integer(tokens, 0);
    H.domain(basePerMillion >= 0);
    H.probability(cachedFraction);
    H.probability(cachedPriceFraction);
    return {
      uncachedTokens: tokens * (1 - cachedFraction),
      cachedTokens: tokens * cachedFraction,
      totalCost:
        (tokens *
          basePerMillion *
          (1 - cachedFraction + cachedFraction * cachedPriceFraction)) /
        1000000,
      savings:
        (tokens * basePerMillion * cachedFraction * (1 - cachedPriceFraction)) /
        1000000,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    tokens: 1000000,
    basePerMillion: 2,
    cachedFraction: 0.5,
    cachedPriceFraction: 0.25,
  },
  output: {
    uncachedTokens: 500000,
    cachedTokens: 500000,
    totalCost: 1.25,
    savings: 0.75,
  },
} satisfies ToolExample<Input, Output>;
export const promptCacheDiscountOneTokenCostTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "artificial-intelligence/prompt-cache-discount-one-token-cost",
    title: "Prompt Cache Discount One Token Cost Tool",
    description:
      "Caller-supplied token pricing and cached share, without a provider price lookup.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        tokens: { type: "integer", minimum: 0 },
        basePerMillion: { type: "number", minimum: 0 },
        cachedFraction: { type: "number", minimum: 0, maximum: 1 },
        cachedPriceFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: [
        "tokens",
        "basePerMillion",
        "cachedFraction",
        "cachedPriceFraction",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        uncachedTokens: { type: "number" },
        cachedTokens: { type: "number" },
        totalCost: { type: "number" },
        savings: { type: "number" },
      },
      required: ["uncachedTokens", "cachedTokens", "totalCost", "savings"],
    },
    ports: {
      inputs: [
        {
          id: "tokens",
          label: "Tokens",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "basePerMillion",
          label: "Base Per Million",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "cachedFraction",
          label: "Cached Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "cachedPriceFraction",
          label: "Cached Price Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "uncachedTokens",
          label: "Uncached Tokens",
          valueType: { type: "number" },
        },
        {
          id: "cachedTokens",
          label: "Cached Tokens",
          valueType: { type: "number" },
        },
        { id: "totalCost", label: "Total Cost", valueType: { type: "number" } },
        { id: "savings", label: "Savings", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = promptCacheDiscountOneTokenCostTool.execute;
export default promptCacheDiscountOneTokenCostTool;

import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly basePrice: number;
  readonly reductionAmount: number;
};
export type Output = {
  readonly reducedPrice: number;
  readonly reductionPercent: number;
  readonly remainingPercent: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    basePrice: { type: "number", exclusiveMinimum: 0 },
    reductionAmount: { type: "number", minimum: 0 },
  },
  required: ["basePrice", "reductionAmount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reducedPrice: { type: "number" },
    reductionPercent: { type: "number" },
    remainingPercent: { type: "number" },
  },
  required: ["reducedPrice", "reductionPercent", "remainingPercent"],
} as const;
/** Express one explicitly supplied price reduction as equivalent cash, discount-percent and remaining-price-percent values. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { basePrice, reductionAmount } = request;
  const compute = (): Output => {
    (H.domain(basePrice > 0, "basePrice"), basePrice);
    H.domain(
      reductionAmount >= 0 && reductionAmount <= basePrice,
      "reductionAmount",
    );
    return {
      reducedPrice: basePrice - reductionAmount,
      reductionPercent: (100 * reductionAmount) / basePrice,
      remainingPercent: (100 * (basePrice - reductionAmount)) / basePrice,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { basePrice: 80, reductionAmount: 20 },
  output: { reducedPrice: 60, reductionPercent: 25, remainingPercent: 75 },
} satisfies ToolExample<Input, Output>;
export const framingEquivalentPricePairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["behavioral-economics", "behavioral economics", "economics"],
      keywords: ["behavioral economics", "economics"],
    },
    id: "behavioral-economics/framing-equivalent-price-pair",
    title: "Framing Equivalent Price Pair",
    description:
      "Express one explicitly supplied price reduction as equivalent cash, discount-percent and remaining-price-percent values.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        basePrice: { type: "number", exclusiveMinimum: 0 },
        reductionAmount: { type: "number", minimum: 0 },
      },
      required: ["basePrice", "reductionAmount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reducedPrice: { type: "number" },
        reductionPercent: { type: "number" },
        remainingPercent: { type: "number" },
      },
      required: ["reducedPrice", "reductionPercent", "remainingPercent"],
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
          id: "reductionAmount",
          label: "Reduction Amount",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "reducedPrice",
          label: "Reduced Price",
          valueType: { type: "number" },
        },
        {
          id: "reductionPercent",
          label: "Reduction Percent",
          valueType: { type: "number" },
        },
        {
          id: "remainingPercent",
          label: "Remaining Percent",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = framingEquivalentPricePairTool.execute;
export default framingEquivalentPricePairTool;

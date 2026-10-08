import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly price: number;
  readonly marginalCost: number;
  readonly divideByPrice: boolean;
};
export type Output = {
  readonly signedMarkup: number;
  readonly denominator: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    price: { type: "number" },
    marginalCost: { type: "number" },
    divideByPrice: { type: "boolean" },
  },
  required: ["price", "marginalCost", "divideByPrice"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signedMarkup: { type: "number" },
    denominator: { type: "number" },
  },
  required: ["signedMarkup", "denominator"],
} as const;
/** Normalize an explicit price-minus-marginal-cost gap by a supplied price or cost denominator convention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { price, marginalCost, divideByPrice } = request;
  const compute = (): Output => {
    H.domain((divideByPrice ? price : marginalCost) !== 0, "divideByPrice");
    return {
      signedMarkup:
        (price - marginalCost) / (divideByPrice ? price : marginalCost),
      denominator: divideByPrice ? price : marginalCost,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { price: 12, marginalCost: 8, divideByPrice: true },
  output: { signedMarkup: 0.3333333333333333, denominator: 12 },
} satisfies ToolExample<Input, Output>;
export const marginalCostPriceMarkupDenominatorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["cost", "data"],
      fields: ["economics"],
      keywords: ["economics"],
    },
    id: "economics/marginal-cost-price-markup-denominator",
    title: "Marginal Cost Price Markup Denominator",
    description:
      "Normalize an explicit price-minus-marginal-cost gap by a supplied price or cost denominator convention.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        price: { type: "number" },
        marginalCost: { type: "number" },
        divideByPrice: { type: "boolean" },
      },
      required: ["price", "marginalCost", "divideByPrice"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signedMarkup: { type: "number" },
        denominator: { type: "number" },
      },
      required: ["signedMarkup", "denominator"],
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
          id: "marginalCost",
          label: "Marginal Cost",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "divideByPrice",
          label: "Divide By Price",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "signedMarkup",
          label: "Signed Markup",
          valueType: { type: "number" },
        },
        {
          id: "denominator",
          label: "Denominator",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = marginalCostPriceMarkupDenominatorTool.execute;
export default marginalCostPriceMarkupDenominatorTool;

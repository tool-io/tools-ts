import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly price: number;
  readonly sourceQuantity: number;
  readonly targetQuantity: number;
  readonly currencyFactor: number;
};
export type Output = { readonly targetPrice: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    price: { type: "number" },
    sourceQuantity: { type: "number", exclusiveMinimum: 0 },
    targetQuantity: { type: "number", exclusiveMinimum: 0 },
    currencyFactor: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["price", "sourceQuantity", "targetQuantity", "currencyFactor"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { targetPrice: { type: "number" } },
  required: ["targetPrice"],
} as const;
/** Convert a supplied price quote using explicit quantity and currency factors without price data. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { price, sourceQuantity, targetQuantity, currencyFactor } = request;
  const compute = (): Output => {
    H.positive(sourceQuantity);
    H.positive(targetQuantity);
    H.positive(currencyFactor);
    return {
      targetPrice: (price / sourceQuantity) * targetQuantity * currencyFactor,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    price: 20,
    sourceQuantity: 4,
    targetQuantity: 10,
    currencyFactor: 2,
  },
  output: { targetPrice: 100 },
} satisfies ToolExample<Input, Output>;
export const internationalPriceBasisFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "global-studies/international-price-basis-factor",
    title: "International Price Basis Factor Tool",
    description:
      "Convert a supplied price quote using explicit quantity and currency factors without price data.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        price: { type: "number" },
        sourceQuantity: { type: "number", exclusiveMinimum: 0 },
        targetQuantity: { type: "number", exclusiveMinimum: 0 },
        currencyFactor: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["price", "sourceQuantity", "targetQuantity", "currencyFactor"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { targetPrice: { type: "number" } },
      required: ["targetPrice"],
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
          id: "sourceQuantity",
          label: "Source Quantity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "targetQuantity",
          label: "Target Quantity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "currencyFactor",
          label: "Currency Factor",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "targetPrice",
          label: "Target Price",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = internationalPriceBasisFactorTool.execute;
export default internationalPriceBasisFactorTool;

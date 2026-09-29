import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly quote: number; readonly reverse: boolean };
export type Output = { readonly factor: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    quote: { type: "number", exclusiveMinimum: 0 },
    reverse: { type: "boolean" },
  },
  required: ["quote", "reverse"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { factor: { type: "number" } },
  required: ["factor"],
} as const;
/** Orient one explicitly supplied positive currency quote without a current exchange-rate lookup. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { quote, reverse } = request;
  const compute = (): Output => {
    H.positive(quote);
    return { factor: reverse ? 1 / quote : quote };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { quote: 2, reverse: true },
  output: { factor: 0.5 },
} satisfies ToolExample<Input, Output>;
export const contractCurrencyQuoteOrientationTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "international-business/contract-currency-quote-orientation",
    title: "Contract Currency Quote Orientation Tool",
    description:
      "Orient one explicitly supplied positive currency quote without a current exchange-rate lookup.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        quote: { type: "number", exclusiveMinimum: 0 },
        reverse: { type: "boolean" },
      },
      required: ["quote", "reverse"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { factor: { type: "number" } },
      required: ["factor"],
    },
    ports: {
      inputs: [
        {
          id: "quote",
          label: "Quote",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reverse",
          label: "Reverse",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "factor", label: "Factor", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = contractCurrencyQuoteOrientationTool.execute;
export default contractCurrencyQuoteOrientationTool;

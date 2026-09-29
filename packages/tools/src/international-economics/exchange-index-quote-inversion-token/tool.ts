import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly currentQuote: number;
  readonly baseQuote: number;
  readonly invertQuote: boolean;
};
export type Output = { readonly index: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    currentQuote: { type: "number", exclusiveMinimum: 0 },
    baseQuote: { type: "number", exclusiveMinimum: 0 },
    invertQuote: { type: "boolean" },
  },
  required: ["currentQuote", "baseQuote", "invertQuote"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { index: { type: "number" } },
  required: ["index"],
} as const;
/** Rebase a positive exchange quote to 100 with an explicit quote inversion convention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { currentQuote, baseQuote, invertQuote } = request;
  const compute = (): Output => {
    H.positive(currentQuote);
    H.positive(baseQuote);
    return {
      index:
        (invertQuote ? baseQuote / currentQuote : currentQuote / baseQuote) *
        100,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { currentQuote: 2, baseQuote: 1, invertQuote: true },
  output: { index: 50 },
} satisfies ToolExample<Input, Output>;
export const exchangeIndexQuoteInversionTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "international-economics/exchange-index-quote-inversion-token",
    title: "Exchange Index Quote Inversion Token Tool",
    description:
      "Rebase a positive exchange quote to 100 with an explicit quote inversion convention.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        currentQuote: { type: "number", exclusiveMinimum: 0 },
        baseQuote: { type: "number", exclusiveMinimum: 0 },
        invertQuote: { type: "boolean" },
      },
      required: ["currentQuote", "baseQuote", "invertQuote"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { index: { type: "number" } },
      required: ["index"],
    },
    ports: {
      inputs: [
        {
          id: "currentQuote",
          label: "Current Quote",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "baseQuote",
          label: "Base Quote",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "invertQuote",
          label: "Invert Quote",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [{ id: "index", label: "Index", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = exchangeIndexQuoteInversionTokenTool.execute;
export default exchangeIndexQuoteInversionTokenTool;

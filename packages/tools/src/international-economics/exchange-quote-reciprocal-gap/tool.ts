import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly forwardQuote: number;
  readonly reverseQuote: number;
};
export type Output = { readonly expectedReverse: number; readonly gap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    forwardQuote: { type: "number", exclusiveMinimum: 0 },
    reverseQuote: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["forwardQuote", "reverseQuote"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { expectedReverse: { type: "number" }, gap: { type: "number" } },
  required: ["expectedReverse", "gap"],
} as const;
/** Calculate exchange quote reciprocal gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { forwardQuote, reverseQuote } = request;
  const compute = (): Output => {
    H.positive(forwardQuote);
    H.positive(reverseQuote);
    return {
      expectedReverse: 1 / forwardQuote,
      gap: reverseQuote - 1 / forwardQuote,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { forwardQuote: 2, reverseQuote: 0.6 },
  output: { expectedReverse: 0.5, gap: 0.09999999999999998 },
} satisfies ToolExample<Input, Output>;
export const exchangeQuoteReciprocalGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "international-economics/exchange-quote-reciprocal-gap",
    title: "Exchange Quote Reciprocal Gap Tool",
    description:
      "Calculate exchange quote reciprocal gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        forwardQuote: { type: "number", exclusiveMinimum: 0 },
        reverseQuote: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["forwardQuote", "reverseQuote"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        expectedReverse: { type: "number" },
        gap: { type: "number" },
      },
      required: ["expectedReverse", "gap"],
    },
    ports: {
      inputs: [
        {
          id: "forwardQuote",
          label: "Forward Quote",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reverseQuote",
          label: "Reverse Quote",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "expectedReverse",
          label: "Expected Reverse",
          valueType: { type: "number" },
        },
        { id: "gap", label: "Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = exchangeQuoteReciprocalGapTool.execute;
export default exchangeQuoteReciprocalGapTool;

import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly suppliedQuote: string;
  readonly useSquareBrackets: boolean;
};
export type Output = { readonly formatted: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    suppliedQuote: { type: "string", maxLength: 8192 },
    useSquareBrackets: { type: "boolean" },
  },
  required: ["suppliedQuote", "useSquareBrackets"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { formatted: { type: "string", maxLength: 8192 } },
  required: ["formatted"],
} as const;
/** Wrap explicit quotation text in caller-selected square brackets or curly double quotation marks without altering its contents. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { suppliedQuote, useSquareBrackets } = request;
  const compute = (): Output => {
    return {
      formatted: useSquareBrackets
        ? "[" + suppliedQuote + "]"
        : "“" + suppliedQuote + "”",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { suppliedQuote: "text A", useSquareBrackets: true },
  output: { formatted: "[text A]" },
} satisfies ToolExample<Input, Output>;
export const philosophicalTextQuoteBracketStyleTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["philosophy"],
      keywords: ["philosophy"],
    },
    id: "philosophy/philosophical-text-quote-bracket-style",
    title: "Philosophical Text Quote Bracket Style",
    description:
      "Wrap explicit quotation text in caller-selected square brackets or curly double quotation marks without altering its contents.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        suppliedQuote: { type: "string", maxLength: 8192 },
        useSquareBrackets: { type: "boolean" },
      },
      required: ["suppliedQuote", "useSquareBrackets"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { formatted: { type: "string", maxLength: 8192 } },
      required: ["formatted"],
    },
    ports: {
      inputs: [
        {
          id: "suppliedQuote",
          label: "Supplied Quote",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "useSquareBrackets",
          label: "Use Square Brackets",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "formatted", label: "Formatted", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = philosophicalTextQuoteBracketStyleTool.execute;
export default philosophicalTextQuoteBracketStyleTool;

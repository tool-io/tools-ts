import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly token: string };
export type Output = {
  readonly multiline: boolean;
  readonly quoteCount: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    multiline: { type: "boolean" },
    quoteCount: { type: "integer" },
  },
  required: ["multiline", "quoteCount"],
} as const;
/** Compute toml literal string quote count from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { token } = input;
  const compute = (): Output => {
    const quoteCount = token.startsWith("\x27\x27\x27")
      ? 3
      : token.startsWith("\x27")
        ? 1
        : 0;
    domain(quoteCount > 0);
    return { multiline: quoteCount === 3, quoteCount };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { token: "'text'" },
  output: { multiline: false, quoteCount: 1 },
} satisfies ToolExample<Input, Output>;
export const tomlLiteralStringQuoteCountTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "parse/toml-literal-string-quote-count",
  title: "Toml Literal String Quote Count Tool",
  description:
    "Identify the one-quote or three-quote opening delimiter of a TOML literal string, including empty literals; this does not parse a complete TOML document.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "token",
        label: "Token",
        required: true,
        valueType: { type: "string" },
      },
    ],
    outputs: [
      { id: "multiline", label: "Multiline", valueType: { type: "boolean" } },
      {
        id: "quoteCount",
        label: "Quote Count",
        valueType: { type: "integer" },
      },
    ],
  },
});
export const run = tomlLiteralStringQuoteCountTool.execute;
export default tomlLiteralStringQuoteCountTool;

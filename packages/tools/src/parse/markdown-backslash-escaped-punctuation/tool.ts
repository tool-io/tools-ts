import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly token: string };
export type Output = { readonly character: string; readonly escaped: boolean };
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
    character: { type: "string", maxLength: 8192 },
    escaped: { type: "boolean" },
  },
  required: ["character", "escaped"],
} as const;
/** Compute markdown backslash escaped punctuation from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { token } = input;
  const compute = (): Output => {
    domain(token.length === 2 && token[0] === "\\");
    const character = token[1],
      c = character.charCodeAt(0);
    const escaped =
      (c >= 33 && c <= 47) ||
      (c >= 58 && c <= 64) ||
      (c >= 91 && c <= 96) ||
      (c >= 123 && c <= 126);
    return { character: escaped ? character : token, escaped };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { token: "\\*" },
  output: { character: "*", escaped: true },
} satisfies ToolExample<Input, Output>;
export const markdownBackslashEscapedPunctuationTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "parse/markdown-backslash-escaped-punctuation",
  title: "Markdown Backslash Escaped Punctuation Tool",
  description:
    "Compute markdown backslash escaped punctuation from explicit bounded inputs.",
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
      { id: "character", label: "Character", valueType: { type: "string" } },
      { id: "escaped", label: "Escaped", valueType: { type: "boolean" } },
    ],
  },
});
export const run = markdownBackslashEscapedPunctuationTool.execute;
export default markdownBackslashEscapedPunctuationTool;

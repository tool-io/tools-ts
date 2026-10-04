import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly identifier: string };
export type Output = { readonly bookland: boolean; readonly prefix: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { identifier: { type: "string", maxLength: 8192 } },
  required: ["identifier"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bookland: { type: "boolean" },
    prefix: { type: "string", maxLength: 8192 },
  },
  required: ["bookland", "prefix"],
} as const;
/** Compute isbn-13 ean prefix member check from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { identifier } = input;
  const compute = (): Output => {
    domain(/^\d{13}(?![\s\S])/.test(identifier));
    return {
      bookland: identifier.startsWith("978") || identifier.startsWith("979"),
      prefix: identifier.slice(0, 3),
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { identifier: "9780306406157" },
  output: { bookland: true, prefix: "978" },
} satisfies ToolExample<Input, Output>;
export const isbn13EanPrefixMemberCheckTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "validate/isbn13-ean-prefix-member-check",
  title: "ISBN-13 EAN Prefix Member Check Tool",
  description:
    "Compute isbn-13 ean prefix member check from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "identifier",
        label: "Identifier",
        required: true,
        valueType: { type: "string" },
      },
    ],
    outputs: [
      { id: "bookland", label: "Bookland", valueType: { type: "boolean" } },
      { id: "prefix", label: "Prefix", valueType: { type: "string" } },
    ],
  },
});
export const run = isbn13EanPrefixMemberCheckTool.execute;
export default isbn13EanPrefixMemberCheckTool;

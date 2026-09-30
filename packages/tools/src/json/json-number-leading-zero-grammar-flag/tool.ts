import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly lexeme: string };
export type Output = { readonly valid: boolean; readonly leadingZero: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { lexeme: { type: "string", maxLength: 8192 } },
  required: ["lexeme"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { valid: { type: "boolean" }, leadingZero: { type: "boolean" } },
  required: ["valid", "leadingZero"],
} as const;
/** Compute json number leading zero grammar flag from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { lexeme } = input;
  const compute = (): Output => {
    const valid = /^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?(?![\s\S])/.test(
      lexeme,
    );
    return { valid, leadingZero: /^-?0\d/.test(lexeme) };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { lexeme: "01" },
  output: { valid: false, leadingZero: true },
} satisfies ToolExample<Input, Output>;
export const jsonNumberLeadingZeroGrammarFlagTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "json/json-number-leading-zero-grammar-flag",
  title: "JSON Number Leading Zero Grammar Flag Tool",
  description:
    "Compute json number leading zero grammar flag from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "lexeme",
        label: "Lexeme",
        required: true,
        valueType: { type: "string" },
      },
    ],
    outputs: [
      { id: "valid", label: "Valid", valueType: { type: "boolean" } },
      {
        id: "leadingZero",
        label: "Leading Zero",
        valueType: { type: "boolean" },
      },
    ],
  },
});
export const run = jsonNumberLeadingZeroGrammarFlagTool.execute;
export default jsonNumberLeadingZeroGrammarFlagTool;

import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly lexeme: string };
export type Output = { readonly valid: boolean; readonly value: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { lexeme: { type: "string", maxLength: 8192 } },
  required: ["lexeme"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { valid: { type: "boolean" }, value: { type: "boolean" } },
  required: ["valid", "value"],
} as const;
/** Compute json boolean case lexeme check from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { lexeme } = input;
  const compute = (): Output => {
    return {
      valid: lexeme === "true" || lexeme === "false",
      value: lexeme === "true",
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { lexeme: "true" },
  output: { valid: true, value: true },
} satisfies ToolExample<Input, Output>;
export const jsonBooleanCaseLexemeCheckTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "json/json-boolean-case-lexeme-check",
  title: "JSON Boolean Case Lexeme Check Tool",
  description:
    "Compute json boolean case lexeme check from explicit bounded inputs.",
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
      { id: "value", label: "Value", valueType: { type: "boolean" } },
    ],
  },
});
export const run = jsonBooleanCaseLexemeCheckTool.execute;
export default jsonBooleanCaseLexemeCheckTool;

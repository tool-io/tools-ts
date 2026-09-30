import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly lexeme: string };
export type Output = {
  readonly continuation: boolean;
  readonly valid: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { lexeme: { type: "string", maxLength: 8192 } },
  required: ["lexeme"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { continuation: { type: "boolean" }, valid: { type: "boolean" } },
  required: ["continuation", "valid"],
} as const;
/** Compute json string line continuation rejection from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { lexeme } = input;
  const compute = (): Output => {
    const continuation = /\\(?:\r\n|\r|\n)/.test(lexeme);
    let valid = false;
    try {
      valid = typeof JSON.parse(lexeme) === "string";
    } catch {}
    return { continuation, valid };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { lexeme: '"a\\\nb"' },
  output: { continuation: true, valid: false },
} satisfies ToolExample<Input, Output>;
export const jsonStringLineContinuationRejectionTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "json/json-string-line-continuation-rejection",
  title: "JSON String Line Continuation Rejection Tool",
  description:
    "Compute json string line continuation rejection from explicit bounded inputs.",
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
      {
        id: "continuation",
        label: "Continuation",
        valueType: { type: "boolean" },
      },
      { id: "valid", label: "Valid", valueType: { type: "boolean" } },
    ],
  },
});
export const run = jsonStringLineContinuationRejectionTool.execute;
export default jsonStringLineContinuationRejectionTool;

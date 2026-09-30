import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly codeUnit: number };
export type Output = { readonly escape: string; readonly surrogate: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { codeUnit: { type: "integer", minimum: 0, maximum: 65535 } },
  required: ["codeUnit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    escape: { type: "string", maxLength: 8192 },
    surrogate: { type: "boolean" },
  },
  required: ["escape", "surrogate"],
} as const;
/** Compute json string utf16 codeunit escape from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { codeUnit } = input;
  const compute = (): Output => {
    integer(codeUnit, 0, 65535);
    return {
      escape: "\\u" + codeUnit.toString(16).padStart(4, "0"),
      surrogate: codeUnit >= 0xd800 && codeUnit <= 0xdfff,
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { codeUnit: 65 },
  output: { escape: "\\u0041", surrogate: false },
} satisfies ToolExample<Input, Output>;
export const jsonStringUtf16CodeunitEscapeTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "json/json-string-utf16-codeunit-escape",
  title: "JSON String Utf16 Codeunit Escape Tool",
  description:
    "Compute json string utf16 codeunit escape from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "codeUnit",
        label: "Code Unit",
        required: true,
        valueType: { type: "integer" },
      },
    ],
    outputs: [
      { id: "escape", label: "Escape", valueType: { type: "string" } },
      { id: "surrogate", label: "Surrogate", valueType: { type: "boolean" } },
    ],
  },
});
export const run = jsonStringUtf16CodeunitEscapeTool.execute;
export default jsonStringUtf16CodeunitEscapeTool;

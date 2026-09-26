import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly value: number; readonly uppercase: boolean };
export type Output = { readonly symbol: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: { type: "integer", minimum: 0, maximum: 15 },
    uppercase: { type: "boolean" },
  },
  required: ["value", "uppercase"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { symbol: { type: "string", maxLength: 8192 } },
  required: ["symbol"],
} as const;
/** Compute base16 nibble value character from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { value, uppercase } = input;
  const compute = (): Output => {
    integer(value, 0, 15);
    return {
      symbol: (uppercase ? "0123456789ABCDEF" : "0123456789abcdef")[value],
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { value: 15, uppercase: true },
  output: { symbol: "F" },
} satisfies ToolExample<Input, Output>;
export const base16NibbleValueCharacterTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "encode/base16-nibble-value-character",
  title: "Base16 Nibble Value Character Tool",
  description:
    "Compute base16 nibble value character from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "value",
        label: "Value",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "uppercase",
        label: "Uppercase",
        required: true,
        valueType: { type: "boolean" },
      },
    ],
    outputs: [{ id: "symbol", label: "Symbol", valueType: { type: "string" } }],
  },
});
export const run = base16NibbleValueCharacterTool.execute;
export default base16NibbleValueCharacterTool;

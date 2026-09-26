import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly value: number };
export type Output = { readonly symbol: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { value: { type: "integer", minimum: 0, maximum: 57 } },
  required: ["value"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { symbol: { type: "string", maxLength: 8192 } },
  required: ["symbol"],
} as const;
/** Compute base58 alphabet value symbol from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { value } = input;
  const compute = (): Output => {
    integer(value, 0, 57);
    return {
      symbol: "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"[
        value
      ],
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { value: 0 },
  output: { symbol: "1" },
} satisfies ToolExample<Input, Output>;
export const base58AlphabetValueSymbolTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "encode/base58-alphabet-value-symbol",
  title: "Base58 Alphabet Value Symbol Tool",
  description:
    "Compute base58 alphabet value symbol from explicit bounded inputs.",
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
    ],
    outputs: [{ id: "symbol", label: "Symbol", valueType: { type: "string" } }],
  },
});
export const run = base58AlphabetValueSymbolTool.execute;
export default base58AlphabetValueSymbolTool;

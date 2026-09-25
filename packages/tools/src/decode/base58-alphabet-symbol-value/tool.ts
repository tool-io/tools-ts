import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly symbol: string };
export type Output = { readonly value: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { symbol: { type: "string", maxLength: 8192 } },
  required: ["symbol"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { value: { type: "integer" } },
  required: ["value"],
} as const;
/** Compute base58 alphabet symbol value from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { symbol } = input;
  const compute = (): Output => {
    const alphabet =
      "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
    domain(symbol.length === 1 && alphabet.includes(symbol));
    return { value: alphabet.indexOf(symbol) };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { symbol: "1" },
  output: { value: 0 },
} satisfies ToolExample<Input, Output>;
export const base58AlphabetSymbolValueTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "decode/base58-alphabet-symbol-value",
  title: "Base58 Alphabet Symbol Value Tool",
  description:
    "Compute base58 alphabet symbol value from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "symbol",
        label: "Symbol",
        required: true,
        valueType: { type: "string" },
      },
    ],
    outputs: [{ id: "value", label: "Value", valueType: { type: "integer" } }],
  },
});
export const run = base58AlphabetSymbolValueTool.execute;
export default base58AlphabetSymbolValueTool;

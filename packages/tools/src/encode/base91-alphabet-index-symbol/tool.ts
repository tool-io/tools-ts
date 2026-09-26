import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly index: number };
export type Output = { readonly symbol: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { index: { type: "integer", minimum: 0, maximum: 90 } },
  required: ["index"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { symbol: { type: "string", maxLength: 8192 } },
  required: ["symbol"],
} as const;
/** Compute base91 alphabet index symbol from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { index } = input;
  const compute = (): Output => {
    const alphabet =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!#$%&()*+,./:;<=>?@[]^_`{|}~"';
    integer(index, 0, 90);
    return { symbol: alphabet[index] };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { index: 0 },
  output: { symbol: "A" },
} satisfies ToolExample<Input, Output>;
export const base91AlphabetIndexSymbolTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "encode/base91-alphabet-index-symbol",
  title: "Base91 Alphabet Index Symbol Tool",
  description:
    "Compute base91 alphabet index symbol from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "index",
        label: "Index",
        required: true,
        valueType: { type: "integer" },
      },
    ],
    outputs: [{ id: "symbol", label: "Symbol", valueType: { type: "string" } }],
  },
});
export const run = base91AlphabetIndexSymbolTool.execute;
export default base91AlphabetIndexSymbolTool;

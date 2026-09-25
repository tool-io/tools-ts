import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly symbol: string };
export type Output = { readonly index: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { symbol: { type: "string", maxLength: 8192 } },
  required: ["symbol"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { index: { type: "integer" } },
  required: ["index"],
} as const;
/** Compute base91 alphabet symbol index from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { symbol } = input;
  const compute = (): Output => {
    const alphabet =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!#$%&()*+,./:;<=>?@[]^_`{|}~"';
    domain(symbol.length === 1 && alphabet.includes(symbol));
    return { index: alphabet.indexOf(symbol) };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { symbol: "A" },
  output: { index: 0 },
} satisfies ToolExample<Input, Output>;
export const base91AlphabetSymbolIndexTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "decode/base91-alphabet-symbol-index",
  title: "Base91 Alphabet Symbol Index Tool",
  description:
    "Compute base91 alphabet symbol index from explicit bounded inputs.",
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
    outputs: [{ id: "index", label: "Index", valueType: { type: "integer" } }],
  },
});
export const run = base91AlphabetSymbolIndexTool.execute;
export default base91AlphabetSymbolIndexTool;

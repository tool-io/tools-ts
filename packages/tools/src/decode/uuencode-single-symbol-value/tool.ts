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
/** Compute uuencode single symbol value from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { symbol } = input;
  const compute = (): Output => {
    domain(symbol.length === 1);
    const c = symbol.charCodeAt(0);
    domain((c >= 32 && c <= 95) || c === 96);
    return { value: (c - 32) & 63 };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { symbol: "`" },
  output: { value: 0 },
} satisfies ToolExample<Input, Output>;
export const uuencodeSingleSymbolValueTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "decode/uuencode-single-symbol-value",
  title: "uuencode Single Symbol Value Tool",
  description:
    "Compute uuencode single symbol value from explicit bounded inputs.",
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
export const run = uuencodeSingleSymbolValueTool.execute;
export default uuencodeSingleSymbolValueTool;

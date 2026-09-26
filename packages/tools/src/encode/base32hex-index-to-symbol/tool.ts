import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly index: number };
export type Output = { readonly symbol: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { index: { type: "integer", minimum: 0, maximum: 31 } },
  required: ["index"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { symbol: { type: "string", maxLength: 8192 } },
  required: ["symbol"],
} as const;
/** Calculate base32hex index to symbol from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { index } = input;
  const compute = (): Output => {
    H.integer(index, 0, 31);
    return { symbol: "0123456789ABCDEFGHIJKLMNOPQRSTUV"[index] };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { index: 31 },
  output: { symbol: "V" },
} satisfies ToolExample<Input, Output>;
export const base32hexIndexToSymbolTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "encode/base32hex-index-to-symbol",
    title: "Base32hex Index To Symbol Tool",
    description:
      "Calculate base32hex index to symbol from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { index: { type: "integer", minimum: 0, maximum: 31 } },
      required: ["index"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { symbol: { type: "string", maxLength: 8192 } },
      required: ["symbol"],
    },
    ports: {
      inputs: [
        {
          id: "index",
          label: "Index",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "symbol", label: "Symbol", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = base32hexIndexToSymbolTool.execute;
export default base32hexIndexToSymbolTool;

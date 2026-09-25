import * as H from "../../core/batch60-schema-calculation.js";
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
/** Calculate base32hex single symbol index from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { symbol } = input;
  const compute = (): Output => {
    H.domain(/^[0-9A-V](?![\s\S])/.test(symbol));
    return { index: "0123456789ABCDEFGHIJKLMNOPQRSTUV".indexOf(symbol) };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { symbol: "V" },
  output: { index: 31 },
} satisfies ToolExample<Input, Output>;
export const base32hexSingleSymbolIndexTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "decode/base32hex-single-symbol-index",
    title: "Base32hex Single Symbol Index Tool",
    description:
      "Calculate base32hex single symbol index from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { symbol: { type: "string", maxLength: 8192 } },
      required: ["symbol"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { index: { type: "integer" } },
      required: ["index"],
    },
    ports: {
      inputs: [
        {
          id: "symbol",
          label: "Symbol",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "index", label: "Index", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = base32hexSingleSymbolIndexTool.execute;
export default base32hexSingleSymbolIndexTool;

import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly high: number; readonly low: number };
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    high: { type: "integer", minimum: 0, maximum: 255 },
    low: { type: "integer", minimum: 0, maximum: 255 },
  },
  required: ["high", "low"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Compute base45 two byte triple symbols from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { high, low } = input;
  const compute = (): Output => {
    integer(high, 0, 255);
    integer(low, 0, 255);
    const a = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:",
      value = high * 256 + low;
    return {
      token:
        a[value % 45] +
        a[Math.floor(value / 45) % 45] +
        a[Math.floor(value / 2025)],
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { high: 65, low: 66 },
  output: { token: "BB8" },
} satisfies ToolExample<Input, Output>;
export const base45TwoByteTripleSymbolsTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "encode/base45-two-byte-triple-symbols",
  title: "Base45 Two Byte Triple Symbols Tool",
  description:
    "Compute base45 two byte triple symbols from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "high",
        label: "High",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "low",
        label: "Low",
        required: true,
        valueType: { type: "integer" },
      },
    ],
    outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
  },
});
export const run = base45TwoByteTripleSymbolsTool.execute;
export default base45TwoByteTripleSymbolsTool;

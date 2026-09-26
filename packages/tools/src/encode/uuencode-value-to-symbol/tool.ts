import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly value: number; readonly backtickZero: boolean };
export type Output = { readonly symbol: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: { type: "integer", minimum: 0, maximum: 63 },
    backtickZero: { type: "boolean" },
  },
  required: ["value", "backtickZero"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { symbol: { type: "string", maxLength: 8192 } },
  required: ["symbol"],
} as const;
/** Compute uuencode value to symbol from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { value, backtickZero } = input;
  const compute = (): Output => {
    integer(value, 0, 63);
    return {
      symbol:
        value === 0 && backtickZero ? "`" : String.fromCharCode(value + 32),
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { value: 0, backtickZero: true },
  output: { symbol: "`" },
} satisfies ToolExample<Input, Output>;
export const uuencodeValueToSymbolTool = defineSchemaCalculation<Input, Output>(
  {
    id: "encode/uuencode-value-to-symbol",
    title: "uuencode Value To Symbol Tool",
    description:
      "Compute uuencode value to symbol from explicit bounded inputs.",
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
          id: "backtickZero",
          label: "Backtick Zero",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "symbol", label: "Symbol", valueType: { type: "string" } },
      ],
    },
  },
);
export const run = uuencodeValueToSymbolTool.execute;
export default uuencodeValueToSymbolTool;

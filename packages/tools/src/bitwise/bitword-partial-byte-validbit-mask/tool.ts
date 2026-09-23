import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly bitCount: number };
export type Output = {
  readonly fullBytes: number;
  readonly lastByteMask: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { bitCount: { type: "integer", minimum: 0, maximum: 1024 } },
  required: ["bitCount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fullBytes: { type: "integer" },
    lastByteMask: { type: "integer" },
  },
  required: ["fullBytes", "lastByteMask"],
} as const;
/** Compute bitword partial byte validbit mask from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { bitCount } = input;
  const compute = (): Output => {
    integer(bitCount, 0, 1024);
    const r = bitCount % 8;
    return {
      fullBytes: Math.floor(bitCount / 8),
      lastByteMask: r === 0 ? 0 : 2 ** r - 1,
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { bitCount: 11 },
  output: { fullBytes: 1, lastByteMask: 7 },
} satisfies ToolExample<Input, Output>;
export const bitwordPartialByteValidbitMaskTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "bitwise/bitword-partial-byte-validbit-mask",
  title: "Bitword Partial Byte Validbit Mask Tool",
  description:
    "Compute bitword partial byte validbit mask from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "bitCount",
        label: "Bit Count",
        required: true,
        valueType: { type: "integer" },
      },
    ],
    outputs: [
      { id: "fullBytes", label: "Full Bytes", valueType: { type: "integer" } },
      {
        id: "lastByteMask",
        label: "Last Byte Mask",
        valueType: { type: "integer" },
      },
    ],
  },
});
export const run = bitwordPartialByteValidbitMaskTool.execute;
export default bitwordPartialByteValidbitMaskTool;

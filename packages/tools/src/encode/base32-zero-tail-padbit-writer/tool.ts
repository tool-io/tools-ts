import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly significantValue: number;
  readonly significantBits: number;
};
export type Output = {
  readonly symbolValue: number;
  readonly zeroPadBits: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    significantValue: { type: "integer", minimum: 0 },
    significantBits: { type: "integer", minimum: 1, maximum: 5 },
  },
  required: ["significantValue", "significantBits"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    symbolValue: { type: "integer" },
    zeroPadBits: { type: "integer" },
  },
  required: ["symbolValue", "zeroPadBits"],
} as const;
/** Left-align supplied significant bits in one Base32 symbol and fill only its unused low bits with zero. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { significantValue, significantBits } = request;
  const compute = (): Output => {
    H.integer(significantBits, 1, 5);
    H.integer(significantValue, 0, 2 ** significantBits - 1);
    return {
      symbolValue: significantValue * 2 ** (5 - significantBits),
      zeroPadBits: 5 - significantBits,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { significantValue: 3, significantBits: 2 },
  output: { symbolValue: 24, zeroPadBits: 3 },
} satisfies ToolExample<Input, Output>;
export const base32ZeroTailPadbitWriterTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "encode/base32-zero-tail-padbit-writer",
    title: "Base32 Zero Tail Padbit Writer Tool",
    description:
      "Left-align supplied significant bits in one Base32 symbol and fill only its unused low bits with zero.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        significantValue: { type: "integer", minimum: 0 },
        significantBits: { type: "integer", minimum: 1, maximum: 5 },
      },
      required: ["significantValue", "significantBits"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        symbolValue: { type: "integer" },
        zeroPadBits: { type: "integer" },
      },
      required: ["symbolValue", "zeroPadBits"],
    },
    ports: {
      inputs: [
        {
          id: "significantValue",
          label: "Significant Value",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "significantBits",
          label: "Significant Bits",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "symbolValue",
          label: "Symbol Value",
          valueType: { type: "integer" },
        },
        {
          id: "zeroPadBits",
          label: "Zero Pad Bits",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = base32ZeroTailPadbitWriterTool.execute;
export default base32ZeroTailPadbitWriterTool;

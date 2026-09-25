import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly symbolValue: number;
  readonly byteRemainder: number;
};
export type Output = {
  readonly unusedBits: number;
  readonly unusedValue: number;
  readonly canonical: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    symbolValue: { type: "integer", minimum: 0, maximum: 31 },
    byteRemainder: { type: "integer", minimum: 0, maximum: 4 },
  },
  required: ["symbolValue", "byteRemainder"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    unusedBits: { type: "integer" },
    unusedValue: { type: "integer" },
    canonical: { type: "boolean" },
  },
  required: ["unusedBits", "unusedValue", "canonical"],
} as const;
/** Inspect unused low bits in a final RFC 4648 Base32 symbol under an explicit byte-group remainder. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { symbolValue, byteRemainder } = request;
  const compute = (): Output => {
    H.integer(symbolValue, 0, 31);
    H.integer(byteRemainder, 0, 4);
    const unusedBits = [0, 2, 4, 1, 3][byteRemainder],
      unusedValue = symbolValue & ((1 << unusedBits) - 1);
    return { unusedBits, unusedValue, canonical: unusedValue === 0 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { symbolValue: 16, byteRemainder: 1 },
  output: { unusedBits: 2, unusedValue: 0, canonical: true },
} satisfies ToolExample<Input, Output>;
export const base32LastSymbolPadbitsTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "decode/base32-last-symbol-padbits",
    title: "Base32 Last Symbol Padbits Tool",
    description:
      "Inspect unused low bits in a final RFC 4648 Base32 symbol under an explicit byte-group remainder.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        symbolValue: { type: "integer", minimum: 0, maximum: 31 },
        byteRemainder: { type: "integer", minimum: 0, maximum: 4 },
      },
      required: ["symbolValue", "byteRemainder"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        unusedBits: { type: "integer" },
        unusedValue: { type: "integer" },
        canonical: { type: "boolean" },
      },
      required: ["unusedBits", "unusedValue", "canonical"],
    },
    ports: {
      inputs: [
        {
          id: "symbolValue",
          label: "Symbol Value",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "byteRemainder",
          label: "Byte Remainder",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "unusedBits",
          label: "Unused Bits",
          valueType: { type: "integer" },
        },
        {
          id: "unusedValue",
          label: "Unused Value",
          valueType: { type: "integer" },
        },
        { id: "canonical", label: "Canonical", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = base32LastSymbolPadbitsTool.execute;
export default base32LastSymbolPadbitsTool;

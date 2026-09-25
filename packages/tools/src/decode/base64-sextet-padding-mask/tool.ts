import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sextet: number;
  readonly finalOfOneByte: boolean;
};
export type Output = {
  readonly unusedBitCount: number;
  readonly mask: number;
  readonly unusedValue: number;
  readonly canonicalPadBits: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sextet: { type: "integer", minimum: 0, maximum: 63 },
    finalOfOneByte: { type: "boolean" },
  },
  required: ["sextet", "finalOfOneByte"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    unusedBitCount: { type: "integer" },
    mask: { type: "integer" },
    unusedValue: { type: "integer" },
    canonicalPadBits: { type: "boolean" },
  },
  required: ["unusedBitCount", "mask", "unusedValue", "canonicalPadBits"],
} as const;
/** Inspect unused bits of an explicitly selected final Base64 sextet under the one-byte/two-byte tail convention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sextet, finalOfOneByte } = request;
  const compute = (): Output => {
    H.integer(sextet, 0, 63);
    const unusedBitCount = finalOfOneByte ? 4 : 2,
      mask = (1 << unusedBitCount) - 1,
      unusedValue = sextet & mask;
    return {
      unusedBitCount,
      mask,
      unusedValue,
      canonicalPadBits: unusedValue === 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sextet: 16, finalOfOneByte: true },
  output: {
    unusedBitCount: 4,
    mask: 15,
    unusedValue: 0,
    canonicalPadBits: true,
  },
} satisfies ToolExample<Input, Output>;
export const base64SextetPaddingMaskTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "decode/base64-sextet-padding-mask",
    title: "Base64 Sextet Padding Mask Tool",
    description:
      "Inspect unused bits of an explicitly selected final Base64 sextet under the one-byte/two-byte tail convention.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sextet: { type: "integer", minimum: 0, maximum: 63 },
        finalOfOneByte: { type: "boolean" },
      },
      required: ["sextet", "finalOfOneByte"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        unusedBitCount: { type: "integer" },
        mask: { type: "integer" },
        unusedValue: { type: "integer" },
        canonicalPadBits: { type: "boolean" },
      },
      required: ["unusedBitCount", "mask", "unusedValue", "canonicalPadBits"],
    },
    ports: {
      inputs: [
        {
          id: "sextet",
          label: "Sextet",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "finalOfOneByte",
          label: "Final Of One Byte",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "unusedBitCount",
          label: "Unused Bit Count",
          valueType: { type: "integer" },
        },
        { id: "mask", label: "Mask", valueType: { type: "integer" } },
        {
          id: "unusedValue",
          label: "Unused Value",
          valueType: { type: "integer" },
        },
        {
          id: "canonicalPadBits",
          label: "Canonical Pad Bits",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = base64SextetPaddingMaskTool.execute;
export default base64SextetPaddingMaskTool;

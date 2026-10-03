import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly word: number;
  readonly storedBits: number;
  readonly allocatedBits: number;
  readonly signed: boolean;
};
export type Output = {
  readonly maskedWord: number;
  readonly interpretedValue: number;
  readonly extendedWord: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    word: { type: "integer", minimum: 0 },
    storedBits: { type: "integer", minimum: 1, maximum: 32 },
    allocatedBits: { type: "integer", maximum: 32 },
    signed: { type: "boolean" },
  },
  required: ["word", "storedBits", "allocatedBits", "signed"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    maskedWord: { type: "integer" },
    interpretedValue: { type: "integer" },
    extendedWord: { type: "integer" },
  },
  required: ["maskedWord", "interpretedValue", "extendedWord"],
} as const;
/** Unsigned-word masking and two-complement interpretation/sign extension for at most 32 stored bits; no endian or transfer-syntax decoding. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { word, storedBits, allocatedBits, signed } = request;
  const compute = (): Output => {
    H.integer(storedBits, 1, 32);
    H.integer(allocatedBits, storedBits, 32);
    H.integer(word, 0, 2 ** allocatedBits - 1);
    return {
      maskedWord: word % 2 ** storedBits,
      interpretedValue:
        signed && word % 2 ** storedBits >= 2 ** (storedBits - 1)
          ? (word % 2 ** storedBits) - 2 ** storedBits
          : word % 2 ** storedBits,
      extendedWord:
        signed && word % 2 ** storedBits >= 2 ** (storedBits - 1)
          ? (word % 2 ** storedBits) - 2 ** storedBits + 2 ** allocatedBits
          : word % 2 ** storedBits,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { word: 4095, storedBits: 12, allocatedBits: 16, signed: true },
  output: { maskedWord: 4095, interpretedValue: -1, extendedWord: 65535 },
} satisfies ToolExample<Input, Output>;
export const dicomPixelRepresentationSignextensionMaskTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "radiology/dicom-pixel-representation-signextension-mask",
      title: "DICOM Pixel Representation Signextension Mask Tool",
      description:
        "Unsigned-word masking and two-complement interpretation/sign extension for at most 32 stored bits; no endian or transfer-syntax decoding.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          word: { type: "integer", minimum: 0 },
          storedBits: { type: "integer", minimum: 1, maximum: 32 },
          allocatedBits: { type: "integer", maximum: 32 },
          signed: { type: "boolean" },
        },
        required: ["word", "storedBits", "allocatedBits", "signed"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          maskedWord: { type: "integer" },
          interpretedValue: { type: "integer" },
          extendedWord: { type: "integer" },
        },
        required: ["maskedWord", "interpretedValue", "extendedWord"],
      },
      ports: {
        inputs: [
          {
            id: "word",
            label: "Word",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "storedBits",
            label: "Stored Bits",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "allocatedBits",
            label: "Allocated Bits",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "signed",
            label: "Signed",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "maskedWord",
            label: "Masked Word",
            valueType: { type: "integer" },
          },
          {
            id: "interpretedValue",
            label: "Interpreted Value",
            valueType: { type: "integer" },
          },
          {
            id: "extendedWord",
            label: "Extended Word",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  });
export const run = dicomPixelRepresentationSignextensionMaskTool.execute;
export default dicomPixelRepresentationSignextensionMaskTool;

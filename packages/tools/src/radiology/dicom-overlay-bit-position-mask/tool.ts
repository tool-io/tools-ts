import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly word: number; readonly bitPosition: number };
export type Output = {
  readonly bitValue: boolean;
  readonly weight: number;
  readonly clearedWord: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    word: { type: "integer", minimum: 0, maximum: 4294967295 },
    bitPosition: { type: "integer", minimum: 0, maximum: 31 },
  },
  required: ["word", "bitPosition"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bitValue: { type: "boolean" },
    weight: { type: "number" },
    clearedWord: { type: "integer" },
  },
  required: ["bitValue", "weight", "clearedWord"],
} as const;
/** Unsigned 32-bit stored-word bit extraction and clearing, without signed JavaScript shift coercion or decoding an overlay plane. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { word, bitPosition } = request;
  const compute = (): Output => {
    H.integer(word, 0, 4294967295);
    H.integer(bitPosition, 0, 31);
    return {
      bitValue: Math.floor(word / 2 ** bitPosition) % 2 === 1,
      weight: 2 ** bitPosition,
      clearedWord:
        Math.floor(word / 2 ** bitPosition) % 2 === 1
          ? word - 2 ** bitPosition
          : word,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { word: 10, bitPosition: 1 },
  output: { bitValue: true, weight: 2, clearedWord: 8 },
} satisfies ToolExample<Input, Output>;
export const dicomOverlayBitPositionMaskTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "radiology/dicom-overlay-bit-position-mask",
    title: "DICOM Overlay Bit Position Mask Tool",
    description:
      "Unsigned 32-bit stored-word bit extraction and clearing, without signed JavaScript shift coercion or decoding an overlay plane.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        word: { type: "integer", minimum: 0, maximum: 4294967295 },
        bitPosition: { type: "integer", minimum: 0, maximum: 31 },
      },
      required: ["word", "bitPosition"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        bitValue: { type: "boolean" },
        weight: { type: "number" },
        clearedWord: { type: "integer" },
      },
      required: ["bitValue", "weight", "clearedWord"],
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
          id: "bitPosition",
          label: "Bit Position",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "bitValue", label: "Bit Value", valueType: { type: "boolean" } },
        { id: "weight", label: "Weight", valueType: { type: "number" } },
        {
          id: "clearedWord",
          label: "Cleared Word",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = dicomOverlayBitPositionMaskTool.execute;
export default dicomOverlayBitPositionMaskTool;

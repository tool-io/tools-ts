import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly word: number; readonly nibbles: number };
export type Output = { readonly invalidMask: number; readonly valid: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    word: { type: "integer", minimum: 0 },
    nibbles: { type: "integer", minimum: 1, maximum: 8 },
  },
  required: ["word", "nibbles"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { invalidMask: { type: "integer" }, valid: { type: "boolean" } },
  required: ["invalidMask", "valid"],
} as const;
/** Calculate packed decimal invalid nibble mask from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { word, nibbles } = input;
  const compute = (): Output => {
    H.integer(nibbles, 1, 8);
    H.integer(word, 0, 2 ** (4 * nibbles) - 1);
    let invalidMask = 0;
    for (let i = 0; i < nibbles; i++)
      if (Math.floor(word / 16 ** i) % 16 > 9) invalidMask += 2 ** i;
    return { invalidMask, valid: invalidMask === 0 };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { word: 6703, nibbles: 4 },
  output: { invalidMask: 5, valid: false },
} satisfies ToolExample<Input, Output>;
export const packedDecimalInvalidNibbleMaskTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bitwise/packed-decimal-invalid-nibble-mask",
    title: "Packed Decimal Invalid Nibble Mask Tool",
    description:
      "Calculate packed decimal invalid nibble mask from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        word: { type: "integer", minimum: 0 },
        nibbles: { type: "integer", minimum: 1, maximum: 8 },
      },
      required: ["word", "nibbles"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        invalidMask: { type: "integer" },
        valid: { type: "boolean" },
      },
      required: ["invalidMask", "valid"],
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
          id: "nibbles",
          label: "Nibbles",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "invalidMask",
          label: "Invalid Mask",
          valueType: { type: "integer" },
        },
        { id: "valid", label: "Valid", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = packedDecimalInvalidNibbleMaskTool.execute;
export default packedDecimalInvalidNibbleMaskTool;

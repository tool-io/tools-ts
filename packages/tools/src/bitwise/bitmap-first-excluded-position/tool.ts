import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly word: number; readonly width: number };
export type Output = { readonly position: number; readonly full: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    word: { type: "integer", minimum: 0 },
    width: { type: "integer", minimum: 1, maximum: 32 },
  },
  required: ["word", "width"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { position: { type: "integer" }, full: { type: "boolean" } },
  required: ["position", "full"],
} as const;
/** Calculate bitmap first excluded position from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { word, width } = input;
  const compute = (): Output => {
    H.integer(width, 1, 32);
    H.integer(word, 0, 2 ** width - 1);
    let position = -1;
    for (let i = 0; i < width; i++)
      if (Math.floor(word / 2 ** i) % 2 === 0) {
        position = i;
        break;
      }
    return { position, full: position < 0 };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { word: 11, width: 4 },
  output: { position: 2, full: false },
} satisfies ToolExample<Input, Output>;
export const bitmapFirstExcludedPositionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bitwise/bitmap-first-excluded-position",
    title: "Bitmap First Excluded Position Tool",
    description:
      "Calculate bitmap first excluded position from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        word: { type: "integer", minimum: 0 },
        width: { type: "integer", minimum: 1, maximum: 32 },
      },
      required: ["word", "width"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { position: { type: "integer" }, full: { type: "boolean" } },
      required: ["position", "full"],
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
          id: "width",
          label: "Width",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "position", label: "Position", valueType: { type: "integer" } },
        { id: "full", label: "Full", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = bitmapFirstExcludedPositionTool.execute;
export default bitmapFirstExcludedPositionTool;

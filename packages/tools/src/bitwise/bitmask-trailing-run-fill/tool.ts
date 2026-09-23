import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly word: number; readonly width: number };
export type Output = { readonly value: number };
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
  properties: { value: { type: "integer" } },
  required: ["value"],
} as const;
/** Calculate bitmask trailing run fill from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { word, width } = input;
  const compute = (): Output => {
    H.integer(width, 1, 32);
    const max = 2 ** width - 1;
    H.integer(word, 0, max);
    return {
      value: Number((BigInt(word) | (BigInt(word) - 1n)) & BigInt(max)),
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { word: 40, width: 8 },
  output: { value: 47 },
} satisfies ToolExample<Input, Output>;
export const bitmaskTrailingRunFillTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bitwise/bitmask-trailing-run-fill",
    title: "Bitmask Trailing Run Fill Tool",
    description:
      "Calculate bitmask trailing run fill from explicit caller-supplied inputs.",
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
      properties: { value: { type: "integer" } },
      required: ["value"],
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
        { id: "value", label: "Value", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = bitmaskTrailingRunFillTool.execute;
export default bitmaskTrailingRunFillTool;

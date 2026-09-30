import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly dataBits: number; readonly wordBits: number };
export type Output = { readonly words: number; readonly padding: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dataBits: { type: "integer", minimum: 0 },
    wordBits: { type: "integer", minimum: 1, maximum: 32 },
  },
  required: ["dataBits", "wordBits"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { words: { type: "integer" }, padding: { type: "integer" } },
  required: ["words", "padding"],
} as const;
/** Calculate spi word padding bit count from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { dataBits, wordBits } = input;
  const compute = (): Output => {
    H.integer(dataBits, 0);
    H.integer(wordBits, 1, 32);
    const words = Math.ceil(dataBits / wordBits);
    return { words, padding: words * wordBits - dataBits };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { dataBits: 20, wordBits: 8 },
  output: { words: 3, padding: 4 },
} satisfies ToolExample<Input, Output>;
export const spiWordPaddingBitCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "microcontroller/spi-word-padding-bit-count",
    title: "SPI Word Padding Bit Count Tool",
    description:
      "Calculate spi word padding bit count from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dataBits: { type: "integer", minimum: 0 },
        wordBits: { type: "integer", minimum: 1, maximum: 32 },
      },
      required: ["dataBits", "wordBits"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { words: { type: "integer" }, padding: { type: "integer" } },
      required: ["words", "padding"],
    },
    ports: {
      inputs: [
        {
          id: "dataBits",
          label: "Data Bits",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "wordBits",
          label: "Word Bits",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "words", label: "Words", valueType: { type: "integer" } },
        { id: "padding", label: "Padding", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = spiWordPaddingBitCountTool.execute;
export default spiWordPaddingBitCountTool;

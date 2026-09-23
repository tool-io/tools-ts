import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
  integer,
  decimal,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly word: string;
  readonly index: number;
  readonly width: number;
};
export type Output = { readonly bit: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    word: { type: "string", maxLength: 8192 },
    index: { type: "integer", minimum: 0 },
    width: { type: "integer", minimum: 1, maximum: 128 },
  },
  required: ["word", "index", "width"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { bit: { type: "boolean" } },
  required: ["bit"],
} as const;
/** Compute bitword extract one packed bit from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { word, index, width } = input;
  const compute = (): Output => {
    integer(width, 1, 128);
    integer(index, 0, width - 1);
    const w = decimal(word);
    domain(w >= 0n && w < 1n << BigInt(width));
    return { bit: !!(w & (1n << BigInt(index))) };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { word: "9", index: 3, width: 8 },
  output: { bit: true },
} satisfies ToolExample<Input, Output>;
export const bitwordExtractOnePackedBitTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "bitwise/bitword-extract-one-packed-bit",
  title: "Bitword Extract One Packed Bit Tool",
  description:
    "Compute bitword extract one packed bit from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "word",
        label: "Word",
        required: true,
        valueType: { type: "string" },
      },
      {
        id: "index",
        label: "Index",
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
    outputs: [{ id: "bit", label: "Bit", valueType: { type: "boolean" } }],
  },
});
export const run = bitwordExtractOnePackedBitTool.execute;
export default bitwordExtractOnePackedBitTool;

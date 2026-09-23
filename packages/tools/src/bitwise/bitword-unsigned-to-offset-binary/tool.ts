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
export type Input = { readonly word: string; readonly width: number };
export type Output = { readonly word: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    word: { type: "string", maxLength: 8192 },
    width: { type: "integer", minimum: 1, maximum: 128 },
  },
  required: ["word", "width"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { word: { type: "string", maxLength: 8192 } },
  required: ["word"],
} as const;
/** Compute bitword unsigned to offset binary from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { word, width } = input;
  const compute = (): Output => {
    integer(width, 1, 128);
    const w = decimal(word);
    domain(w >= 0n && w < 1n << BigInt(width));
    return { word: (w ^ (1n << BigInt(width - 1))).toString() };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { word: "0", width: 8 },
  output: { word: "128" },
} satisfies ToolExample<Input, Output>;
export const bitwordUnsignedToOffsetBinaryTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "bitwise/bitword-unsigned-to-offset-binary",
  title: "Bitword Unsigned To Offset Binary Tool",
  description:
    "Compute bitword unsigned to offset binary from explicit bounded inputs.",
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
        id: "width",
        label: "Width",
        required: true,
        valueType: { type: "integer" },
      },
    ],
    outputs: [{ id: "word", label: "Word", valueType: { type: "string" } }],
  },
});
export const run = bitwordUnsignedToOffsetBinaryTool.execute;
export default bitwordUnsignedToOffsetBinaryTool;

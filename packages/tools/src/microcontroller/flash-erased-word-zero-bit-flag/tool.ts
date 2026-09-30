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
export type Output = { readonly erased: boolean; readonly zeroBits: number };
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
  properties: { erased: { type: "boolean" }, zeroBits: { type: "integer" } },
  required: ["erased", "zeroBits"],
} as const;
/** Compute flash erased word zero bit flag from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { word, width } = input;
  const compute = (): Output => {
    integer(width, 1, 128);
    const w = decimal(word),
      mask = (1n << BigInt(width)) - 1n;
    domain(w >= 0n && w <= mask);
    return {
      erased: w === mask,
      zeroBits: width - [...w.toString(2)].filter((x) => x === "1").length,
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { word: "255", width: 8 },
  output: { erased: true, zeroBits: 0 },
} satisfies ToolExample<Input, Output>;
export const flashErasedWordZeroBitFlagTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "microcontroller/flash-erased-word-zero-bit-flag",
  title: "Flash Erased Word Zero Bit Flag Tool",
  description:
    "Compute flash erased word zero bit flag from explicit bounded inputs.",
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
    outputs: [
      { id: "erased", label: "Erased", valueType: { type: "boolean" } },
      { id: "zeroBits", label: "Zero Bits", valueType: { type: "integer" } },
    ],
  },
});
export const run = flashErasedWordZeroBitFlagTool.execute;
export default flashErasedWordZeroBitFlagTool;

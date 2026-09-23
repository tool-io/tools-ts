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
  readonly width: number;
  readonly negativeZero: boolean;
};
export type Output = { readonly word: string; readonly changed: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    word: { type: "string", maxLength: 8192 },
    width: { type: "integer", minimum: 1, maximum: 128 },
    negativeZero: { type: "boolean" },
  },
  required: ["word", "width", "negativeZero"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    word: { type: "string", maxLength: 8192 },
    changed: { type: "boolean" },
  },
  required: ["word", "changed"],
} as const;
/** Compute ones complement checksum zero canonicalizer from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { word, width, negativeZero } = input;
  const compute = (): Output => {
    integer(width, 1, 128);
    const w = decimal(word),
      mask = (1n << BigInt(width)) - 1n;
    domain(w >= 0n && w <= mask);
    const result = w === 0n || w === mask ? (negativeZero ? mask : 0n) : w;
    return { word: result.toString(), changed: result !== w };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { word: "0", width: 16, negativeZero: true },
  output: { word: "65535", changed: true },
} satisfies ToolExample<Input, Output>;
export const onesComplementChecksumZeroCanonicalizerTool =
  defineSchemaCalculation<Input, Output>({
    id: "bitwise/ones-complement-checksum-zero-canonicalizer",
    title: "Ones Complement Checksum Zero Canonicalizer Tool",
    description:
      "Compute ones complement checksum zero canonicalizer from explicit bounded inputs.",
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
        {
          id: "negativeZero",
          label: "Negative Zero",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "word", label: "Word", valueType: { type: "string" } },
        { id: "changed", label: "Changed", valueType: { type: "boolean" } },
      ],
    },
  });
export const run = onesComplementChecksumZeroCanonicalizerTool.execute;
export default onesComplementChecksumZeroCanonicalizerTool;

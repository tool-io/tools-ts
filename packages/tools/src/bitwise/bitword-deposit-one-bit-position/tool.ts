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
  readonly bit: boolean;
  readonly index: number;
  readonly width: number;
};
export type Output = { readonly word: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    word: { type: "string", maxLength: 8192 },
    bit: { type: "boolean" },
    index: { type: "integer", minimum: 0 },
    width: { type: "integer", minimum: 1, maximum: 128 },
  },
  required: ["word", "bit", "index", "width"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { word: { type: "string", maxLength: 8192 } },
  required: ["word"],
} as const;
/** Compute bitword deposit one bit position from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { word, bit, index, width } = input;
  const compute = (): Output => {
    integer(width, 1, 128);
    integer(index, 0, width - 1);
    const w = decimal(word),
      mask = 1n << BigInt(index);
    domain(w >= 0n && w < 1n << BigInt(width));
    return { word: (bit ? w | mask : w & ~mask).toString() };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { word: "1", bit: true, index: 3, width: 8 },
  output: { word: "9" },
} satisfies ToolExample<Input, Output>;
export const bitwordDepositOneBitPositionTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "bitwise/bitword-deposit-one-bit-position",
  title: "Bitword Deposit One Bit Position Tool",
  description:
    "Compute bitword deposit one bit position from explicit bounded inputs.",
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
        id: "bit",
        label: "Bit",
        required: true,
        valueType: { type: "boolean" },
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
    outputs: [{ id: "word", label: "Word", valueType: { type: "string" } }],
  },
});
export const run = bitwordDepositOneBitPositionTool.execute;
export default bitwordDepositOneBitPositionTool;

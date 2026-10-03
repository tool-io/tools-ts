import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly length: number };
export type Output = {
  readonly evenPositions: number;
  readonly oddPositions: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { length: { type: "integer", minimum: 0 } },
  required: ["length"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    evenPositions: { type: "integer" },
    oddPositions: { type: "integer" },
  },
  required: ["evenPositions", "oddPositions"],
} as const;
/** Compute interleaved sequence odd even length from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { length } = input;
  const compute = (): Output => {
    integer(length);
    return {
      evenPositions: Math.ceil(length / 2),
      oddPositions: Math.floor(length / 2),
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { length: 7 },
  output: { evenPositions: 4, oddPositions: 3 },
} satisfies ToolExample<Input, Output>;
export const interleavedSequenceOddEvenLengthTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "sequence/interleaved-sequence-odd-even-length",
  title: "Interleaved Sequence Odd Even Length Tool",
  description:
    "Compute interleaved sequence odd even length from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "length",
        label: "Length",
        required: true,
        valueType: { type: "integer" },
      },
    ],
    outputs: [
      {
        id: "evenPositions",
        label: "Even Positions",
        valueType: { type: "integer" },
      },
      {
        id: "oddPositions",
        label: "Odd Positions",
        valueType: { type: "integer" },
      },
    ],
  },
});
export const run = interleavedSequenceOddEvenLengthTool.execute;
export default interleavedSequenceOddEvenLengthTool;

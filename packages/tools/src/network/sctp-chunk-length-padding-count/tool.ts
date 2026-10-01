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
  readonly padding: number;
  readonly paddedLength: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { length: { type: "integer", minimum: 4, maximum: 65535 } },
  required: ["length"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    padding: { type: "integer" },
    paddedLength: { type: "integer" },
  },
  required: ["padding", "paddedLength"],
} as const;
/** Compute sctp chunk length padding count from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { length } = input;
  const compute = (): Output => {
    integer(length, 4, 65535);
    const padding = (4 - (length % 4)) % 4;
    return { padding, paddedLength: length + padding };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { length: 7 },
  output: { padding: 1, paddedLength: 8 },
} satisfies ToolExample<Input, Output>;
export const sctpChunkLengthPaddingCountTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "network/sctp-chunk-length-padding-count",
  title: "SCTP Chunk Length Padding Count Tool",
  description:
    "Compute sctp chunk length padding count from explicit bounded inputs.",
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
      { id: "padding", label: "Padding", valueType: { type: "integer" } },
      {
        id: "paddedLength",
        label: "Padded Length",
        valueType: { type: "integer" },
      },
    ],
  },
});
export const run = sctpChunkLengthPaddingCountTool.execute;
export default sctpChunkLengthPaddingCountTool;

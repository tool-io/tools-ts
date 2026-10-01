import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly identifier: number; readonly sequence: number };
export type Output = { readonly bytes: readonly number[] };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    identifier: { type: "integer", minimum: 0, maximum: 65535 },
    sequence: { type: "integer", minimum: 0, maximum: 65535 },
  },
  required: ["identifier", "sequence"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bytes: { type: "array", maxItems: 256, items: { type: "integer" } },
  },
  required: ["bytes"],
} as const;
/** Compute icmp identifier sequence word split from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { identifier, sequence } = input;
  const compute = (): Output => {
    integer(identifier, 0, 65535);
    integer(sequence, 0, 65535);
    return {
      bytes: [identifier >> 8, identifier & 255, sequence >> 8, sequence & 255],
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { identifier: 4660, sequence: 43981 },
  output: { bytes: [18, 52, 171, 205] },
} satisfies ToolExample<Input, Output>;
export const icmpIdentifierSequenceWordSplitTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "network/icmp-identifier-sequence-word-split",
  title: "ICMP Identifier Sequence Word Split Tool",
  description:
    "Compute icmp identifier sequence word split from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "identifier",
        label: "Identifier",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "sequence",
        label: "Sequence",
        required: true,
        valueType: { type: "integer" },
      },
    ],
    outputs: [
      {
        id: "bytes",
        label: "Bytes",
        valueType: { type: "list", items: { type: "integer" } },
      },
    ],
  },
});
export const run = icmpIdentifierSequenceWordSplitTool.execute;
export default icmpIdentifierSequenceWordSplitTool;

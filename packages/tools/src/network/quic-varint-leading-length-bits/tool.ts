import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly firstOctet: number };
export type Output = {
  readonly lengthBytes: number;
  readonly payloadBits: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { firstOctet: { type: "integer", minimum: 0, maximum: 255 } },
  required: ["firstOctet"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lengthBytes: { type: "integer" },
    payloadBits: { type: "integer" },
  },
  required: ["lengthBytes", "payloadBits"],
} as const;
/** Compute quic varint leading length bits from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { firstOctet } = input;
  const compute = (): Output => {
    integer(firstOctet, 0, 255);
    const lengthBytes = 2 ** (firstOctet >> 6);
    return { lengthBytes, payloadBits: lengthBytes * 8 - 2 };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { firstOctet: 192 },
  output: { lengthBytes: 8, payloadBits: 62 },
} satisfies ToolExample<Input, Output>;
export const quicVarintLeadingLengthBitsTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "network/quic-varint-leading-length-bits",
  title: "QUIC Varint Leading Length Bits Tool",
  description:
    "Compute quic varint leading length bits from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "firstOctet",
        label: "First Octet",
        required: true,
        valueType: { type: "integer" },
      },
    ],
    outputs: [
      {
        id: "lengthBytes",
        label: "Length Bytes",
        valueType: { type: "integer" },
      },
      {
        id: "payloadBits",
        label: "Payload Bits",
        valueType: { type: "integer" },
      },
    ],
  },
});
export const run = quicVarintLeadingLengthBitsTool.execute;
export default quicVarintLeadingLengthBitsTool;

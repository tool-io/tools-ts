import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly payloadBytes: number;
  readonly unusedBits: number;
};
export type Output = { readonly prefixHex: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    payloadBytes: { type: "integer", minimum: 0 },
    unusedBits: { type: "integer", minimum: 0, maximum: 7 },
  },
  required: ["payloadBytes", "unusedBits"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { prefixHex: { type: "string", maxLength: 8192 } },
  required: ["prefixHex"],
} as const;
/** Write the DER BIT STRING tag, definite length and unused-bit-count prefix for an explicitly supplied payload length; payload bytes are not serialized. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { payloadBytes, unusedBits } = request;
  const compute = (): Output => {
    H.integer(payloadBytes, 0);
    H.integer(unusedBits, 0, 7);
    H.domain(payloadBytes > 0 || unusedBits === 0);
    const length = BigInt(payloadBytes) + 1n;
    let encoded: string;
    if (length < 128n) encoded = length.toString(16).padStart(2, "0");
    else {
      let hex = length.toString(16);
      if (hex.length % 2) hex = "0" + hex;
      encoded = (128 + hex.length / 2).toString(16) + hex;
    }
    return {
      prefixHex: "03" + encoded + unusedBits.toString(16).padStart(2, "0"),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { payloadBytes: 3, unusedBits: 4 },
  output: { prefixHex: "030404" },
} satisfies ToolExample<Input, Output>;
export const derBitStringPrefixWriterTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "encode/der-bit-string-prefix-writer",
    title: "DER Bit String Prefix Writer Tool",
    description:
      "Write the DER BIT STRING tag, definite length and unused-bit-count prefix for an explicitly supplied payload length; payload bytes are not serialized.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        payloadBytes: { type: "integer", minimum: 0 },
        unusedBits: { type: "integer", minimum: 0, maximum: 7 },
      },
      required: ["payloadBytes", "unusedBits"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { prefixHex: { type: "string", maxLength: 8192 } },
      required: ["prefixHex"],
    },
    ports: {
      inputs: [
        {
          id: "payloadBytes",
          label: "Payload Bytes",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "unusedBits",
          label: "Unused Bits",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "prefixHex", label: "Prefix Hex", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = derBitStringPrefixWriterTool.execute;
export default derBitStringPrefixWriterTool;

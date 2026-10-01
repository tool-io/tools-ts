import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly expected: string;
  readonly truncated: number;
  readonly bits: number;
};
export type Output = { readonly packetNumber: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    expected: { type: "string", maxLength: 8192 },
    truncated: { type: "integer", minimum: 0 },
    bits: { type: "integer" },
  },
  required: ["expected", "truncated", "bits"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { packetNumber: { type: "string", maxLength: 8192 } },
  required: ["packetNumber"],
} as const;
/** Reconstruct the QUIC full packet number nearest an explicit expected value using RFC 9000 Appendix A.3. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { expected, truncated, bits } = request;
  const compute = (): Output => {
    const e = H.decimal(expected);
    H.domain(e >= 0n && e < 4611686018427387904n);
    H.domain(bits === 8 || bits === 16 || bits === 24 || bits === 32);
    H.integer(truncated, 0, 2 ** bits - 1);
    const window = 1n << BigInt(bits),
      half = window / 2n;
    let candidate = (e & ~(window - 1n)) | BigInt(truncated);
    if (candidate + half <= e && candidate + window < 4611686018427387904n)
      candidate += window;
    else if (candidate > e + half && candidate >= window) candidate -= window;
    return { packetNumber: String(candidate) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { expected: "256", truncated: 1, bits: 8 },
  output: { packetNumber: "257" },
} satisfies ToolExample<Input, Output>;
export const quicPacketNumberTruncatedWindowTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "network/quic-packet-number-truncated-window",
    title: "QUIC Packet Number Truncated Window Tool",
    description:
      "Reconstruct the QUIC full packet number nearest an explicit expected value using RFC 9000 Appendix A.3.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        expected: { type: "string", maxLength: 8192 },
        truncated: { type: "integer", minimum: 0 },
        bits: { type: "integer" },
      },
      required: ["expected", "truncated", "bits"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { packetNumber: { type: "string", maxLength: 8192 } },
      required: ["packetNumber"],
    },
    ports: {
      inputs: [
        {
          id: "expected",
          label: "Expected",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "truncated",
          label: "Truncated",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "bits",
          label: "Bits",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "packetNumber",
          label: "Packet Number",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = quicPacketNumberTruncatedWindowTool.execute;
export default quicPacketNumberTruncatedWindowTool;

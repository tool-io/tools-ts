import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly signedDecimal: string; readonly bits: number };
export type Output = { readonly unsignedDecimal: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signedDecimal: { type: "string", maxLength: 8192 },
    bits: { type: "integer", minimum: 1, maximum: 64 },
  },
  required: ["signedDecimal", "bits"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { unsignedDecimal: { type: "string", maxLength: 8192 } },
  required: ["unsignedDecimal"],
} as const;
/** Encode one bounded signed integer with Protocol Buffers ZigZag mapping; not varint byte serialization. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { signedDecimal, bits } = request;
  const compute = (): Output => {
    H.integer(bits, 1, 64);
    const n = H.decimal(signedDecimal),
      half = 1n << BigInt(bits - 1);
    H.domain(n >= -half && n < half);
    return { unsignedDecimal: (n >= 0n ? 2n * n : -2n * n - 1n).toString() };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { signedDecimal: "-2", bits: 32 },
  output: { unsignedDecimal: "3" },
} satisfies ToolExample<Input, Output>;
export const protobufZigzagSignedScalarTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "encode/protobuf-zigzag-signed-scalar",
    title: "Protocol Buffers Zigzag Signed Scalar Tool",
    description:
      "Encode one bounded signed integer with Protocol Buffers ZigZag mapping; not varint byte serialization.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signedDecimal: { type: "string", maxLength: 8192 },
        bits: { type: "integer", minimum: 1, maximum: 64 },
      },
      required: ["signedDecimal", "bits"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { unsignedDecimal: { type: "string", maxLength: 8192 } },
      required: ["unsignedDecimal"],
    },
    ports: {
      inputs: [
        {
          id: "signedDecimal",
          label: "Signed Decimal",
          required: true,
          valueType: { type: "string" },
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
          id: "unsignedDecimal",
          label: "Unsigned Decimal",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = protobufZigzagSignedScalarTool.execute;
export default protobufZigzagSignedScalarTool;

import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly bits: number };
export type Output = {
  readonly unusedBits: number;
  readonly payloadOctets: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { bits: { type: "integer", minimum: 0 } },
  required: ["bits"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    unusedBits: { type: "integer" },
    payloadOctets: { type: "integer" },
  },
  required: ["unusedBits", "payloadOctets"],
} as const;
/** Calculate der bitstring padding count octet from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { bits } = input;
  const compute = (): Output => {
    H.integer(bits, 0);
    return { unusedBits: H.mod(-bits, 8), payloadOctets: Math.ceil(bits / 8) };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { bits: 13 },
  output: { unusedBits: 3, payloadOctets: 2 },
} satisfies ToolExample<Input, Output>;
export const derBitstringPaddingCountOctetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "encode/der-bitstring-padding-count-octet",
    title: "DER Bitstring Padding Count Octet Tool",
    description:
      "Calculate der bitstring padding count octet from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { bits: { type: "integer", minimum: 0 } },
      required: ["bits"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        unusedBits: { type: "integer" },
        payloadOctets: { type: "integer" },
      },
      required: ["unusedBits", "payloadOctets"],
    },
    ports: {
      inputs: [
        {
          id: "bits",
          label: "Bits",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "unusedBits",
          label: "Unused Bits",
          valueType: { type: "integer" },
        },
        {
          id: "payloadOctets",
          label: "Payload Octets",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = derBitstringPaddingCountOctetTool.execute;
export default derBitstringPaddingCountOctetTool;

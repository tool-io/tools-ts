import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly unused: number;
  readonly lastOctet: number;
  readonly hasPayload: boolean;
};
export type Output = { readonly meaningfulBitsInLast: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    unused: { type: "integer", minimum: 0, maximum: 7 },
    lastOctet: { type: "integer", minimum: 0, maximum: 255 },
    hasPayload: { type: "boolean" },
  },
  required: ["unused", "lastOctet", "hasPayload"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { meaningfulBitsInLast: { type: "integer" } },
  required: ["meaningfulBitsInLast"],
} as const;
/** Validate DER BIT STRING padding zeros from the unused-bit count and final payload octet. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { unused, lastOctet, hasPayload } = input;
  const compute = (): Output => {
    H.integer(unused, 0, 7);
    H.integer(lastOctet, 0, 255);
    H.domain(
      hasPayload
        ? lastOctet % 2 ** unused === 0
        : unused === 0 && lastOctet === 0,
    );
    return { meaningfulBitsInLast: hasPayload ? 8 - unused : 0 };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { unused: 3, lastOctet: 168, hasPayload: true },
  output: { meaningfulBitsInLast: 5 },
} satisfies ToolExample<Input, Output>;
export const derBitstringUnusedBitCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "decode/der-bitstring-unused-bit-count",
    title: "DER Bitstring Unused Bit Count Tool",
    description:
      "Validate DER BIT STRING padding zeros from the unused-bit count and final payload octet.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        unused: { type: "integer", minimum: 0, maximum: 7 },
        lastOctet: { type: "integer", minimum: 0, maximum: 255 },
        hasPayload: { type: "boolean" },
      },
      required: ["unused", "lastOctet", "hasPayload"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { meaningfulBitsInLast: { type: "integer" } },
      required: ["meaningfulBitsInLast"],
    },
    ports: {
      inputs: [
        {
          id: "unused",
          label: "Unused",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "lastOctet",
          label: "Last Octet",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "hasPayload",
          label: "Has Payload",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "meaningfulBitsInLast",
          label: "Meaningful Bits In Last",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = derBitstringUnusedBitCountTool.execute;
export default derBitstringUnusedBitCountTool;

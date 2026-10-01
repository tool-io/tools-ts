import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly prefixLength: number };
export type Output = {
  readonly hostBits: number;
  readonly addressCountDecimal: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { prefixLength: { type: "integer", minimum: 0, maximum: 128 } },
  required: ["prefixLength"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    hostBits: { type: "integer" },
    addressCountDecimal: { type: "string", maxLength: 8192 },
  },
  required: ["hostBits", "addressCountDecimal"],
} as const;
/** Count address bits and all bit patterns within an IPv6 prefix without subtracting network or broadcast addresses. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { prefixLength } = request;
  const compute = (): Output => {
    H.integer(prefixLength, 0, 128);
    return {
      hostBits: 128 - prefixLength,
      addressCountDecimal: (1n << BigInt(128 - prefixLength)).toString(),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { prefixLength: 64 },
  output: { hostBits: 64, addressCountDecimal: "18446744073709551616" },
} satisfies ToolExample<Input, Output>;
export const ipv6PrefixHostBitCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "network/ipv6-prefix-host-bit-count",
    title: "IPv6 Prefix Host Bit Count Tool",
    description:
      "Count address bits and all bit patterns within an IPv6 prefix without subtracting network or broadcast addresses.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        prefixLength: { type: "integer", minimum: 0, maximum: 128 },
      },
      required: ["prefixLength"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        hostBits: { type: "integer" },
        addressCountDecimal: { type: "string", maxLength: 8192 },
      },
      required: ["hostBits", "addressCountDecimal"],
    },
    ports: {
      inputs: [
        {
          id: "prefixLength",
          label: "Prefix Length",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "hostBits", label: "Host Bits", valueType: { type: "integer" } },
        {
          id: "addressCountDecimal",
          label: "Address Count Decimal",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = ipv6PrefixHostBitCountTool.execute;
export default ipv6PrefixHostBitCountTool;

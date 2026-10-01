import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly addressHex: string;
  readonly globalPrefixLength: number;
  readonly subnetPrefixLength: number;
};
export type Output = { readonly subnetId: string; readonly bits: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    addressHex: { type: "string", maxLength: 8192 },
    globalPrefixLength: { type: "integer", minimum: 0, maximum: 128 },
    subnetPrefixLength: { type: "integer", maximum: 128 },
  },
  required: ["addressHex", "globalPrefixLength", "subnetPrefixLength"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    subnetId: { type: "string", maxLength: 8192 },
    bits: { type: "integer" },
  },
  required: ["subnetId", "bits"],
} as const;
/** Compute ipv6 prefix subnet id field from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { addressHex, globalPrefixLength, subnetPrefixLength } = input;
  const compute = (): Output => {
    domain(/^[0-9a-fA-F]{32}(?![\s\S])/.test(addressHex));
    integer(globalPrefixLength, 0, 128);
    integer(subnetPrefixLength, globalPrefixLength, 128);
    const bits = subnetPrefixLength - globalPrefixLength,
      word = BigInt("0x" + addressHex);
    return {
      subnetId: (
        (word >> BigInt(128 - subnetPrefixLength)) &
        ((1n << BigInt(bits)) - 1n)
      ).toString(),
      bits,
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: {
    addressHex: "20010db8abcd00120000000000000001",
    globalPrefixLength: 48,
    subnetPrefixLength: 64,
  },
  output: { subnetId: "18", bits: 16 },
} satisfies ToolExample<Input, Output>;
export const ipv6PrefixSubnetIdFieldTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "network/ipv6-prefix-subnet-id-field",
  title: "IPv6 Prefix Subnet ID Field Tool",
  description:
    "Compute ipv6 prefix subnet id field from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "addressHex",
        label: "Address Hex",
        required: true,
        valueType: { type: "string" },
      },
      {
        id: "globalPrefixLength",
        label: "Global Prefix Length",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "subnetPrefixLength",
        label: "Subnet Prefix Length",
        required: true,
        valueType: { type: "integer" },
      },
    ],
    outputs: [
      { id: "subnetId", label: "Subnet Id", valueType: { type: "string" } },
      { id: "bits", label: "Bits", valueType: { type: "integer" } },
    ],
  },
});
export const run = ipv6PrefixSubnetIdFieldTool.execute;
export default ipv6PrefixSubnetIdFieldTool;

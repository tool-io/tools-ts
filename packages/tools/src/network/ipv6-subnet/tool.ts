import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { formatIpv6Full, parseIpv6 } from "../ipv6-expand/tool.js";

export type Ipv6SubnetInput = {
  readonly address: string;
  readonly prefixLength: number;
};

export type Ipv6SubnetOutput = {
  readonly expandedAddress: string;
  readonly firstHost: string;
  readonly hostBitCount: number;
  readonly hostCountText: string;
  readonly lastHost: string;
  readonly networkAddress: string;
  readonly prefixLength: number;
};

const groupsToBigInt = (groups: readonly number[]): bigint =>
  groups.reduce((value, group) => (value << 16n) | BigInt(group), 0n);

const bigIntToGroups = (value: bigint): number[] => {
  const groups: number[] = [];
  for (let index = 7; index >= 0; index -= 1)
    groups.push(Number((value >> BigInt(16 * index)) & 0xffffn));
  return groups;
};

const ALL_BITS = (1n << 128n) - 1n;

export const calculateIpv6Subnet = (
  input: Ipv6SubnetInput,
): Ipv6SubnetOutput => {
  const prefixLength = input.prefixLength;
  if (!Number.isInteger(prefixLength) || prefixLength < 0 || prefixLength > 128)
    simpleError(
      "prefixLength",
      "The prefix length must be an integer between zero and one hundred twenty-eight.",
      "invalid_prefix_length",
    );
  const address = groupsToBigInt(parseIpv6(input.address));
  const hostBits = BigInt(128 - prefixLength);
  const hostMask = (1n << hostBits) - 1n;
  const network = address & ~hostMask & ALL_BITS;
  const last = network | hostMask;
  return {
    expandedAddress: formatIpv6Full(bigIntToGroups(address)),
    firstHost: formatIpv6Full(bigIntToGroups(network)),
    hostBitCount: 128 - prefixLength,
    hostCountText: (1n << hostBits).toString(),
    lastHost: formatIpv6Full(bigIntToGroups(last)),
    networkAddress: formatIpv6Full(bigIntToGroups(network)),
    prefixLength,
  };
};

export const ipv6SubnetExample = {
  input: { address: "2001:db8::1", prefixLength: 64 },
  output: {
    expandedAddress: "2001:0db8:0000:0000:0000:0000:0000:0001",
    firstHost: "2001:0db8:0000:0000:0000:0000:0000:0000",
    hostBitCount: 64,
    hostCountText: "18446744073709551616",
    lastHost: "2001:0db8:0000:0000:ffff:ffff:ffff:ffff",
    networkAddress: "2001:0db8:0000:0000:0000:0000:0000:0000",
    prefixLength: 64,
  },
} satisfies ToolExample<Ipv6SubnetInput, Ipv6SubnetOutput>;

export const ipv6SubnetTool = createSimpleTool({
  calculate: (rawInput) =>
    calculateIpv6Subnet({
      address: rawInput.address as string,
      prefixLength: rawInput.prefixLength as number,
    }),
  description:
    "Expand an IPv6 address, apply a prefix length, and derive the first address, last address, and exact address count. IPv6 has no broadcast address and does not subtract network or broadcast addresses from a prefix.",
  id: "network/ipv6-subnet",
  inputs: [
    {
      description:
        "IPv6 address in RFC 4291 notation, optionally with an embedded IPv4 tail.",
      id: "address",
      kind: "string",
      label: "IPv6 address",
    },
    {
      description: "Prefix length between zero and one hundred twenty-eight.",
      id: "prefixLength",
      kind: "integer",
      label: "Prefix length",
      maximum: 128,
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "The input address in full eight-group lowercase form.",
      id: "expandedAddress",
      kind: "string",
      label: "Expanded address",
    },
    {
      description:
        "First address in the prefix (the address with all host bits cleared).",
      id: "firstHost",
      kind: "string",
      label: "First host",
    },
    {
      description: "Number of bits available for host addressing.",
      id: "hostBitCount",
      kind: "integer",
      label: "Host bits",
    },
    {
      description:
        "Exact decimal address count as text so prefixes with more than fifty-three host bits stay precise.",
      id: "hostCountText",
      kind: "string",
      label: "Host count",
    },
    {
      description:
        "Last address in the prefix (the address with all host bits set).",
      id: "lastHost",
      kind: "string",
      label: "Last host",
    },
    {
      description: "The address with all host bits cleared.",
      id: "networkAddress",
      kind: "string",
      label: "Network address",
    },
    {
      description: "Echo of the applied prefix length.",
      id: "prefixLength",
      kind: "integer",
      label: "Prefix length",
    },
  ],
  title: "IPv6 Subnet Calculator",
});
export const runIpv6Subnet = ipv6SubnetTool.execute;
export default ipv6SubnetTool;

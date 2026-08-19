import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { parseIpv6 } from "../ipv6-expand/tool.js";

export type Ipv6CompressInput = {
  readonly address: string;
};

export type Ipv6CompressOutput = {
  readonly address: string;
};

export const ipv6CompressExample = {
  input: { address: "2001:0db8:0000:0000:0000:ff00:0042:8329" },
  output: { address: "2001:db8::ff00:42:8329" },
} satisfies ToolExample<Ipv6CompressInput, Ipv6CompressOutput>;

/**
 * Formats groups per RFC 5952: lowercase hex without leading zeros and
 * the leftmost longest zero run of two or more groups collapsed to "::".
 */
export const formatIpv6Compressed = (groups: readonly number[]): string => {
  const hexGroups = groups.map((group) => group.toString(16));
  let bestStart = -1;
  let bestLength = 0;
  let currentStart = -1;
  let currentLength = 0;
  for (let index = 0; index < hexGroups.length; index += 1) {
    if (hexGroups[index] === "0") {
      if (currentStart < 0) currentStart = index;
      currentLength += 1;
      if (currentLength > bestLength) {
        bestStart = currentStart;
        bestLength = currentLength;
      }
    } else {
      currentStart = -1;
      currentLength = 0;
    }
  }
  if (bestLength < 2) return hexGroups.join(":");
  const head = hexGroups.slice(0, bestStart).join(":");
  const tail = hexGroups.slice(bestStart + bestLength).join(":");
  return `${head}::${tail}`;
};

export const calculateIpv6Compress = (
  input: Ipv6CompressInput,
): Ipv6CompressOutput => ({
  address: formatIpv6Compressed(parseIpv6(input.address as string)),
});

export const ipv6CompressTool = createSimpleTool({
  calculate: (input) =>
    calculateIpv6Compress(input as unknown as Ipv6CompressInput),
  description:
    "Canonicalize an IPv6 address into its compressed RFC 5952 form.",
  id: "network/ipv6-compress",
  inputs: [
    {
      description:
        "IPv6 address in RFC 4291 notation, optionally with an embedded IPv4 tail.",
      id: "address",
      kind: "string",
      label: "IPv6 address",
    },
  ],
  outputs: [
    {
      description: "Canonical compressed address.",
      id: "address",
      kind: "string",
      label: "Compressed address",
    },
  ],
  title: "IPv6 Address Compressor",
});
export const runIpv6Compress = ipv6CompressTool.execute;
export default ipv6CompressTool;

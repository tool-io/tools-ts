import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Ipv4BroadcastAddressInput = {
  readonly ipAddress: string;
  readonly subnetMask: string;
};

export type Ipv4BroadcastAddressOutput = { readonly broadcastAddress: string };

const IPV4_PATTERN =
  /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/u;

const parseIpv4 = (value: string, field: string): number[] => {
  if (!IPV4_PATTERN.test(value))
    simpleError(
      field,
      "Enter a valid dotted-decimal IPv4 address.",
      "invalid_ipv4",
    );
  return value.split(".").map(Number);
};

const validateMask = (octets: readonly number[]): void => {
  const value = octets.reduce((total, octet) => total * 256 + octet, 0) >>> 0;
  const inverted = ~value >>> 0;
  if (inverted !== 0 && (inverted & (inverted + 1)) !== 0)
    simpleError(
      "subnetMask",
      "The subnet mask must contain contiguous leading one bits.",
      "invalid_subnet_mask",
    );
};

export const calculateIpv4BroadcastAddress = (
  input: Ipv4BroadcastAddressInput,
): Ipv4BroadcastAddressOutput => {
  const ip = parseIpv4(input.ipAddress, "ipAddress");
  const mask = parseIpv4(input.subnetMask, "subnetMask");
  validateMask(mask);
  return {
    broadcastAddress: ip
      .map((octet, index) => octet | (~mask[index]! & 255))
      .join("."),
  };
};

export const ipv4BroadcastAddressExample = {
  input: { ipAddress: "192.168.1.77", subnetMask: "255.255.255.0" },
  output: { broadcastAddress: "192.168.1.255" },
} satisfies ToolExample<Ipv4BroadcastAddressInput, Ipv4BroadcastAddressOutput>;

export const ipv4BroadcastAddressTool = createSimpleTool({
  calculate: (input) =>
    calculateIpv4BroadcastAddress(input as Ipv4BroadcastAddressInput),
  description:
    "Compute an IPv4 broadcast address from an address and subnet mask.",
  id: "network/ipv4-broadcast-address",
  inputs: [
    { id: "ipAddress", label: "IP address", kind: "string" },
    { id: "subnetMask", label: "Subnet mask", kind: "string" },
  ],
  outputs: [
    { id: "broadcastAddress", label: "Broadcast address", kind: "string" },
  ],
  title: "IPv4 Broadcast Address Calculator",
});

export const runIpv4BroadcastAddress = ipv4BroadcastAddressTool.execute;
export default ipv4BroadcastAddressTool;

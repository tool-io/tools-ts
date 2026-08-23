import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Ipv4NetworkAddressInput = {
  readonly ipAddress: string;
  readonly subnetMask: string;
};

export type Ipv4NetworkAddressOutput = { readonly networkAddress: string };

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

export const calculateIpv4NetworkAddress = (
  input: Ipv4NetworkAddressInput,
): Ipv4NetworkAddressOutput => {
  const ip = parseIpv4(input.ipAddress, "ipAddress");
  const mask = parseIpv4(input.subnetMask, "subnetMask");
  validateMask(mask);
  return {
    networkAddress: ip.map((octet, index) => octet & mask[index]!).join("."),
  };
};

export const ipv4NetworkAddressExample = {
  input: { ipAddress: "192.168.1.77", subnetMask: "255.255.255.0" },
  output: { networkAddress: "192.168.1.0" },
} satisfies ToolExample<Ipv4NetworkAddressInput, Ipv4NetworkAddressOutput>;

export const ipv4NetworkAddressTool = createSimpleTool({
  calculate: (input) =>
    calculateIpv4NetworkAddress(input as Ipv4NetworkAddressInput),
  description:
    "Compute an IPv4 network address from an address and subnet mask.",
  id: "network/ipv4-network-address",
  inputs: [
    { id: "ipAddress", label: "IP address", kind: "string" },
    { id: "subnetMask", label: "Subnet mask", kind: "string" },
  ],
  outputs: [{ id: "networkAddress", label: "Network address", kind: "string" }],
  title: "IPv4 Network Address Calculator",
});

export const runIpv4NetworkAddress = ipv4NetworkAddressTool.execute;
export default ipv4NetworkAddressTool;

import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { ToolExample } from "../../core/example.js";

const IPV4_PATTERN =
  /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/;

export const example = {
  input: { address: "10.0.0.5" },
  output: { isPrivate: true },
} satisfies ToolExample<{ address: string }, { isPrivate: boolean }>;

const toInt = (address: string): number => {
  const o = address.split(".").map(Number);
  return o[0] * 16777216 + o[1] * 65536 + o[2] * 256 + o[3];
};

export const privateIpCheckerTool = createSimpleTool({
  id: "network/private-ip-checker",
  title: "Private IP Checker",
  description:
    "Check whether an IPv4 address is private, loopback, or link-local per RFC 1918 and RFC 3927.",
  inputs: [
    {
      description: "Dotted-decimal IPv4 address.",
      id: "address",
      kind: "string",
      label: "Address",
    },
  ],
  outputs: [
    {
      description:
        "Whether the address is in a checked private or special-use range.",
      id: "isPrivate",
      kind: "boolean",
      label: "Is private",
    },
  ],
  calculate: (input) => {
    const address = String(input.address);
    if (!IPV4_PATTERN.test(address))
      return simpleError(
        "address",
        "address must be a valid dotted-decimal IPv4 address.",
        "address_invalid",
      );
    const value = toInt(address);
    const inRange = (start: string, end: string): boolean =>
      value >= toInt(start) && value <= toInt(end);
    return {
      isPrivate:
        inRange("10.0.0.0", "10.255.255.255") ||
        inRange("172.16.0.0", "172.31.255.255") ||
        inRange("192.168.0.0", "192.168.255.255") ||
        inRange("127.0.0.0", "127.255.255.255") ||
        inRange("169.254.0.0", "169.254.255.255"),
    };
  },
});

export const runPrivateIpChecker = privateIpCheckerTool.execute;
export default privateIpCheckerTool;

import { createSimpleTool } from "../../core/simple.js";
import type { ToolExample } from "../../core/example.js";

export const example = {
  input: { prefix: 24 },
  output: { netmask: "255.255.255.0" },
} satisfies ToolExample<{ prefix: number }, { netmask: string }>;

export const prefixToNetmaskTool = createSimpleTool({
  id: "network/prefix-to-netmask",
  title: "Prefix to Netmask",
  description:
    "Convert an IPv4 CIDR prefix length into a dotted-decimal netmask.",
  inputs: [
    {
      description: "Prefix length in bits, 0 to 32.",
      id: "prefix",
      kind: "integer",
      label: "Prefix",
      maximum: 32,
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Dotted-decimal netmask.",
      id: "netmask",
      kind: "string",
      label: "Netmask",
    },
  ],
  calculate: (input) => {
    const prefix = input.prefix as number;
    if (prefix === 0) return { netmask: "0.0.0.0" };
    const mask = (0xffffffff << (32 - prefix)) >>> 0;
    return {
      netmask: [
        Math.floor(mask / 16777216) % 256,
        Math.floor(mask / 65536) % 256,
        Math.floor(mask / 256) % 256,
        mask % 256,
      ].join("."),
    };
  },
});

export const runPrefixToNetmask = prefixToNetmaskTool.execute;
export default prefixToNetmaskTool;

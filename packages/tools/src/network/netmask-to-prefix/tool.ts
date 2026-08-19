import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { ToolExample } from "../../core/example.js";

const IPV4_PATTERN =
  /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/;

export const example = {
  input: { netmask: "255.255.255.0" },
  output: { prefix: 24 },
} satisfies ToolExample<{ netmask: string }, { prefix: number }>;

export const netmaskToPrefixTool = createSimpleTool({
  id: "network/netmask-to-prefix",
  title: "Netmask to Prefix",
  description:
    "Convert a dotted-decimal IPv4 netmask into its CIDR prefix length.",
  inputs: [
    {
      description: "Dotted-decimal netmask with contiguous set bits.",
      id: "netmask",
      kind: "string",
      label: "Netmask",
    },
  ],
  outputs: [
    {
      description: "Prefix length in bits, 0 to 32.",
      id: "prefix",
      kind: "integer",
      label: "Prefix",
    },
  ],
  calculate: (input) => {
    const netmask = String(input.netmask);
    if (!IPV4_PATTERN.test(netmask))
      return simpleError(
        "netmask",
        "netmask must be a valid dotted-decimal IPv4 address.",
        "address_invalid",
      );
    const octets = netmask.split(".").map(Number);
    const value =
      octets[0] * 16777216 + octets[1] * 65536 + octets[2] * 256 + octets[3];
    // A valid netmask is a run of set bits from the top; verify by adding
    // one to the low-complemented form yields a power of two.
    // A valid netmask is leading one bits only: its complement must be a
    // run of low one bits, i.e. inv & (inv + 1) === 0.
    const inverted = ~value >>> 0;
    const isContiguous = inverted === 0 || (inverted & (inverted + 1)) === 0;
    if (!isContiguous)
      return simpleError(
        "netmask",
        "netmask must have contiguous leading one bits.",
        "netmask_invalid",
      );
    let prefix = 0;
    let bits = value;
    while (bits > 0) {
      prefix += bits & 1;
      bits >>>= 1;
    }
    return { prefix };
  },
});

export const runNetmaskToPrefix = netmaskToPrefixTool.execute;
export default netmaskToPrefixTool;

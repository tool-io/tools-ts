import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { formatIpv6Full, parseIpv6 } from "../ipv6-expand/tool.js";

export type Ipv6ReverseDnsInput = { readonly ipv6: string };
export type Ipv6ReverseDnsOutput = {
  readonly expanded: string;
  readonly fqdn: string;
  readonly nibbleCount: number;
};

export const calculateIpv6ReverseDns = (
  input: Ipv6ReverseDnsInput,
): Ipv6ReverseDnsOutput => {
  const expanded = formatIpv6Full(parseIpv6(input.ipv6, "ipv6"));
  const nibbles = expanded.replaceAll(":", "").split("");
  return {
    expanded,
    fqdn: `${nibbles.reverse().join(".")}.ip6.arpa`,
    nibbleCount: 32,
  };
};

export const ipv6ReverseDnsExample = {
  input: { ipv6: "2001:db8::1" },
  output: {
    expanded: "2001:0db8:0000:0000:0000:0000:0000:0001",
    fqdn: "1.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.8.b.d.0.1.0.0.2.ip6.arpa",
    nibbleCount: 32,
  },
} satisfies ToolExample<Ipv6ReverseDnsInput, Ipv6ReverseDnsOutput>;

export const ipv6ReverseDnsTool = createSimpleTool({
  calculate: (input) => calculateIpv6ReverseDns(input as Ipv6ReverseDnsInput),
  description: "Expand an IPv6 address into its nibble-reversed ip6.arpa name.",
  id: "network/ipv6-reverse-dns",
  inputs: [{ id: "ipv6", kind: "string", label: "IPv6 address" }],
  outputs: [
    { id: "fqdn", kind: "string", label: "Reverse DNS name" },
    { id: "expanded", kind: "string", label: "Expanded address" },
    { id: "nibbleCount", kind: "integer", label: "Nibble count" },
  ],
  title: "IPv6 Reverse DNS Name Builder",
});

export const runIpv6ReverseDns = ipv6ReverseDnsTool.execute;
export default ipv6ReverseDnsTool;

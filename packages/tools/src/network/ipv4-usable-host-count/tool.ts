import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type Ipv4UsableHostCountInput = { readonly prefix: number };
export type Ipv4UsableHostCountOutput = { readonly usableHosts: number };

export const calculateIpv4UsableHostCount = (
  input: Ipv4UsableHostCountInput,
): Ipv4UsableHostCountOutput => ({
  usableHosts:
    input.prefix === 32
      ? 1
      : input.prefix === 31
        ? 2
        : 2 ** (32 - input.prefix) - 2,
});

export const ipv4UsableHostCountExample = {
  input: { prefix: 24 },
  output: { usableHosts: 254 },
} satisfies ToolExample<Ipv4UsableHostCountInput, Ipv4UsableHostCountOutput>;

export const ipv4UsableHostCountTool = createSimpleTool({
  calculate: (input) =>
    calculateIpv4UsableHostCount(input as Ipv4UsableHostCountInput),
  description:
    "Compute assignable IPv4 host addresses from a CIDR prefix, including /31 point-to-point and /32 host routes.",
  id: "network/ipv4-usable-host-count",
  inputs: [
    {
      id: "prefix",
      kind: "integer",
      label: "CIDR prefix",
      maximum: 32,
      minimum: 0,
    },
  ],
  outputs: [{ id: "usableHosts", kind: "integer", label: "Usable hosts" }],
  title: "IPv4 Usable Host Count Calculator",
});

export const runIpv4UsableHostCount = ipv4UsableHostCountTool.execute;
export default ipv4UsableHostCountTool;

import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { ToolExample } from "../../core/example.js";

export const example = {
  input: { integer: 3232235777 },
  output: { address: "192.168.1.1" },
} satisfies ToolExample<{ integer: number }, { address: string }>;

export const integerToIpv4Tool = createSimpleTool({
  id: "network/integer-to-ipv4",
  title: "Integer to IPv4",
  description:
    "Convert an unsigned 32-bit integer into dotted-decimal IPv4 form.",
  inputs: [
    {
      description: "Unsigned 32-bit integer value.",
      id: "integer",
      kind: "integer",
      label: "Integer",
      maximum: 4294967295,
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Dotted-decimal IPv4 address.",
      id: "address",
      kind: "string",
      label: "Address",
    },
  ],
  calculate: (input) => {
    const value = input.integer as number;
    if (value < 0 || value > 4294967295)
      simpleError(
        "integer",
        "integer must be between 0 and 4294967295.",
        "range_invalid",
      );
    const octets = [
      Math.floor(value / 16777216) % 256,
      Math.floor(value / 65536) % 256,
      Math.floor(value / 256) % 256,
      value % 256,
    ];
    return { address: octets.join(".") };
  },
});

export const runIntegerToIpv4 = integerToIpv4Tool.execute;
export default integerToIpv4Tool;

import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { ToolExample } from "../../core/example.js";

export const example = {
  input: { address: "192.168.1.1" },
  output: { integer: 3232235777 },
} satisfies ToolExample<{ address: string }, { integer: number }>;

const IPV4_PATTERN =
  /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/;

export const ipv4ToIntegerTool = createSimpleTool({
  id: "network/ipv4-to-integer",
  title: "IPv4 to Integer",
  description:
    "Convert a dotted-decimal IPv4 address into its 32-bit integer form.",
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
      description: "Unsigned 32-bit integer value.",
      id: "integer",
      kind: "integer",
      label: "Integer",
    },
  ],
  calculate: (input) => {
    const address = String(input.address);
    if (!IPV4_PATTERN.test(address))
      simpleError(
        "address",
        "address must be a valid dotted-decimal IPv4 address.",
        "address_invalid",
      );
    const [a = "0", b = "0", c = "0", d = "0"] = address.split(".");
    return {
      integer:
        Number(a) * 16777216 + Number(b) * 65536 + Number(c) * 256 + Number(d),
    };
  },
});

export const runIpv4ToInteger = ipv4ToIntegerTool.execute;
export default ipv4ToIntegerTool;

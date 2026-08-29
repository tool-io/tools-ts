import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const example = {
  input: { macAddress: "00:1A:2B:3C:4D:5E" },
  output: { address: "fe80::21a:2bff:fe3c:4d5e" },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;
export const tool = createSimpleTool({
  id: "network/eui64-link-local",
  title: "EUI-64 IPv6 Link-Local Address Builder",
  description:
    "Derive a modified EUI-64 IPv6 link-local address from a 48-bit MAC by inserting FF:FE and flipping the universal/local bit. Privacy-address schemes use a different method.",
  inputs: [{ id: "macAddress", kind: "string", label: "mac Address" }],
  outputs: [{ id: "address", kind: "string", label: "address" }],
  calculate: (input) => {
    const hex = (input.macAddress as string).replace(/[:-]/g, "").toLowerCase();
    if (!/^[0-9a-f]{12}$/.test(hex))
      simpleError("macAddress", "Enter six hexadecimal MAC octets.");
    const bytes = Array.from({ length: 6 }, (_, i) =>
      Number.parseInt(hex.slice(i * 2, i * 2 + 2), 16),
    );
    bytes[0] = bytes[0]! ^ 2;
    const eui = [...bytes.slice(0, 3), 255, 254, ...bytes.slice(3)];
    const words = Array.from({ length: 4 }, (_, i) =>
      ((eui[i * 2]! << 8) | eui[i * 2 + 1]!).toString(16),
    );
    return { address: "fe80::" + words.join(":") };
  },
});
export type Eui64LinkLocalInput = Readonly<typeof example.input>;
export type Eui64LinkLocalOutput = Readonly<typeof example.output>;
export const eui64LinkLocalTool = tool;
export const runEui64LinkLocal = tool.execute;
export default tool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { utf8Encode } from "../../core/encoding.js";

export const example = {
  input: { text: "123456789" },
  output: { checksum: 0x29b1, hex: "29B1" },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;
export const tool = createSimpleTool({
  id: "encode/crc16-ccitt",
  title: "CRC-16/CCITT-FALSE Calculator",
  description:
    "Compute the CRC-16/CCITT-FALSE checksum of UTF-8 text using polynomial 0x1021, initial 0xFFFF, no reflection, and no final XOR. A CRC detects accidental errors, not malicious tampering.",
  inputs: [{ id: "text", kind: "string", label: "text" }],
  outputs: [
    { id: "checksum", kind: "integer", label: "checksum" },
    { id: "hex", kind: "string", label: "hex" },
  ],
  calculate: (input) => {
    const bytes = utf8Encode(input.text as string);
    let crc = 0xffff;
    for (const byte of bytes) {
      crc ^= byte << 8;
      for (let bit = 0; bit < 8; bit += 1)
        crc =
          crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
    }
    return {
      checksum: crc,
      hex: crc.toString(16).toUpperCase().padStart(4, "0"),
    };
  },
});
export type Crc16CcittInput = Readonly<typeof example.input>;
export type Crc16CcittOutput = Readonly<typeof example.output>;
export const crc16CcittTool = tool;
export const runCrc16Ccitt = tool.execute;
export default tool;

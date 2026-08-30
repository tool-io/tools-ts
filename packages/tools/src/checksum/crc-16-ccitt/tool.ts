import { defineTool } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  checksumBytes,
  checksumInputSchema,
  checksumOutputSchema,
  checksumPorts,
  type ChecksumInput,
  type ChecksumOutput,
} from "../shared.js";

const crc16Ccitt = (bytes: readonly number[]): number => {
  let crc = 0xffff;
  for (const byte of bytes) {
    crc ^= byte << 8;
    for (let bit = 0; bit < 8; bit += 1)
      crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
  }
  return crc;
};

export const example = {
  input: { text: "123456789" },
  output: { checksum: "29B1" },
} satisfies ToolExample<ChecksumInput, ChecksumOutput>;

export const crc16CcittTool = defineTool<ChecksumInput, ChecksumOutput>({
  contractVersion: 1,
  description:
    "Calculate the CRC-16/CCITT-FALSE checksum of UTF-8 text using polynomial 0x1021 and initial value 0xFFFF.",
  discovery: {
    aliases: ["crc16", "crc-16", "crc-16 ccitt", "crc16 ccitt"],
    collections: ["encode-decode"],
    keywords: ["checksum", "crc", "integrity"],
  },
  execute: (input) => checksumBytes(input, crc16Ccitt, 4),
  execution: { kind: "pure" },
  id: "checksum/crc-16-ccitt",
  inputSchema: checksumInputSchema,
  outputSchema: checksumOutputSchema(4),
  ports: checksumPorts,
  title: "CRC-16/CCITT-FALSE Checksum",
});
export const runCrc16CcittChecksum = crc16CcittTool.execute;
export default crc16CcittTool;

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

const crcTable = (() => {
  const table = new Uint32Array(256);
  for (let index = 0; index < 256; index += 1) {
    let value = index;
    for (let bit = 0; bit < 8; bit += 1)
      value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
    table[index] = value >>> 0;
  }
  return table;
})();

const crc32 = (bytes: readonly number[]): number => {
  let crc = 0xffffffff;
  for (const byte of bytes) crc = crcTable[(crc ^ byte) & 0xff]! ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
};

export const example = {
  input: { text: "123456789" },
  output: { checksum: "CBF43926" },
} satisfies ToolExample<ChecksumInput, ChecksumOutput>;

export const crc32Tool = defineTool<ChecksumInput, ChecksumOutput>({
  contractVersion: 1,
  description:
    "Calculate the standard CRC-32/ISO-HDLC checksum of UTF-8 text with polynomial 0x04C11DB7 in reflected form.",
  discovery: {
    aliases: ["crc32", "crc-32", "crc checksum"],
    collections: ["encode-decode"],
    keywords: ["checksum", "crc", "integrity"],
  },
  execute: (input) => checksumBytes(input, crc32, 8),
  execution: { kind: "pure" },
  id: "checksum/crc-32",
  inputSchema: checksumInputSchema,
  outputSchema: checksumOutputSchema(8),
  ports: checksumPorts,
  title: "CRC-32 Checksum",
});
export const runCrc32Checksum = crc32Tool.execute;
export default crc32Tool;

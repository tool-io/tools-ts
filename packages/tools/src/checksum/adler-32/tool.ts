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

const adler32 = (bytes: readonly number[]): number => {
  let a = 1;
  let b = 0;
  for (const byte of bytes) {
    a = (a + byte) % 65521;
    b = (b + a) % 65521;
  }
  return ((b << 16) | a) >>> 0;
};

export const example = {
  input: { text: "Wikipedia" },
  output: { checksum: "11E60398" },
} satisfies ToolExample<ChecksumInput, ChecksumOutput>;

export const adler32Tool = defineTool<ChecksumInput, ChecksumOutput>({
  contractVersion: 1,
  description:
    "Calculate the Adler-32 checksum of UTF-8 text using the modulo-65521 rolling sums used by formats such as zlib.",
  discovery: {
    aliases: ["adler32", "adler checksum"],
    collections: ["encode-decode"],
    keywords: ["adler", "checksum", "integrity", "zlib"],
  },
  execute: (input) => checksumBytes(input, adler32, 8),
  execution: { kind: "pure" },
  id: "checksum/adler-32",
  inputSchema: checksumInputSchema,
  outputSchema: checksumOutputSchema(8),
  ports: checksumPorts,
  title: "Adler-32 Checksum",
});
export const runAdler32 = adler32Tool.execute;
export default adler32Tool;

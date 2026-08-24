import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type WarcCompressionRatioPercentInput = {
  readonly uncompressedBytes: number;
  readonly compressedBytes: number;
};

export type WarcCompressionRatioPercentOutput = {
  readonly compressionRatio: number;
  readonly savingsPercent: number;
};

export const calculateWarcCompressionRatioPercent = (
  input: WarcCompressionRatioPercentInput,
): WarcCompressionRatioPercentOutput => {
  if (!(input.uncompressedBytes > 0))
    return simpleError(
      "uncompressedBytes",
      "Uncompressed size must be greater than zero.",
      "invalid_uncompressed",
    );
  if (input.compressedBytes < 0)
    return simpleError(
      "compressedBytes",
      "Compressed size cannot be negative.",
      "invalid_compressed",
    );
  const compressionRatio = input.compressedBytes / input.uncompressedBytes;
  return { compressionRatio, savingsPercent: (1 - compressionRatio) * 100 };
};

export const warcCompressionRatioPercentExample = {
  input: { uncompressedBytes: 10000000000, compressedBytes: 1200000000 },
  output: { compressionRatio: 0.12, savingsPercent: 88 },
} satisfies ToolExample<
  WarcCompressionRatioPercentInput,
  WarcCompressionRatioPercentOutput
>;

export const warcCompressionRatioPercentTool = createSimpleTool({
  id: "archival-studies/warc-compression-ratio-percent",
  title: "WARC File Compression Ratio Savings Percent Calculator",
  description:
    "Compute the storage compression ratio and percent savings for a WARC web archive from its uncompressed and compressed byte sizes.",
  inputs: [
    {
      description: "Uncompressed WARC payload size in bytes.",
      id: "uncompressedBytes",
      kind: "number",
      label: "Uncompressed (bytes)",
      minimum: 0,
    },
    {
      description: "Compressed archive size in bytes.",
      id: "compressedBytes",
      kind: "number",
      label: "Compressed (bytes)",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Compressed size divided by uncompressed size.",
      id: "compressionRatio",
      kind: "number",
      label: "Compression ratio",
    },
    {
      description: "Storage savings as a percentage of the original size.",
      id: "savingsPercent",
      kind: "number",
      label: "Savings percent",
    },
  ],
  calculate: (input) =>
    calculateWarcCompressionRatioPercent({
      compressedBytes: input.compressedBytes as number,
      uncompressedBytes: input.uncompressedBytes as number,
    }),
});

export const runWarcCompressionRatioPercent =
  warcCompressionRatioPercentTool.execute;
export default warcCompressionRatioPercentTool;

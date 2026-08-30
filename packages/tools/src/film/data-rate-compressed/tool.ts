import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DataRateCompressedInput = Readonly<{
  readonly uncompressedMegabytesPerSecond: number;
  readonly compressionRatio: number;
}>;
export type DataRateCompressedOutput = Readonly<{
  readonly compressedMegabytesPerSecond: number;
}>;

export const calculateDataRateCompressed = (
  x: DataRateCompressedInput,
): DataRateCompressedOutput => {
  if (
    !Number.isFinite(x.uncompressedMegabytesPerSecond) ||
    x.uncompressedMegabytesPerSecond < 0
  )
    simpleError(
      "uncompressedMegabytesPerSecond",
      "Provide a finite number at least 0.",
    );
  if (!Number.isFinite(x.compressionRatio) || x.compressionRatio < 1)
    simpleError("compressionRatio", "Provide a finite number at least 1.");
  const compressedMegabytesPerSecond =
    x.uncompressedMegabytesPerSecond / x.compressionRatio;
  if (!Number.isFinite(compressedMegabytesPerSecond))
    simpleError(
      "compressedMegabytesPerSecond",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    compressedMegabytesPerSecond: Object.is(compressedMegabytesPerSecond, -0)
      ? 0
      : compressedMegabytesPerSecond,
  };
};

export const example = {
  input: { uncompressedMegabytesPerSecond: 100, compressionRatio: 10 },
  output: { compressedMegabytesPerSecond: 10 },
} satisfies ToolExample<DataRateCompressedInput, DataRateCompressedOutput>;

export const tool = createSimpleTool({
  id: "film/data-rate-compressed",
  title: "Data Rate Compressed",
  description:
    "Compressed decimal MB/s estimate from uncompressed data rate divided by an assumed compression ratio.",
  inputs: [
    {
      id: "uncompressedMegabytesPerSecond",
      kind: "number",
      label: "Uncompressed Megabytes Per Second",
      unit: "MB/s",
      minimum: 0,
    },
    {
      id: "compressionRatio",
      kind: "number",
      label: "Compression Ratio",
      minimum: 1,
    },
  ],
  outputs: [
    {
      id: "compressedMegabytesPerSecond",
      kind: "number",
      label: "Compressed Megabytes Per Second",
      unit: "MB/s",
    },
  ],
  calculate: (input) =>
    calculateDataRateCompressed({
      uncompressedMegabytesPerSecond:
        input.uncompressedMegabytesPerSecond as number,
      compressionRatio: input.compressionRatio as number,
    }),
});
export const dataRateCompressedTool = tool;
export const runDataRateCompressed = tool.execute;
export default tool;

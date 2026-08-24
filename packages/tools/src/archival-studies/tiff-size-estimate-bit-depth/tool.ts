import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TiffSizeEstimateBitDepthInput = {
  readonly widthPx: number;
  readonly heightPx: number;
  readonly bitsPerSample?: number;
  readonly samplesPerPixel?: number;
  readonly pages?: number;
  readonly compressionFactor?: number;
};

export type TiffSizeEstimateBitDepthOutput = {
  readonly sizeBytes: number;
  readonly sizeMiB: number;
};

export const calculateTiffSizeEstimateBitDepth = (
  input: TiffSizeEstimateBitDepthInput,
): TiffSizeEstimateBitDepthOutput => {
  const bitsPerSample = input.bitsPerSample ?? 8;
  const samplesPerPixel = input.samplesPerPixel ?? 1;
  const pages = input.pages ?? 1;
  const compressionFactor = input.compressionFactor ?? 1;
  const checked: readonly (readonly [string, number])[] = [
    ["widthPx", input.widthPx],
    ["heightPx", input.heightPx],
    ["bitsPerSample", bitsPerSample],
    ["samplesPerPixel", samplesPerPixel],
    ["pages", pages],
    ["compressionFactor", compressionFactor],
  ];
  for (const [key, value] of checked) {
    if (!(typeof value === "number" && Number.isFinite(value) && value > 0))
      simpleError(
        key,
        "Value must be a finite number greater than zero.",
        "invalid_dimension",
      );
  }
  const bytesPerPixel = (bitsPerSample * samplesPerPixel) / 8;
  const sizeBytes =
    input.widthPx * input.heightPx * bytesPerPixel * pages * compressionFactor;
  if (!Number.isFinite(sizeBytes))
    simpleError(
      "widthPx",
      "The estimated TIFF size exceeds the numeric range.",
      "overflow",
    );
  return { sizeBytes, sizeMiB: sizeBytes / 1024 ** 2 };
};

export const tiffSizeEstimateBitDepthExample = {
  input: {
    widthPx: 6000,
    heightPx: 4000,
    bitsPerSample: 16,
    samplesPerPixel: 3,
    pages: 1,
    compressionFactor: 1,
  },
  output: { sizeBytes: 144000000, sizeMiB: 137.3291015625 },
} satisfies ToolExample<
  TiffSizeEstimateBitDepthInput,
  TiffSizeEstimateBitDepthOutput
>;

export const tiffSizeEstimateBitDepthTool = createSimpleTool({
  id: "archival-studies/tiff-size-estimate-bit-depth",
  title: "TIFF File Size Estimate from Dimensions and Bit Depth",
  description:
    "Estimate TIFF storage as width × height × bits per sample × samples per pixel × pages, then multiply by an expected stored-size fraction (1 for uncompressed, 0.5 for half the uncompressed size). TIFF headers and metadata are not included.",
  inputs: [
    {
      description: "Image width in pixels.",
      id: "widthPx",
      kind: "integer",
      label: "Width px",
      minimum: 1,
    },
    {
      description: "Image height in pixels.",
      id: "heightPx",
      kind: "integer",
      label: "Height px",
      minimum: 1,
    },
    {
      default: 8,
      description: "Bits per sample per channel.",
      id: "bitsPerSample",
      kind: "integer",
      label: "Bits/sample",
      minimum: 1,
    },
    {
      default: 1,
      description: "Samples per pixel (1 grayscale, 3 RGB).",
      id: "samplesPerPixel",
      kind: "integer",
      label: "Samples/pixel",
      minimum: 1,
    },
    {
      default: 1,
      description: "Number of IFD pages in the file.",
      id: "pages",
      kind: "integer",
      label: "Pages",
      minimum: 1,
    },
    {
      default: 1,
      description:
        "Expected stored-size fraction relative to uncompressed raster data (1 = uncompressed, 0.5 = half size).",
      id: "compressionFactor",
      kind: "number",
      label: "Stored-size fraction",
      maximum: 1,
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Estimated file size in bytes.",
      id: "sizeBytes",
      kind: "number",
      label: "Bytes",
    },
    {
      description: "Estimated file size in mebibytes.",
      id: "sizeMiB",
      kind: "number",
      label: "MiB",
    },
  ],
  calculate: (input) =>
    calculateTiffSizeEstimateBitDepth({
      bitsPerSample: (input.bitsPerSample as number | undefined) ?? undefined,
      compressionFactor:
        (input.compressionFactor as number | undefined) ?? undefined,
      heightPx: input.heightPx as number,
      pages: (input.pages as number | undefined) ?? undefined,
      samplesPerPixel:
        (input.samplesPerPixel as number | undefined) ?? undefined,
      widthPx: input.widthPx as number,
    }),
});

export const runTiffSizeEstimateBitDepth = tiffSizeEstimateBitDepthTool.execute;
export default tiffSizeEstimateBitDepthTool;

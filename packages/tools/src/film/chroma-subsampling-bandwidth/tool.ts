import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ChromaSubsamplingBandwidthInput = Readonly<{
  readonly widthPixels: number;
  readonly heightPixels: number;
  readonly framesPerSecond: number;
  readonly bitsPerSample: number;
  readonly chromaFraction: number;
}>;
export type ChromaSubsamplingBandwidthOutput = Readonly<{
  readonly megabytesPerSecond: number;
}>;

export const calculateChromaSubsamplingBandwidth = (
  x: ChromaSubsamplingBandwidthInput,
): ChromaSubsamplingBandwidthOutput => {
  if (!Number.isFinite(x.widthPixels) || x.widthPixels < 1)
    simpleError("widthPixels", "Provide a finite number at least 1.");
  if (!Number.isFinite(x.heightPixels) || x.heightPixels < 1)
    simpleError("heightPixels", "Provide a finite number at least 1.");
  if (!Number.isFinite(x.framesPerSecond) || x.framesPerSecond < 0)
    simpleError("framesPerSecond", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.bitsPerSample) || x.bitsPerSample < 0)
    simpleError("bitsPerSample", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.chromaFraction) || x.chromaFraction < 0)
    simpleError("chromaFraction", "Provide a finite number at least 0.");
  if (
    x.chromaFraction > 1 ||
    !Number.isSafeInteger(x.widthPixels) ||
    !Number.isSafeInteger(x.heightPixels)
  )
    simpleError("input", "Inputs violate the stated model or operating range.");
  const megabytesPerSecond =
    (x.widthPixels *
      x.heightPixels *
      x.framesPerSecond *
      x.bitsPerSample *
      (1 + 2 * x.chromaFraction)) /
    8000000;
  if (!Number.isFinite(megabytesPerSecond))
    simpleError(
      "megabytesPerSecond",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    megabytesPerSecond: Object.is(megabytesPerSecond, -0)
      ? 0
      : megabytesPerSecond,
  };
};

export const example = {
  input: {
    widthPixels: 1920,
    heightPixels: 1080,
    framesPerSecond: 30,
    bitsPerSample: 8,
    chromaFraction: 0.25,
  },
  output: { megabytesPerSecond: 93.312 },
} satisfies ToolExample<
  ChromaSubsamplingBandwidthInput,
  ChromaSubsamplingBandwidthOutput
>;

export const tool = createSimpleTool({
  id: "film/chroma-subsampling-bandwidth",
  title: "Chroma Subsampling Bandwidth",
  description:
    "Uncompressed decimal MB/s for YCbCr with one luma sample and two chroma channels at a supplied per-channel chroma sample fraction (0.25 for 4:2:0, 0.5 for 4:2:2).",
  inputs: [
    {
      id: "widthPixels",
      kind: "integer",
      label: "Width Pixels",
      unit: "px",
      minimum: 1,
    },
    {
      id: "heightPixels",
      kind: "integer",
      label: "Height Pixels",
      unit: "px",
      minimum: 1,
    },
    {
      id: "framesPerSecond",
      kind: "number",
      label: "Frames Per Second",
      unit: "fps",
      minimum: 0,
    },
    {
      id: "bitsPerSample",
      kind: "number",
      label: "Bits Per Sample",
      unit: "bit",
      minimum: 0,
    },
    {
      id: "chromaFraction",
      kind: "number",
      label: "Chroma Fraction",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "megabytesPerSecond",
      kind: "number",
      label: "Megabytes Per Second",
      unit: "MB/s",
    },
  ],
  calculate: (input) =>
    calculateChromaSubsamplingBandwidth({
      widthPixels: input.widthPixels as number,
      heightPixels: input.heightPixels as number,
      framesPerSecond: input.framesPerSecond as number,
      bitsPerSample: input.bitsPerSample as number,
      chromaFraction: input.chromaFraction as number,
    }),
});
export const chromaSubsamplingBandwidthTool = tool;
export const runChromaSubsamplingBandwidth = tool.execute;
export default tool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type VideoPixelBandwidthInput = Readonly<{
  readonly activePixelsPerSecond: number;
  readonly bitsPerPixel: number;
}>;
export type VideoPixelBandwidthOutput = Readonly<{
  readonly bitsPerSecond: number;
}>;

export const calculateVideoPixelBandwidth = (
  x: VideoPixelBandwidthInput,
): VideoPixelBandwidthOutput => {
  if (!Number.isFinite(x.activePixelsPerSecond) || x.activePixelsPerSecond < 0)
    simpleError("activePixelsPerSecond", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.bitsPerPixel) || x.bitsPerPixel < 0)
    simpleError("bitsPerPixel", "Provide a finite number at least 0.");
  const bitsPerSecond = x.activePixelsPerSecond * x.bitsPerPixel;
  if (!Number.isFinite(bitsPerSecond))
    simpleError(
      "bitsPerSecond",
      "Inputs produce an undefined or non-finite result.",
    );
  return { bitsPerSecond: Object.is(bitsPerSecond, -0) ? 0 : bitsPerSecond };
};

export const example = {
  input: { activePixelsPerSecond: 124416000, bitsPerPixel: 24 },
  output: { bitsPerSecond: 2985984000 },
} satisfies ToolExample<VideoPixelBandwidthInput, VideoPixelBandwidthOutput>;

export const tool = createSimpleTool({
  id: "electronics/video-pixel-bandwidth",
  title: "Video Pixel Bandwidth",
  description:
    "Raw uncompressed video payload bit rate from active pixel rate and bits per pixel; excludes blanking and coding overhead.",
  inputs: [
    {
      id: "activePixelsPerSecond",
      kind: "number",
      label: "Active Pixels Per Second",
      unit: "px/s",
      minimum: 0,
    },
    {
      id: "bitsPerPixel",
      kind: "number",
      label: "Bits Per Pixel",
      unit: "bits/px",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "bitsPerSecond",
      kind: "number",
      label: "Bits Per Second",
      unit: "bit/s",
    },
  ],
  calculate: (input) =>
    calculateVideoPixelBandwidth({
      activePixelsPerSecond: input.activePixelsPerSecond as number,
      bitsPerPixel: input.bitsPerPixel as number,
    }),
});
export const videoPixelBandwidthTool = tool;
export const runVideoPixelBandwidth = tool.execute;
export default tool;

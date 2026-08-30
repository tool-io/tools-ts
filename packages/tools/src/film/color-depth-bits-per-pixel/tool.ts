import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ColorDepthBitsPerPixelInput = Readonly<{
  readonly bitsPerChannel: number;
  readonly channelCount: number;
}>;
export type ColorDepthBitsPerPixelOutput = Readonly<{
  readonly bitsPerPixel: number;
}>;

export const calculateColorDepthBitsPerPixel = (
  x: ColorDepthBitsPerPixelInput,
): ColorDepthBitsPerPixelOutput => {
  if (!Number.isFinite(x.bitsPerChannel) || x.bitsPerChannel < 1)
    simpleError("bitsPerChannel", "Provide a finite number at least 1.");
  if (!Number.isFinite(x.channelCount) || x.channelCount < 1)
    simpleError("channelCount", "Provide a finite number at least 1.");
  if (
    !Number.isSafeInteger(x.bitsPerChannel) ||
    !Number.isSafeInteger(x.channelCount)
  )
    simpleError("input", "Inputs violate the stated model or operating range.");
  const bitsPerPixel = x.bitsPerChannel * x.channelCount;
  if (!Number.isFinite(bitsPerPixel))
    simpleError(
      "bitsPerPixel",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { bitsPerPixel: Object.is(bitsPerPixel, -0) ? 0 : bitsPerPixel };
};

export const example = {
  input: { bitsPerChannel: 8, channelCount: 3 },
  output: { bitsPerPixel: 24 },
} satisfies ToolExample<
  ColorDepthBitsPerPixelInput,
  ColorDepthBitsPerPixelOutput
>;

export const tool = createSimpleTool({
  id: "film/color-depth-bits-per-pixel",
  title: "Color Depth Bits Per Pixel",
  description:
    "Nominal uncompressed bits per pixel from equal bit depth per channel times sampled channel count.",
  inputs: [
    {
      id: "bitsPerChannel",
      kind: "integer",
      label: "Bits Per Channel",
      unit: "bit",
      minimum: 1,
    },
    { id: "channelCount", kind: "integer", label: "Channel Count", minimum: 1 },
  ],
  outputs: [
    {
      id: "bitsPerPixel",
      kind: "number",
      label: "Bits Per Pixel",
      unit: "bit/px",
    },
  ],
  calculate: (input) =>
    calculateColorDepthBitsPerPixel({
      bitsPerChannel: input.bitsPerChannel as number,
      channelCount: input.channelCount as number,
    }),
});
export const colorDepthBitsPerPixelTool = tool;
export const runColorDepthBitsPerPixel = tool.execute;
export default tool;

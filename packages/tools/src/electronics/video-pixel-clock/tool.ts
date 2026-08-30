import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type VideoPixelClockInput = Readonly<{
  readonly horizontalTotalPixels: number;
  readonly verticalTotalLines: number;
  readonly refreshRateHz: number;
}>;
export type VideoPixelClockOutput = Readonly<{
  readonly pixelClockHz: number;
}>;

export const calculateVideoPixelClock = (
  x: VideoPixelClockInput,
): VideoPixelClockOutput => {
  if (
    !Number.isSafeInteger(x.horizontalTotalPixels) ||
    x.horizontalTotalPixels < 1
  )
    simpleError("horizontalTotalPixels", "Provide a safe integer at least 1.");
  if (!Number.isSafeInteger(x.verticalTotalLines) || x.verticalTotalLines < 1)
    simpleError("verticalTotalLines", "Provide a safe integer at least 1.");
  if (!Number.isFinite(x.refreshRateHz) || x.refreshRateHz < 0)
    simpleError("refreshRateHz", "Provide a finite number at least 0.");
  const pixelClockHz =
    x.horizontalTotalPixels * x.verticalTotalLines * x.refreshRateHz;
  if (!Number.isFinite(pixelClockHz))
    simpleError("pixelClockHz", "The inputs produce an invalid result.");
  return { pixelClockHz: Object.is(pixelClockHz, -0) ? 0 : pixelClockHz };
};

export const example = {
  input: {
    horizontalTotalPixels: 2200,
    verticalTotalLines: 1125,
    refreshRateHz: 60,
  },
  output: { pixelClockHz: 148500000 },
} satisfies ToolExample<VideoPixelClockInput, VideoPixelClockOutput>;

export const tool = createSimpleTool({
  id: "electronics/video-pixel-clock",
  title: "Video Pixel Clock",
  description:
    "Calculate total raster pixel clock from horizontal total pixels, vertical total lines, and frames per second, including blanking.",
  inputs: [
    {
      id: "horizontalTotalPixels",
      kind: "integer",
      label: "Horizontal total",
      unit: "pixels/line",
      minimum: 1,
    },
    {
      id: "verticalTotalLines",
      kind: "integer",
      label: "Vertical total",
      unit: "lines/frame",
      minimum: 1,
    },
    {
      id: "refreshRateHz",
      kind: "number",
      label: "Frame rate",
      unit: "Hz",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "pixelClockHz", kind: "number", label: "Pixel clock", unit: "Hz" },
  ],
  calculate: (input) =>
    calculateVideoPixelClock({
      horizontalTotalPixels: input.horizontalTotalPixels as number,
      verticalTotalLines: input.verticalTotalLines as number,
      refreshRateHz: input.refreshRateHz as number,
    }),
});
export const videoPixelClockTool = tool;
export const runVideoPixelClock = tool.execute;
export default tool;

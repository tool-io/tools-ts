import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type VideoFrameRateInput = Readonly<{
  readonly pixelClockHertz: number;
  readonly totalPixelsPerLine: number;
  readonly totalLinesPerFrame: number;
}>;
export type VideoFrameRateOutput = Readonly<{
  readonly framesPerSecond: number;
}>;

export const calculateVideoFrameRate = (
  x: VideoFrameRateInput,
): VideoFrameRateOutput => {
  if (!Number.isFinite(x.pixelClockHertz) || x.pixelClockHertz < 0)
    simpleError("pixelClockHertz", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.totalPixelsPerLine) ||
    !Number.isSafeInteger(x.totalPixelsPerLine) ||
    x.totalPixelsPerLine < 0
  )
    simpleError("totalPixelsPerLine", "Provide a safe integer at least 0.");
  if (
    !Number.isFinite(x.totalLinesPerFrame) ||
    !Number.isSafeInteger(x.totalLinesPerFrame) ||
    x.totalLinesPerFrame < 0
  )
    simpleError("totalLinesPerFrame", "Provide a safe integer at least 0.");
  if (
    !Number.isSafeInteger(x.totalPixelsPerLine) ||
    !Number.isSafeInteger(x.totalLinesPerFrame)
  )
    simpleError("input", "Inputs violate the stated model or operating range.");
  const framesPerSecond =
    x.pixelClockHertz / (x.totalPixelsPerLine * x.totalLinesPerFrame);
  if (!Number.isFinite(framesPerSecond))
    simpleError(
      "framesPerSecond",
      "Inputs produce an undefined or non-finite result.",
    );
  return {
    framesPerSecond: Object.is(framesPerSecond, -0) ? 0 : framesPerSecond,
  };
};

export const example = {
  input: {
    pixelClockHertz: 148500000,
    totalPixelsPerLine: 2200,
    totalLinesPerFrame: 1125,
  },
  output: { framesPerSecond: 60 },
} satisfies ToolExample<VideoFrameRateInput, VideoFrameRateOutput>;

export const tool = createSimpleTool({
  id: "electronics/video-frame-rate",
  title: "Video Frame Rate",
  description:
    "Frame rate from pixel clock, total pixels per line and total lines per frame, including blanking.",
  inputs: [
    {
      id: "pixelClockHertz",
      kind: "number",
      label: "Pixel Clock Hertz",
      unit: "Hz",
      minimum: 0,
    },
    {
      id: "totalPixelsPerLine",
      kind: "integer",
      label: "Total Pixels Per Line",
      unit: "px",
      minimum: 0,
    },
    {
      id: "totalLinesPerFrame",
      kind: "integer",
      label: "Total Lines Per Frame",
      unit: "lines",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "framesPerSecond",
      kind: "number",
      label: "Frames Per Second",
      unit: "Hz",
    },
  ],
  calculate: (input) =>
    calculateVideoFrameRate({
      pixelClockHertz: input.pixelClockHertz as number,
      totalPixelsPerLine: input.totalPixelsPerLine as number,
      totalLinesPerFrame: input.totalLinesPerFrame as number,
    }),
});
export const videoFrameRateTool = tool;
export const runVideoFrameRate = tool.execute;
export default tool;

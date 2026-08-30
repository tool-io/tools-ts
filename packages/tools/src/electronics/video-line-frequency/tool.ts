import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type VideoLineFrequencyInput = Readonly<{
  readonly pixelClockHertz: number;
  readonly totalPixelsPerLine: number;
}>;
export type VideoLineFrequencyOutput = Readonly<{
  readonly lineHertz: number;
}>;

export const calculateVideoLineFrequency = (
  x: VideoLineFrequencyInput,
): VideoLineFrequencyOutput => {
  if (!Number.isFinite(x.pixelClockHertz) || x.pixelClockHertz < 0)
    simpleError("pixelClockHertz", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.totalPixelsPerLine) ||
    !Number.isSafeInteger(x.totalPixelsPerLine) ||
    x.totalPixelsPerLine < 0
  )
    simpleError("totalPixelsPerLine", "Provide a safe integer at least 0.");
  if (!Number.isSafeInteger(x.totalPixelsPerLine))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const lineHertz = x.pixelClockHertz / x.totalPixelsPerLine;
  if (!Number.isFinite(lineHertz))
    simpleError(
      "lineHertz",
      "Inputs produce an undefined or non-finite result.",
    );
  return { lineHertz: Object.is(lineHertz, -0) ? 0 : lineHertz };
};

export const example = {
  input: { pixelClockHertz: 148500000, totalPixelsPerLine: 2200 },
  output: { lineHertz: 67500 },
} satisfies ToolExample<VideoLineFrequencyInput, VideoLineFrequencyOutput>;

export const tool = createSimpleTool({
  id: "electronics/video-line-frequency",
  title: "Video Line Frequency",
  description:
    "Horizontal line rate from pixel clock and total pixels per line, including horizontal blanking.",
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
  ],
  outputs: [
    { id: "lineHertz", kind: "number", label: "Line Hertz", unit: "Hz" },
  ],
  calculate: (input) =>
    calculateVideoLineFrequency({
      pixelClockHertz: input.pixelClockHertz as number,
      totalPixelsPerLine: input.totalPixelsPerLine as number,
    }),
});
export const videoLineFrequencyTool = tool;
export const runVideoLineFrequency = tool.execute;
export default tool;

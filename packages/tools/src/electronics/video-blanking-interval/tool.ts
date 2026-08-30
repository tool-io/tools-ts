import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type VideoBlankingIntervalInput = Readonly<{
  readonly horizontalTotalPixels: number;
  readonly horizontalActivePixels: number;
  readonly verticalTotalLines: number;
  readonly verticalActiveLines: number;
}>;
export type VideoBlankingIntervalOutput = Readonly<{
  readonly horizontalBlankingPixels: number;
  readonly verticalBlankingLines: number;
}>;

export const calculateVideoBlankingInterval = (
  x: VideoBlankingIntervalInput,
): VideoBlankingIntervalOutput => {
  if (
    !Number.isSafeInteger(x.horizontalTotalPixels) ||
    x.horizontalTotalPixels < 0
  )
    simpleError("horizontalTotalPixels", "Provide a safe integer at least 0.");
  if (
    !Number.isSafeInteger(x.horizontalActivePixels) ||
    x.horizontalActivePixels < 0
  )
    simpleError("horizontalActivePixels", "Provide a safe integer at least 0.");
  if (!Number.isSafeInteger(x.verticalTotalLines) || x.verticalTotalLines < 0)
    simpleError("verticalTotalLines", "Provide a safe integer at least 0.");
  if (!Number.isSafeInteger(x.verticalActiveLines) || x.verticalActiveLines < 0)
    simpleError("verticalActiveLines", "Provide a safe integer at least 0.");
  if (!(
    x.horizontalTotalPixels >= x.horizontalActivePixels &&
    x.verticalTotalLines >= x.verticalActiveLines
  ))
    simpleError("input", "Totals must be at least active counts.");
  const horizontalBlankingPixels =
    x.horizontalTotalPixels - x.horizontalActivePixels;
  if (
    !Number.isFinite(horizontalBlankingPixels) ||
    !Number.isSafeInteger(horizontalBlankingPixels)
  )
    simpleError(
      "horizontalBlankingPixels",
      "The inputs produce an invalid result.",
    );
  const verticalBlankingLines = x.verticalTotalLines - x.verticalActiveLines;
  if (
    !Number.isFinite(verticalBlankingLines) ||
    !Number.isSafeInteger(verticalBlankingLines)
  )
    simpleError(
      "verticalBlankingLines",
      "The inputs produce an invalid result.",
    );
  return {
    horizontalBlankingPixels: Object.is(horizontalBlankingPixels, -0)
      ? 0
      : horizontalBlankingPixels,
    verticalBlankingLines: Object.is(verticalBlankingLines, -0)
      ? 0
      : verticalBlankingLines,
  };
};

export const example = {
  input: {
    horizontalTotalPixels: 2200,
    horizontalActivePixels: 1920,
    verticalTotalLines: 1125,
    verticalActiveLines: 1080,
  },
  output: { horizontalBlankingPixels: 280, verticalBlankingLines: 45 },
} satisfies ToolExample<
  VideoBlankingIntervalInput,
  VideoBlankingIntervalOutput
>;

export const tool = createSimpleTool({
  id: "electronics/video-blanking-interval",
  title: "Video Blanking Interval",
  description:
    "Find horizontal and vertical blanking counts by subtracting active pixels or lines from corresponding raster totals.",
  inputs: [
    {
      id: "horizontalTotalPixels",
      kind: "integer",
      label: "Horizontal total",
      unit: "px",
      minimum: 0,
    },
    {
      id: "horizontalActivePixels",
      kind: "integer",
      label: "Horizontal active",
      unit: "px",
      minimum: 0,
    },
    {
      id: "verticalTotalLines",
      kind: "integer",
      label: "Vertical total",
      unit: "lines",
      minimum: 0,
    },
    {
      id: "verticalActiveLines",
      kind: "integer",
      label: "Vertical active",
      unit: "lines",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "horizontalBlankingPixels",
      kind: "integer",
      label: "Horizontal blanking",
      unit: "px",
    },
    {
      id: "verticalBlankingLines",
      kind: "integer",
      label: "Vertical blanking",
      unit: "lines",
    },
  ],
  calculate: (input) =>
    calculateVideoBlankingInterval({
      horizontalTotalPixels: input.horizontalTotalPixels as number,
      horizontalActivePixels: input.horizontalActivePixels as number,
      verticalTotalLines: input.verticalTotalLines as number,
      verticalActiveLines: input.verticalActiveLines as number,
    }),
});
export const videoBlankingIntervalTool = tool;
export const runVideoBlankingInterval = tool.execute;
export default tool;

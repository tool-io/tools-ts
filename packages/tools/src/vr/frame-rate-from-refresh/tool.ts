import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FrameRateFromRefreshInput = Readonly<{
  readonly refreshHertz: number;
  readonly refreshesPerRenderedFrame: number;
}>;
export type FrameRateFromRefreshOutput = Readonly<{
  readonly renderedFramesPerSecond: number;
}>;

export const calculateFrameRateFromRefresh = (
  x: FrameRateFromRefreshInput,
): FrameRateFromRefreshOutput => {
  if (!Number.isFinite(x.refreshHertz) || x.refreshHertz <= 0)
    simpleError("refreshHertz", "Provide a finite positive number.");
  if (
    !Number.isFinite(x.refreshesPerRenderedFrame) ||
    !Number.isSafeInteger(x.refreshesPerRenderedFrame) ||
    x.refreshesPerRenderedFrame < 1
  )
    simpleError(
      "refreshesPerRenderedFrame",
      "Provide a positive safe integer.",
    );
  const renderedFramesPerSecond = x.refreshHertz / x.refreshesPerRenderedFrame;
  if (!Number.isFinite(renderedFramesPerSecond))
    simpleError(
      "renderedFramesPerSecond",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    renderedFramesPerSecond: Object.is(renderedFramesPerSecond, -0)
      ? 0
      : renderedFramesPerSecond,
  };
};

export const example = {
  input: {
    refreshHertz: 90,
    refreshesPerRenderedFrame: 2,
  },
  output: { renderedFramesPerSecond: 45 },
} satisfies ToolExample<FrameRateFromRefreshInput, FrameRateFromRefreshOutput>;

export const tool = createSimpleTool({
  id: "vr/frame-rate-from-refresh",
  title: "Frame Rate From Refresh",
  description:
    "Rendered frames per second when each rendered frame is displayed for a fixed number of display refreshes.",
  inputs: [
    {
      id: "refreshHertz",
      kind: "number",
      label: "Refresh Hertz",
      unit: "Hz",
      minimum: 0,
    },
    {
      id: "refreshesPerRenderedFrame",
      kind: "integer",
      label: "Refreshes Per Rendered Frame",
      minimum: 1,
    },
  ],
  outputs: [
    {
      id: "renderedFramesPerSecond",
      kind: "number",
      label: "Rendered Frames Per Second",
      unit: "fps",
    },
  ],
  calculate: (input) =>
    calculateFrameRateFromRefresh({
      refreshHertz: input.refreshHertz as number,
      refreshesPerRenderedFrame: input.refreshesPerRenderedFrame as number,
    }),
});
export const frameRateFromRefreshTool = tool;
export const runFrameRateFromRefresh = tool.execute;
export default tool;

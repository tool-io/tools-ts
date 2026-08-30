import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SpacewarpFrameInterpolationInput = Readonly<{
  readonly displayRefreshHertz: number;
  readonly renderedFramesPerSecond: number;
}>;
export type SpacewarpFrameInterpolationOutput = Readonly<{
  readonly syntheticFramesPerSecond: number;
}>;

export const calculateSpacewarpFrameInterpolation = (
  x: SpacewarpFrameInterpolationInput,
): SpacewarpFrameInterpolationOutput => {
  if (!Number.isFinite(x.displayRefreshHertz) || x.displayRefreshHertz <= 0)
    simpleError("displayRefreshHertz", "Provide a finite positive number.");
  if (
    !Number.isFinite(x.renderedFramesPerSecond) ||
    x.renderedFramesPerSecond <= 0
  )
    simpleError("renderedFramesPerSecond", "Provide a finite positive number.");
  if (!(
    x.renderedFramesPerSecond <= x.displayRefreshHertz &&
    Number.isInteger(x.displayRefreshHertz / x.renderedFramesPerSecond)
  ))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const syntheticFramesPerSecond =
    x.displayRefreshHertz - x.renderedFramesPerSecond;
  if (!Number.isFinite(syntheticFramesPerSecond))
    simpleError(
      "syntheticFramesPerSecond",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    syntheticFramesPerSecond: Object.is(syntheticFramesPerSecond, -0)
      ? 0
      : syntheticFramesPerSecond,
  };
};

export const example = {
  input: {
    displayRefreshHertz: 90,
    renderedFramesPerSecond: 45,
  },
  output: { syntheticFramesPerSecond: 45 },
} satisfies ToolExample<
  SpacewarpFrameInterpolationInput,
  SpacewarpFrameInterpolationOutput
>;

export const tool = createSimpleTool({
  id: "vr/spacewarp-frame-interpolation",
  title: "Spacewarp Frame Interpolation",
  description:
    "Generated in-between display frames per second when render rate is below display refresh; assumes exact rate division.",
  inputs: [
    {
      id: "displayRefreshHertz",
      kind: "number",
      label: "Display Refresh Hertz",
      unit: "Hz",
      minimum: 0,
    },
    {
      id: "renderedFramesPerSecond",
      kind: "number",
      label: "Rendered Frames Per Second",
      unit: "fps",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "syntheticFramesPerSecond",
      kind: "number",
      label: "Synthetic Frames Per Second",
      unit: "fps",
    },
  ],
  calculate: (input) =>
    calculateSpacewarpFrameInterpolation({
      displayRefreshHertz: input.displayRefreshHertz as number,
      renderedFramesPerSecond: input.renderedFramesPerSecond as number,
    }),
});
export const spacewarpFrameInterpolationTool = tool;
export const runSpacewarpFrameInterpolation = tool.execute;
export default tool;

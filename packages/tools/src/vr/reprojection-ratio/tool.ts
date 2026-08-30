import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ReprojectionRatioInput = Readonly<{
  readonly reprojectedFrames: number;
  readonly displayedFrames: number;
}>;
export type ReprojectionRatioOutput = Readonly<{
  readonly reprojectionPercent: number;
}>;

export const calculateReprojectionRatio = (
  x: ReprojectionRatioInput,
): ReprojectionRatioOutput => {
  if (!Number.isFinite(x.reprojectedFrames) || x.reprojectedFrames < 0)
    simpleError("reprojectedFrames", "Provide a finite nonnegative number.");
  if (
    !Number.isFinite(x.displayedFrames) ||
    !Number.isSafeInteger(x.displayedFrames) ||
    x.displayedFrames < 1
  )
    simpleError("displayedFrames", "Provide a positive safe integer.");
  if (!(
    Number.isInteger(x.reprojectedFrames) &&
    x.reprojectedFrames <= x.displayedFrames
  ))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const reprojectionPercent = (100 * x.reprojectedFrames) / x.displayedFrames;
  if (!Number.isFinite(reprojectionPercent))
    simpleError(
      "reprojectionPercent",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    reprojectionPercent: Object.is(reprojectionPercent, -0)
      ? 0
      : reprojectionPercent,
  };
};

export const example = {
  input: {
    reprojectedFrames: 10,
    displayedFrames: 100,
  },
  output: { reprojectionPercent: 10 },
} satisfies ToolExample<ReprojectionRatioInput, ReprojectionRatioOutput>;

export const tool = createSimpleTool({
  id: "vr/reprojection-ratio",
  title: "Reprojection Ratio",
  description: "Reprojected frames as a percentage of all displayed frames.",
  inputs: [
    {
      id: "reprojectedFrames",
      kind: "number",
      label: "Reprojected Frames",
      minimum: 0,
    },
    {
      id: "displayedFrames",
      kind: "integer",
      label: "Displayed Frames",
      minimum: 1,
    },
  ],
  outputs: [
    {
      id: "reprojectionPercent",
      kind: "number",
      label: "Reprojection Percent",
      unit: "percent",
    },
  ],
  calculate: (input) =>
    calculateReprojectionRatio({
      reprojectedFrames: input.reprojectedFrames as number,
      displayedFrames: input.displayedFrames as number,
    }),
});
export const reprojectionRatioTool = tool;
export const runReprojectionRatio = tool.execute;
export default tool;

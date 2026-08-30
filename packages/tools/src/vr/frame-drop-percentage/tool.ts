import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FrameDropPercentageInput = Readonly<{
  readonly droppedFrames: number;
  readonly displayedFrames: number;
}>;
export type FrameDropPercentageOutput = Readonly<{
  readonly dropPercent: number;
}>;

export const calculateFrameDropPercentage = (
  x: FrameDropPercentageInput,
): FrameDropPercentageOutput => {
  if (!Number.isFinite(x.droppedFrames) || x.droppedFrames < 0)
    simpleError("droppedFrames", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.displayedFrames) || x.displayedFrames < 0)
    simpleError("displayedFrames", "Provide a finite nonnegative number.");
  if (!(
    Number.isInteger(x.droppedFrames) &&
    Number.isInteger(x.displayedFrames) &&
    x.droppedFrames + x.displayedFrames > 0
  ))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const dropPercent =
    (100 * x.droppedFrames) / (x.droppedFrames + x.displayedFrames);
  if (!Number.isFinite(dropPercent))
    simpleError(
      "dropPercent",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { dropPercent: Object.is(dropPercent, -0) ? 0 : dropPercent };
};

export const example = {
  input: {
    droppedFrames: 5,
    displayedFrames: 95,
  },
  output: { dropPercent: 5 },
} satisfies ToolExample<FrameDropPercentageInput, FrameDropPercentageOutput>;

export const tool = createSimpleTool({
  id: "vr/frame-drop-percentage",
  title: "Frame Drop Percentage",
  description:
    "Dropped frames as a percentage of all expected frames in the observation interval.",
  inputs: [
    {
      id: "droppedFrames",
      kind: "number",
      label: "Dropped Frames",
      minimum: 0,
    },
    {
      id: "displayedFrames",
      kind: "number",
      label: "Displayed Frames",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "dropPercent",
      kind: "number",
      label: "Drop Percent",
      unit: "percent",
    },
  ],
  calculate: (input) =>
    calculateFrameDropPercentage({
      droppedFrames: input.droppedFrames as number,
      displayedFrames: input.displayedFrames as number,
    }),
});
export const frameDropPercentageTool = tool;
export const runFrameDropPercentage = tool.execute;
export default tool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ResolutionFromPpdFovInput = Readonly<{
  readonly targetPixelsPerDegree: number;
  readonly horizontalFovDegrees: number;
}>;
export type ResolutionFromPpdFovOutput = Readonly<{
  readonly horizontalPixels: number;
}>;

export const calculateResolutionFromPpdFov = (
  x: ResolutionFromPpdFovInput,
): ResolutionFromPpdFovOutput => {
  if (!Number.isFinite(x.targetPixelsPerDegree) || x.targetPixelsPerDegree <= 0)
    simpleError("targetPixelsPerDegree", "Provide a finite positive number.");
  if (!Number.isFinite(x.horizontalFovDegrees) || x.horizontalFovDegrees <= 0)
    simpleError("horizontalFovDegrees", "Provide a finite positive number.");
  if (!(
    x.horizontalFovDegrees < 180 &&
    Number.isSafeInteger(
      Math.ceil(x.targetPixelsPerDegree * x.horizontalFovDegrees),
    )
  ))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const horizontalPixels = Math.ceil(
    x.targetPixelsPerDegree * x.horizontalFovDegrees,
  );
  if (!Number.isFinite(horizontalPixels))
    simpleError(
      "horizontalPixels",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    horizontalPixels: Object.is(horizontalPixels, -0) ? 0 : horizontalPixels,
  };
};

export const example = {
  input: {
    targetPixelsPerDegree: 20,
    horizontalFovDegrees: 90,
  },
  output: { horizontalPixels: 1800 },
} satisfies ToolExample<ResolutionFromPpdFovInput, ResolutionFromPpdFovOutput>;

export const tool = createSimpleTool({
  id: "vr/resolution-from-ppd-fov",
  title: "Resolution From Ppd Fov",
  description:
    "Minimum integer horizontal pixel count for a target nominal pixels-per-degree and horizontal field of view.",
  inputs: [
    {
      id: "targetPixelsPerDegree",
      kind: "number",
      label: "Target Pixels Per Degree",
      unit: "px/deg",
      minimum: 0,
    },
    {
      id: "horizontalFovDegrees",
      kind: "number",
      label: "Horizontal Fov Degrees",
      unit: "deg",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "horizontalPixels",
      kind: "number",
      label: "Horizontal Pixels",
      unit: "px",
    },
  ],
  calculate: (input) =>
    calculateResolutionFromPpdFov({
      targetPixelsPerDegree: input.targetPixelsPerDegree as number,
      horizontalFovDegrees: input.horizontalFovDegrees as number,
    }),
});
export const resolutionFromPpdFovTool = tool;
export const runResolutionFromPpdFov = tool.execute;
export default tool;

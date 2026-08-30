import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ReprojectionErrorPixelsInput = Readonly<{
  readonly angularErrorDegrees: number;
  readonly pixelsPerDegree: number;
}>;
export type ReprojectionErrorPixelsOutput = Readonly<{
  readonly errorPixels: number;
}>;

export const calculateReprojectionErrorPixels = (
  x: ReprojectionErrorPixelsInput,
): ReprojectionErrorPixelsOutput => {
  if (!Number.isFinite(x.angularErrorDegrees))
    simpleError("angularErrorDegrees", "Provide a finite number.");
  if (!Number.isFinite(x.pixelsPerDegree) || x.pixelsPerDegree <= 0)
    simpleError("pixelsPerDegree", "Provide a finite positive number.");
  const errorPixels = x.angularErrorDegrees * x.pixelsPerDegree;
  if (!Number.isFinite(errorPixels))
    simpleError(
      "errorPixels",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { errorPixels: Object.is(errorPixels, -0) ? 0 : errorPixels };
};

export const example = {
  input: {
    angularErrorDegrees: 0.5,
    pixelsPerDegree: 20,
  },
  output: { errorPixels: 10 },
} satisfies ToolExample<
  ReprojectionErrorPixelsInput,
  ReprojectionErrorPixelsOutput
>;

export const tool = createSimpleTool({
  id: "vr/reprojection-error-pixels",
  title: "Reprojection Error Pixels",
  description:
    "Approximate horizontal reprojection error in pixels from signed angular error and nominal pixels per degree.",
  inputs: [
    {
      id: "angularErrorDegrees",
      kind: "number",
      label: "Angular Error Degrees",
      unit: "deg",
    },
    {
      id: "pixelsPerDegree",
      kind: "number",
      label: "Pixels Per Degree",
      unit: "px/deg",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "errorPixels", kind: "number", label: "Error Pixels", unit: "px" },
  ],
  calculate: (input) =>
    calculateReprojectionErrorPixels({
      angularErrorDegrees: input.angularErrorDegrees as number,
      pixelsPerDegree: input.pixelsPerDegree as number,
    }),
});
export const reprojectionErrorPixelsTool = tool;
export const runReprojectionErrorPixels = tool.execute;
export default tool;

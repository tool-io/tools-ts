import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DisplayPixelsPerDegreeInput = Readonly<{
  readonly horizontalPixels: number;
  readonly horizontalFovDegrees: number;
}>;
export type DisplayPixelsPerDegreeOutput = Readonly<{
  readonly pixelsPerDegree: number;
}>;

export const calculateDisplayPixelsPerDegree = (
  x: DisplayPixelsPerDegreeInput,
): DisplayPixelsPerDegreeOutput => {
  if (
    !Number.isFinite(x.horizontalPixels) ||
    !Number.isSafeInteger(x.horizontalPixels) ||
    x.horizontalPixels < 1
  )
    simpleError("horizontalPixels", "Provide a positive safe integer.");
  if (!Number.isFinite(x.horizontalFovDegrees) || x.horizontalFovDegrees <= 0)
    simpleError("horizontalFovDegrees", "Provide a finite positive number.");
  if (!(x.horizontalFovDegrees < 180))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const pixelsPerDegree = x.horizontalPixels / x.horizontalFovDegrees;
  if (!Number.isFinite(pixelsPerDegree))
    simpleError(
      "pixelsPerDegree",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    pixelsPerDegree: Object.is(pixelsPerDegree, -0) ? 0 : pixelsPerDegree,
  };
};

export const example = {
  input: {
    horizontalPixels: 1800,
    horizontalFovDegrees: 90,
  },
  output: { pixelsPerDegree: 20 },
} satisfies ToolExample<
  DisplayPixelsPerDegreeInput,
  DisplayPixelsPerDegreeOutput
>;

export const tool = createSimpleTool({
  id: "vr/display-pixels-per-degree",
  title: "Display Pixels Per Degree",
  description:
    "Nominal horizontal panel pixels per optical degree for one eye; ignores lens distortion and usable-pixel losses.",
  inputs: [
    {
      id: "horizontalPixels",
      kind: "integer",
      label: "Horizontal Pixels",
      unit: "px",
      minimum: 1,
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
      id: "pixelsPerDegree",
      kind: "number",
      label: "Pixels Per Degree",
      unit: "px/deg",
    },
  ],
  calculate: (input) =>
    calculateDisplayPixelsPerDegree({
      horizontalPixels: input.horizontalPixels as number,
      horizontalFovDegrees: input.horizontalFovDegrees as number,
    }),
});
export const displayPixelsPerDegreeTool = tool;
export const runDisplayPixelsPerDegree = tool.execute;
export default tool;

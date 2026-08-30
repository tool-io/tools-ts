import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PointsToPixels96dpiInput = Readonly<{
  readonly points: number;
}>;
export type PointsToPixels96dpiOutput = Readonly<{
  readonly pixels: number;
}>;

export const calculatePointsToPixels96dpi = (
  x: PointsToPixels96dpiInput,
): PointsToPixels96dpiOutput => {
  if (!Number.isFinite(x.points) || x.points < 0)
    simpleError("points", "Provide a finite nonnegative number.");
  const pixels = (x.points * 96) / 72;
  if (!Number.isFinite(pixels))
    simpleError(
      "pixels",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { pixels: Object.is(pixels, -0) ? 0 : pixels };
};

export const example = {
  input: {
    points: 12,
  },
  output: { pixels: 16 },
} satisfies ToolExample<PointsToPixels96dpiInput, PointsToPixels96dpiOutput>;

export const tool = createSimpleTool({
  id: "typography/points-to-pixels-96dpi",
  title: "Points To Pixels 96dpi",
  description: "CSS pixels from CSS points using 96 px and 72 pt per CSS inch.",
  inputs: [
    { id: "points", kind: "number", label: "Points", unit: "pt", minimum: 0 },
  ],
  outputs: [{ id: "pixels", kind: "number", label: "Pixels", unit: "px" }],
  calculate: (input) =>
    calculatePointsToPixels96dpi({
      points: input.points as number,
    }),
});
export const pointsToPixels96dpiTool = tool;
export const runPointsToPixels96dpi = tool.execute;
export default tool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PixelsToPoints96dpiInput = Readonly<{
  readonly pixels: number;
}>;
export type PixelsToPoints96dpiOutput = Readonly<{
  readonly points: number;
}>;

export const calculatePixelsToPoints96dpi = (
  x: PixelsToPoints96dpiInput,
): PixelsToPoints96dpiOutput => {
  if (!Number.isFinite(x.pixels) || x.pixels < 0)
    simpleError("pixels", "Provide a finite nonnegative number.");
  const points = (x.pixels * 72) / 96;
  if (!Number.isFinite(points))
    simpleError(
      "points",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { points: Object.is(points, -0) ? 0 : points };
};

export const example = {
  input: {
    pixels: 16,
  },
  output: { points: 12 },
} satisfies ToolExample<PixelsToPoints96dpiInput, PixelsToPoints96dpiOutput>;

export const tool = createSimpleTool({
  id: "typography/pixels-to-points-96dpi",
  title: "Pixels To Points 96dpi",
  description: "CSS points from CSS pixels using 96 px and 72 pt per CSS inch.",
  inputs: [
    { id: "pixels", kind: "number", label: "Pixels", unit: "px", minimum: 0 },
  ],
  outputs: [{ id: "points", kind: "number", label: "Points", unit: "pt" }],
  calculate: (input) =>
    calculatePixelsToPoints96dpi({
      pixels: input.pixels as number,
    }),
});
export const pixelsToPoints96dpiTool = tool;
export const runPixelsToPoints96dpi = tool.execute;
export default tool;

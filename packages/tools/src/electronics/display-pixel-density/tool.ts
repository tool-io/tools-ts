import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DisplayPixelDensityInput = Readonly<{
  readonly horizontalPixels: number;
  readonly verticalPixels: number;
  readonly diagonalInches: number;
}>;
export type DisplayPixelDensityOutput = Readonly<{
  readonly pixelsPerInch: number;
}>;

export const calculateDisplayPixelDensity = (
  x: DisplayPixelDensityInput,
): DisplayPixelDensityOutput => {
  if (!Number.isSafeInteger(x.horizontalPixels) || x.horizontalPixels < 1)
    simpleError("horizontalPixels", "Provide a safe integer at least 1.");
  if (!Number.isSafeInteger(x.verticalPixels) || x.verticalPixels < 1)
    simpleError("verticalPixels", "Provide a safe integer at least 1.");
  if (!Number.isFinite(x.diagonalInches) || x.diagonalInches < 0)
    simpleError("diagonalInches", "Provide a finite number at least 0.");
  if (!(x.diagonalInches > 0))
    simpleError("diagonalInches", "Diagonal size must be positive.");
  const pixelsPerInch =
    Math.hypot(x.horizontalPixels, x.verticalPixels) / x.diagonalInches;
  if (!Number.isFinite(pixelsPerInch))
    simpleError("pixelsPerInch", "The inputs produce an invalid result.");
  return { pixelsPerInch: Object.is(pixelsPerInch, -0) ? 0 : pixelsPerInch };
};

export const example = {
  input: { horizontalPixels: 1920, verticalPixels: 1080, diagonalInches: 24 },
  output: { pixelsPerInch: 91.7877987534291 },
} satisfies ToolExample<DisplayPixelDensityInput, DisplayPixelDensityOutput>;

export const tool = createSimpleTool({
  id: "electronics/display-pixel-density",
  title: "Display Pixel Density",
  description:
    "Calculate diagonal pixels per inch from horizontal and vertical pixel counts and visible diagonal size.",
  inputs: [
    {
      id: "horizontalPixels",
      kind: "integer",
      label: "Horizontal pixels",
      unit: "px",
      minimum: 1,
    },
    {
      id: "verticalPixels",
      kind: "integer",
      label: "Vertical pixels",
      unit: "px",
      minimum: 1,
    },
    {
      id: "diagonalInches",
      kind: "number",
      label: "Visible diagonal",
      unit: "in",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "pixelsPerInch",
      kind: "number",
      label: "Pixel density",
      unit: "ppi",
    },
  ],
  calculate: (input) =>
    calculateDisplayPixelDensity({
      horizontalPixels: input.horizontalPixels as number,
      verticalPixels: input.verticalPixels as number,
      diagonalInches: input.diagonalInches as number,
    }),
});
export const displayPixelDensityTool = tool;
export const runDisplayPixelDensity = tool.execute;
export default tool;

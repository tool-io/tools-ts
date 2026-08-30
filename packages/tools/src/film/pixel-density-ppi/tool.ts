import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PixelDensityPpiInput = Readonly<{
  readonly pixelsAcross: number;
  readonly dimensionInches: number;
}>;
export type PixelDensityPpiOutput = Readonly<{
  readonly pixelsPerInch: number;
}>;

export const calculatePixelDensityPpi = (
  x: PixelDensityPpiInput,
): PixelDensityPpiOutput => {
  if (!Number.isFinite(x.pixelsAcross) || x.pixelsAcross < 1)
    simpleError("pixelsAcross", "Provide a finite number at least 1.");
  if (!Number.isFinite(x.dimensionInches) || x.dimensionInches < 0)
    simpleError("dimensionInches", "Provide a finite number at least 0.");
  const pixelsPerInch = x.pixelsAcross / x.dimensionInches;
  if (!Number.isFinite(pixelsPerInch))
    simpleError(
      "pixelsPerInch",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { pixelsPerInch: Object.is(pixelsPerInch, -0) ? 0 : pixelsPerInch };
};

export const example = {
  input: { pixelsAcross: 1920, dimensionInches: 13 },
  output: { pixelsPerInch: 147.69230769230768 },
} satisfies ToolExample<PixelDensityPpiInput, PixelDensityPpiOutput>;

export const tool = createSimpleTool({
  id: "film/pixel-density-ppi",
  title: "Pixel Density PPI",
  description:
    "Pixel density from pixel count across a display dimension divided by that dimension in inches.",
  inputs: [
    {
      id: "pixelsAcross",
      kind: "number",
      label: "Pixels Across",
      unit: "px",
      minimum: 1,
    },
    {
      id: "dimensionInches",
      kind: "number",
      label: "Dimension Inches",
      unit: "in",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "pixelsPerInch",
      kind: "number",
      label: "Pixels Per Inch",
      unit: "ppi",
    },
  ],
  calculate: (input) =>
    calculatePixelDensityPpi({
      pixelsAcross: input.pixelsAcross as number,
      dimensionInches: input.dimensionInches as number,
    }),
});
export const pixelDensityPpiTool = tool;
export const runPixelDensityPpi = tool.execute;
export default tool;

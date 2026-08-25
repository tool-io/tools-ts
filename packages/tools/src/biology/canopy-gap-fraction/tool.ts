import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CanopyGapFractionInput = {
  readonly gapPixels: number;
  readonly totalPixels: number;
};

export type CanopyGapFractionOutput = {
  readonly gapFractionPercent: number;
};

export const canopyGapFractionExample = {
  input: { gapPixels: 2500, totalPixels: 10000 },
  output: { gapFractionPercent: 25 },
} satisfies ToolExample<CanopyGapFractionInput, CanopyGapFractionOutput>;

export const canopyGapFractionTool = createSimpleTool({
  id: "biology/canopy-gap-fraction",
  title: "Gap Fraction %",
  description:
    "Compute canopy gap fraction as a percentage of sky-visible pixels over total hemispherical image pixels.",
  inputs: [
    {
      id: "gapPixels",
      kind: "integer",
      label: "Gap pixels",
      minimum: 0,
      unit: "pixels",
    },
    {
      id: "totalPixels",
      kind: "integer",
      label: "Total pixels",
      minimum: 1,
      unit: "pixels",
    },
  ],
  outputs: [
    {
      id: "gapFractionPercent",
      kind: "number",
      label: "Gap fraction",
      unit: "%",
    },
  ],
  calculate: (input) => {
    const gapPixels = input.gapPixels as number;
    const totalPixels = input.totalPixels as number;
    if (gapPixels > totalPixels)
      simpleError(
        "gapPixels",
        "The gap pixel count cannot exceed the total pixel count.",
        "invalid_counts",
      );
    return {
      gapFractionPercent: (gapPixels / totalPixels) * 100,
    };
  },
});
export const runCanopyGapFraction = canopyGapFractionTool.execute;
export default canopyGapFractionTool;

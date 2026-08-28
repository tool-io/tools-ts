import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ChromatographyTailingFactorInput = {
  readonly frontHalfWidthMin: number;
  readonly totalWidthAt5PercentMin: number;
};

export type ChromatographyTailingFactorOutput = {
  readonly tailingFactor: number;
};

export const chromatographyTailingFactorExample = {
  input: { totalWidthAt5PercentMin: 2, frontHalfWidthMin: 0.8 },
  output: { tailingFactor: 1.25 },
} satisfies ToolExample<
  ChromatographyTailingFactorInput,
  ChromatographyTailingFactorOutput
>;

export const chromatographyTailingFactorTool = createSimpleTool({
  id: "chemistry/chromatography-tailing-factor",
  title: "USP Tailing Factor",
  description:
    "Compute the USP tailing factor as the total peak width at five percent height divided by twice the front half width.",
  inputs: [
    {
      id: "totalWidthAt5PercentMin",
      label: "Total width at 5% height",
      kind: "number",
      unit: "min",
    },
    {
      id: "frontHalfWidthMin",
      label: "Front half width",
      kind: "number",
      unit: "min",
    },
  ],
  outputs: [{ id: "tailingFactor", label: "Tailing factor", kind: "number" }],
  calculate: (input) => {
    const totalWidthAt5PercentMin = input.totalWidthAt5PercentMin as number;
    const frontHalfWidthMin = input.frontHalfWidthMin as number;
    if (!(totalWidthAt5PercentMin > 0))
      simpleError(
        "totalWidthAt5PercentMin",
        "Total width must be positive.",
        "invalid_widths",
      );
    if (!(frontHalfWidthMin > 0))
      simpleError(
        "frontHalfWidthMin",
        "Front half width must be positive.",
        "invalid_widths",
      );
    return {
      tailingFactor: totalWidthAt5PercentMin / (2 * frontHalfWidthMin),
    };
  },
});
export const runChromatographyTailingFactor =
  chromatographyTailingFactorTool.execute;
export default chromatographyTailingFactorTool;

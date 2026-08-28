import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ChromatographyPeakAsymmetryInput = {
  readonly frontHalfWidthMin: number;
  readonly tailHalfWidthMin: number;
};

export type ChromatographyPeakAsymmetryOutput = {
  readonly asymmetryFactor: number;
};

export const chromatographyPeakAsymmetryExample = {
  input: { tailHalfWidthMin: 1.2, frontHalfWidthMin: 0.6 },
  output: { asymmetryFactor: 2 },
} satisfies ToolExample<
  ChromatographyPeakAsymmetryInput,
  ChromatographyPeakAsymmetryOutput
>;

export const chromatographyPeakAsymmetryTool = createSimpleTool({
  id: "chemistry/chromatography-peak-asymmetry",
  title: "Peak Asymmetry Factor",
  description:
    "Compute the peak asymmetry factor as the tail half width divided by the front half width measured at ten percent peak height.",
  inputs: [
    {
      id: "tailHalfWidthMin",
      label: "Tail half width",
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
  outputs: [
    { id: "asymmetryFactor", label: "Asymmetry factor", kind: "number" },
  ],
  calculate: (input) => {
    const tailHalfWidthMin = input.tailHalfWidthMin as number;
    const frontHalfWidthMin = input.frontHalfWidthMin as number;
    if (!(tailHalfWidthMin > 0))
      simpleError(
        "tailHalfWidthMin",
        "Tail half width must be positive.",
        "invalid_widths",
      );
    if (!(frontHalfWidthMin > 0))
      simpleError(
        "frontHalfWidthMin",
        "Front half width must be positive.",
        "invalid_widths",
      );
    return { asymmetryFactor: tailHalfWidthMin / frontHalfWidthMin };
  },
});
export const runChromatographyPeakAsymmetry =
  chromatographyPeakAsymmetryTool.execute;
export default chromatographyPeakAsymmetryTool;

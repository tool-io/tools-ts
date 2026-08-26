import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type VeneerJointGapInput = {
  readonly shrinkagePercent?: number;
  readonly veneerSheetWidthMm: number;
};

export type VeneerJointGapOutput = {
  readonly gapMillimeters: number;
};

export const veneerJointGapExample = {
  input: { shrinkagePercent: 0.5, veneerSheetWidthMm: 600 },
  output: { gapMillimeters: 3 },
} satisfies ToolExample<VeneerJointGapInput, VeneerJointGapOutput>;

export const veneerJointGapTool = createSimpleTool({
  id: "carpentry/furnier-fugenbreite",
  title: "Veneer Joint Gap Calculator",
  description:
    "Calculate the joint gap between veneer sheets from sheet width and percentual shrinkage.",
  inputs: [
    {
      id: "veneerSheetWidthMm",
      kind: "number",
      label: "Veneer sheet width",
      unit: "mm",
    },
    {
      default: 0.5,
      description: "Percentual width shrinkage of the veneer sheet.",
      id: "shrinkagePercent",
      kind: "number",
      label: "Shrinkage",
      maximum: 5,
      minimum: 0,
      unit: "%",
    },
  ],
  outputs: [
    { id: "gapMillimeters", kind: "number", label: "Joint gap", unit: "mm" },
  ],
  calculate: (input) => {
    const veneerSheetWidthMm = input.veneerSheetWidthMm as number;
    const shrinkagePercent = input.shrinkagePercent as number;
    if (!(veneerSheetWidthMm > 0))
      simpleError(
        "veneerSheetWidthMm",
        "Veneer sheet width must be greater than zero.",
        "invalid_veneer_width",
      );
    return {
      gapMillimeters: (veneerSheetWidthMm * shrinkagePercent) / 100,
    };
  },
});
export const runVeneerJointGap = veneerJointGapTool.execute;
export default veneerJointGapTool;

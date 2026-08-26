import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const thicknessPlanerFinalSizeExample = {
  input: { passCount: 3, perPassMillimeters: 2, rawThicknessMm: 30 },
  output: { finalThicknessMm: 24 },
} satisfies ToolExample<
  {
    readonly passCount: number;
    readonly perPassMillimeters: number;
    readonly rawThicknessMm: number;
  },
  { readonly finalThicknessMm: number }
>;

export const thicknessPlanerFinalSizeTool = createSimpleTool({
  id: "carpentry/dickenhobel-mass-endmass",
  title: "Thickness Planer Final Size Calculator",
  description:
    "Compute the final board thickness after a planned number of planing passes.",
  inputs: [
    {
      description: "Raw board thickness in millimeters.",
      id: "rawThicknessMm",
      kind: "number",
      label: "Raw thickness",
      unit: "mm",
    },
    {
      description: "Number of planing passes.",
      id: "passCount",
      kind: "integer",
      label: "Pass count",
      minimum: 1,
    },
    {
      description: "Thickness removed per pass in millimeters.",
      id: "perPassMillimeters",
      kind: "number",
      label: "Removal per pass",
      unit: "mm",
    },
  ],
  outputs: [
    {
      description: "Final board thickness in millimeters.",
      id: "finalThicknessMm",
      kind: "number",
      label: "Final thickness",
      unit: "mm",
    },
  ],
  calculate: (input) => {
    const rawThicknessMm = input.rawThicknessMm as number;
    const passCount = input.passCount as number;
    const perPassMillimeters = input.perPassMillimeters as number;
    if (rawThicknessMm <= 0)
      simpleError(
        "rawThicknessMm",
        "Raw thickness must be positive.",
        "must_be_positive",
      );
    if (perPassMillimeters <= 0)
      simpleError(
        "perPassMillimeters",
        "Material removal per pass must be positive.",
        "must_be_positive",
      );
    const finalThicknessMm = rawThicknessMm - passCount * perPassMillimeters;
    if (finalThicknessMm < 0)
      simpleError(
        "passCount",
        "removes more than raw thickness",
        "negative_thickness",
      );
    return { finalThicknessMm };
  },
});
export const runThicknessPlanerFinalSize = thicknessPlanerFinalSizeTool.execute;
export default thicknessPlanerFinalSizeTool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const lowryProteinConcExample = {
  input: { absorbance750: 0.75, calibrationSlope: 0.01, intercept: 0.05 },
} satisfies ToolExample<{
  readonly absorbance750: number;
  readonly calibrationSlope: number;
  readonly intercept: number;
}>;

export const lowryProteinConcTool = createSimpleTool({
  id: "biology/lowry-protein-conc",
  title: "Lowry Protein Conc",
  description:
    "Convert a Lowry assay A750 reading into protein concentration by subtracting the blank intercept and dividing by the standard curve slope.",
  inputs: [
    {
      id: "absorbance750",
      label: "Absorbance A750",
      kind: "number",
      minimum: 0,
    },
    { id: "intercept", label: "Calibration intercept", kind: "number" },
    { id: "calibrationSlope", label: "Calibration slope", kind: "number" },
  ],
  outputs: [
    {
      id: "proteinUgPerMl",
      label: "Protein concentration",
      kind: "number",
      unit: "µg/mL",
    },
  ],
  calculate: (input) => {
    const calibrationSlope = input.calibrationSlope as number;
    const intercept = input.intercept as number;
    if (!Number.isFinite(intercept))
      simpleError("intercept", "Intercept must be finite.", "invalid_value");
    if (calibrationSlope <= 0)
      simpleError(
        "calibrationSlope",
        "Calibration slope must be greater than zero.",
        "invalid_value",
      );
    if ((input.absorbance750 as number) < intercept)
      simpleError(
        "absorbance750",
        "Absorbance must not be below the calibration blank intercept.",
        "below_calibration_range",
      );
    return {
      proteinUgPerMl:
        ((input.absorbance750 as number) - intercept) / calibrationSlope,
    };
  },
});
export const runLowryProteinConc = lowryProteinConcTool.execute;
export default lowryProteinConcTool;

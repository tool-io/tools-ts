import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CalibrationSlopeInput = {
  readonly responseHigh: number;
  readonly responseLow: number;
  readonly concentrationHigh: number;
  readonly concentrationLow: number;
};

export type CalibrationSlopeOutput = {
  readonly calibrationSlope: number;
};

export const calibrationSlopeExample = {
  input: {
    responseHigh: 0.9,
    responseLow: 0.1,
    concentrationHigh: 10,
    concentrationLow: 0,
  },
  output: { calibrationSlope: 0.08 },
} satisfies ToolExample<CalibrationSlopeInput, CalibrationSlopeOutput>;

export const calibrationSlopeTool = createSimpleTool({
  id: "chemistry/analytical-calibration-slope",
  title: "Calibration Slope",
  description:
    "Compute the calibration curve slope from two concentration and response pairs.",
  inputs: [
    { id: "responseHigh", label: "Response high", kind: "number" },
    { id: "responseLow", label: "Response low", kind: "number" },
    {
      id: "concentrationHigh",
      label: "Concentration high",
      kind: "number",
      unit: "mol/L",
    },
    {
      id: "concentrationLow",
      label: "Concentration low",
      kind: "number",
      unit: "mol/L",
    },
  ],
  outputs: [
    { id: "calibrationSlope", label: "Calibration slope", kind: "number" },
  ],
  calculate: (input) => {
    const concentrationHigh = input.concentrationHigh as number;
    const concentrationLow = input.concentrationLow as number;
    if (!(concentrationHigh > concentrationLow && concentrationLow >= 0))
      simpleError(
        "concentrationHigh",
        "Concentrations must satisfy high > low >= 0.",
        "invalid_concentrations",
      );
    return {
      calibrationSlope:
        ((input.responseHigh as number) - (input.responseLow as number)) /
        (concentrationHigh - concentrationLow),
    };
  },
});
export const runCalibrationSlope = calibrationSlopeTool.execute;
export default calibrationSlopeTool;

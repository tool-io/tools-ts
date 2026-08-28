import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CalibrationInterceptInput = {
  readonly responseLow: number;
  readonly concentrationLow: number;
  readonly slope: number;
};

export type CalibrationInterceptOutput = {
  readonly calibrationIntercept: number;
};

export const calibrationInterceptExample = {
  input: { responseLow: 0.2, concentrationLow: 2.5, slope: 0.08 },
  output: { calibrationIntercept: 0 },
} satisfies ToolExample<CalibrationInterceptInput, CalibrationInterceptOutput>;

export const calibrationInterceptTool = createSimpleTool({
  id: "chemistry/analytical-calibration-intercept",
  title: "Calibration Intercept",
  description:
    "Compute the calibration curve intercept from the low calibration point and the slope.",
  inputs: [
    { id: "responseLow", label: "Response low", kind: "number" },
    {
      id: "concentrationLow",
      label: "Concentration low",
      kind: "number",
      unit: "mol/L",
    },
    { id: "slope", label: "Slope", kind: "number" },
  ],
  outputs: [
    {
      id: "calibrationIntercept",
      label: "Calibration intercept",
      kind: "number",
    },
  ],
  calculate: (input) => ({
    calibrationIntercept:
      (input.responseLow as number) -
      (input.slope as number) * (input.concentrationLow as number),
  }),
});
export const runCalibrationIntercept = calibrationInterceptTool.execute;
export default calibrationInterceptTool;

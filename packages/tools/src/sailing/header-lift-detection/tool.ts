import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type HeaderLiftDetectionInput = {
  readonly currentTwaDeg: number;
  readonly baselineTwaDeg: number;
};

export type HeaderLiftDetectionOutput = {
  readonly isLifted: boolean;
  readonly shiftDegrees: number;
};

export const headerLiftDetectionExample = {
  input: { currentTwaDeg: 50, baselineTwaDeg: 43 },
  output: { isLifted: false, shiftDegrees: 7 },
} satisfies ToolExample<HeaderLiftDetectionInput, HeaderLiftDetectionOutput>;

export const calculateHeaderLiftDetection = (
  input: HeaderLiftDetectionInput,
): HeaderLiftDetectionOutput => {
  const shiftDegrees = input.currentTwaDeg - input.baselineTwaDeg;
  return { isLifted: shiftDegrees < 0, shiftDegrees };
};

export const headerLiftDetectionTool = createSimpleTool({
  id: "sailing/header-lift-detection",
  title: "Header Lift Detector",
  description:
    "Classify an upwind wind change as a header or a lift by comparing the current true wind angle with a baseline.",
  inputs: [
    {
      description: "Current upwind true wind angle.",
      id: "currentTwaDeg",
      kind: "number",
      label: "Current TWA",
      maximum: 90,
      minimum: 20,
      unit: "\u00B0",
    },
    {
      description: "Baseline upwind true wind angle.",
      id: "baselineTwaDeg",
      kind: "number",
      label: "Baseline TWA",
      maximum: 90,
      minimum: 20,
      unit: "\u00B0",
    },
  ],
  outputs: [
    {
      description:
        "True when the current true-wind angle is smaller, allowing the boat to point closer to the wind on the same tack.",
      format: "flag",
      id: "isLifted",
      kind: "boolean",
      label: "Is lifted",
    },
    {
      description: "Signed angle change from the baseline.",
      format: "angle-deg",
      id: "shiftDegrees",
      kind: "number",
      label: "Shift",
      unit: "\u00B0",
    },
  ],
  calculate: (input) =>
    calculateHeaderLiftDetection(input as unknown as HeaderLiftDetectionInput),
});

export const runHeaderLiftDetection = headerLiftDetectionTool.execute;
export default headerLiftDetectionTool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type CenterOfGravityInput = {
  readonly totalMomentLbIn: number;
  readonly totalWeightLb: number;
};

export type CenterOfGravityOutput = {
  readonly cgInches: number;
};

export const centerOfGravityExample = {
  input: { totalMomentLbIn: 80000, totalWeightLb: 2000 },
  output: { cgInches: 40 },
} satisfies ToolExample<CenterOfGravityInput, CenterOfGravityOutput>;

export const calculateCenterOfGravity = (
  input: CenterOfGravityInput,
): CenterOfGravityOutput => {
  if (input.totalWeightLb <= 0)
    simpleError(
      "totalWeightLb",
      "The total weight must be positive.",
      "invalid_weight",
    );
  return {
    cgInches: roundStatistic(input.totalMomentLbIn / input.totalWeightLb),
  };
};

export const centerOfGravityTool = createSimpleTool({
  calculate: (input) =>
    calculateCenterOfGravity(input as unknown as CenterOfGravityInput),
  description:
    "Locate the aircraft center of gravity by dividing total moment by total weight.",
  id: "aviation/center-of-gravity",
  inputs: [
    {
      description: "Sum of all load moments.",
      id: "totalMomentLbIn",
      kind: "number",
      label: "Total moment",
      unit: "lb·in",
    },
    {
      description: "Total aircraft weight.",
      id: "totalWeightLb",
      kind: "number",
      label: "Total weight",
      unit: "lb",
    },
  ],
  outputs: [
    {
      description: "Center of gravity position aft of the datum.",
      format: "length-in",
      id: "cgInches",
      kind: "number",
      label: "CG",
      unit: "in",
    },
  ],
  title: "Center of Gravity Calculator",
});
export const runCenterOfGravity = centerOfGravityTool.execute;
export default centerOfGravityTool;

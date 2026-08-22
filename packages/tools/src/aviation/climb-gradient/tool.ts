import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type ClimbGradientInput = {
  readonly altitudeGainFt: number;
  readonly horizontalDistanceFt: number;
};

export type ClimbGradientOutput = {
  readonly gradientPercent: number;
};

export const climbGradientExample = {
  input: { altitudeGainFt: 300, horizontalDistanceFt: 6000 },
  output: { gradientPercent: 5 },
} satisfies ToolExample<ClimbGradientInput, ClimbGradientOutput>;

export const calculateClimbGradient = (
  input: ClimbGradientInput,
): ClimbGradientOutput => {
  if (input.horizontalDistanceFt <= 0)
    simpleError(
      "horizontalDistanceFt",
      "The horizontal distance must be positive.",
      "invalid_distance",
    );
  return {
    gradientPercent: roundStatistic(
      (input.altitudeGainFt / input.horizontalDistanceFt) * 100,
    ),
  };
};

export const climbGradientTool = createSimpleTool({
  calculate: (input) =>
    calculateClimbGradient(input as unknown as ClimbGradientInput),
  description:
    "Compute the climb gradient as altitude gained over horizontal distance flown.",
  id: "aviation/climb-gradient",
  inputs: [
    {
      description: "Altitude gained over the segment.",
      id: "altitudeGainFt",
      kind: "number",
      label: "Altitude gain",
      unit: "ft",
    },
    {
      description: "Horizontal distance covered in the segment.",
      id: "horizontalDistanceFt",
      kind: "number",
      label: "Horizontal distance",
      unit: "ft",
    },
  ],
  outputs: [
    {
      description: "Climb gradient.",
      format: "percent",
      id: "gradientPercent",
      kind: "number",
      label: "Gradient",
      unit: "%",
    },
  ],
  title: "Climb Gradient Calculator",
});
export const runClimbGradient = climbGradientTool.execute;
export default climbGradientTool;

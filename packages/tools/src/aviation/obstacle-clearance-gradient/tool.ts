import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ObstacleClearanceGradientInput = {
  readonly horizontalDistanceFt: number;
  readonly obstacleHeightFt: number;
};

export type ObstacleClearanceGradientOutput = {
  readonly gradientPercent: number;
};

export const obstacleClearanceGradientExample = {
  input: { horizontalDistanceFt: 6000, obstacleHeightFt: 300 },
  output: { gradientPercent: 5 },
} satisfies ToolExample<
  ObstacleClearanceGradientInput,
  ObstacleClearanceGradientOutput
>;

export const calculateObstacleClearanceGradient = (
  input: ObstacleClearanceGradientInput,
): ObstacleClearanceGradientOutput => {
  if (input.horizontalDistanceFt <= 0)
    simpleError(
      "horizontalDistanceFt",
      "The horizontal distance must be positive.",
      "invalid_distance",
    );
  return {
    gradientPercent:
      (input.obstacleHeightFt / input.horizontalDistanceFt) * 100,
  };
};

export const obstacleClearanceGradientTool = createSimpleTool({
  calculate: (input) =>
    calculateObstacleClearanceGradient(
      input as unknown as ObstacleClearanceGradientInput,
    ),
  description:
    "Compute the climb gradient required to clear an obstacle over a given horizontal distance.",
  id: "aviation/obstacle-clearance-gradient",
  inputs: [
    {
      description:
        "Horizontal distance from the departure point to the obstacle.",
      id: "horizontalDistanceFt",
      kind: "number",
      label: "Horizontal distance",
      minimum: 0,
      unit: "ft",
    },
    {
      description: "Height of the obstacle above the departure point.",
      id: "obstacleHeightFt",
      kind: "number",
      label: "Obstacle height",
      minimum: 0,
      unit: "ft",
    },
  ],
  outputs: [
    {
      description: "Climb gradient required to clear the obstacle.",
      format: "percent",
      id: "gradientPercent",
      kind: "number",
      label: "Required gradient",
      unit: "%",
    },
  ],
  title: "Obstacle Clearance Gradient Calculator",
});
export const runObstacleClearanceGradient =
  obstacleClearanceGradientTool.execute;
export default obstacleClearanceGradientTool;

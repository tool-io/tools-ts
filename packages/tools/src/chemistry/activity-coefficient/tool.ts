import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const activityCoefficientExample = {
  input: { concentrationM: 0.1, gamma: 0.9 },
} satisfies ToolExample<{
  readonly concentrationM: number;
  readonly gamma: number;
}>;

export const activityCoefficientTool = createSimpleTool({
  id: "chemistry/activity-coefficient",
  title: "Activity Coefficient From Gamma Input",
  description:
    "Compute the ionic activity as the activity coefficient times the molar concentration.",
  inputs: [
    { id: "gamma", label: "Activity coefficient", kind: "number" },
    { id: "concentrationM", label: "Concentration", kind: "number", unit: "M" },
  ],
  outputs: [{ id: "activity", label: "Activity", kind: "number" }],
  calculate: (input) => {
    const gamma = input.gamma as number;
    const concentrationM = input.concentrationM as number;
    if (!(gamma > 0))
      simpleError("gamma", "Activity coefficient must be positive.");
    if (!(concentrationM >= 0))
      simpleError("concentrationM", "Concentration must not be negative.");
    return { activity: gamma * concentrationM };
  },
});
export const runActivityCoefficient = activityCoefficientTool.execute;
export default activityCoefficientTool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ActivityFromFugacityInput = {
  readonly fugacityBar: number;
  readonly standardPressureBar?: number;
};

export type ActivityFromFugacityOutput = {
  readonly thermodynamicActivity: number;
};

export const activityFromFugacityExample = {
  input: { fugacityBar: 2.5 },
  output: { thermodynamicActivity: 2.5 },
} satisfies ToolExample<ActivityFromFugacityInput, ActivityFromFugacityOutput>;

export const activityFromFugacityTool = createSimpleTool({
  id: "chemistry/activity-from-fugacity",
  title: "Activity From Fugacity",
  description:
    "Compute the thermodynamic activity as the ratio of fugacity to the standard pressure of one bar.",
  inputs: [
    { id: "fugacityBar", label: "Fugacity", kind: "number", unit: "bar" },
    {
      default: 1,
      id: "standardPressureBar",
      kind: "number",
      label: "Standard pressure",
      unit: "bar",
    },
  ],
  outputs: [
    {
      id: "thermodynamicActivity",
      label: "Thermodynamic activity",
      kind: "number",
    },
  ],
  calculate: (input) => {
    const fugacityBar = input.fugacityBar as number;
    const standardPressureBar = input.standardPressureBar as number;
    if (!(fugacityBar > 0))
      simpleError("fugacityBar", "Fugacity must be positive.");
    if (!(standardPressureBar > 0))
      simpleError("standardPressureBar", "Standard pressure must be positive.");
    return { thermodynamicActivity: fugacityBar / standardPressureBar };
  },
});
export const runActivityFromFugacity = activityFromFugacityTool.execute;
export default activityFromFugacityTool;

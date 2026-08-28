import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const ActivityTool = createSimpleTool({
  id: "chemistry/activity",
  title: "Activity Calculator",
  description: "Compute thermodynamic activity a = gamma * concentration.",
  inputs: [
    {
      id: "gammaCoefficient",
      label: "Gamma coefficient",
      kind: "number",
      minimum: 0,
    },
    {
      id: "concentrationMolL",
      label: "Concentration",
      kind: "number",
      minimum: 0,
      unit: "mol/L",
    },
  ],
  outputs: [{ id: "activity", label: "Activity", kind: "number" }],
  calculate: (input) => {
    if (!((input.gammaCoefficient as number) > 0))
      simpleError(
        "gammaCoefficient",
        "Activity coefficient must be greater than zero.",
        "invalid_coefficient",
      );
    return {
      activity:
        (input.gammaCoefficient as number) *
        (input.concentrationMolL as number),
    };
  },
});
export default ActivityTool;
export const runActivity = ActivityTool.execute;

export type ActivityInput = {
  readonly gammaCoefficient: number;
  readonly concentrationMolL: number;
};

export type ActivityOutput = {
  readonly activity: number;
};

export const activityExample = {
  input: {
    gammaCoefficient: 1,
    concentrationMolL: 1,
  },
  output: {
    activity: 1,
  },
} satisfies ToolExample<ActivityInput, ActivityOutput>;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const activityDecayTool = createSimpleTool({
  id: "chemistry/activity-decay",
  title: "Activity Decay Calculator",
  description:
    "Compute the radioactive activity after a time as A = A₀·e^(−λt) with λ = ln2/t½.",
  inputs: [
    {
      description: "Initial activity A₀.",
      id: "initialActivityBq",
      label: "Initial activity",
      kind: "number",
      unit: "Bq",
    },
    {
      description: "Half-life of the nuclide; must be greater than zero.",
      id: "halfLifeSeconds",
      label: "Half-life",
      kind: "number",
      minimum: 0,
      unit: "s",
    },
    {
      description: "Elapsed time since the initial measurement.",
      id: "elapsedSeconds",
      label: "Elapsed time",
      kind: "number",
      minimum: 0,
      unit: "s",
    },
  ],
  outputs: [
    {
      description: "Activity after the elapsed time.",
      id: "activityBq",
      label: "Activity",
      kind: "number",
      unit: "Bq",
    },
  ],
  calculate: (input) => {
    if (!((input.initialActivityBq as number) >= 0))
      simpleError(
        "initialActivityBq",
        "Initial activity must not be negative.",
        "invalid_activity",
      );
    const halfLife = input.halfLifeSeconds as number;
    if (halfLife <= 0)
      simpleError(
        "halfLifeSeconds",
        "The half-life must be greater than zero.",
        "invalid_half_life",
      );
    const lambda = Math.LN2 / halfLife;
    return {
      activityBq:
        (input.initialActivityBq as number) *
        Math.exp(-lambda * (input.elapsedSeconds as number)),
    };
  },
});
export const runActivityDecay = activityDecayTool.execute;
export default activityDecayTool;

export type ActivityDecayInput = {
  readonly initialActivityBq: number;
  readonly halfLifeSeconds: number;
  readonly elapsedSeconds: number;
};

export type ActivityDecayOutput = {
  readonly activityBq: number;
};

export const activityDecayExample = {
  input: {
    initialActivityBq: 1,
    halfLifeSeconds: 1,
    elapsedSeconds: 1,
  },
  output: {
    activityBq: 0.5,
  },
} satisfies ToolExample<ActivityDecayInput, ActivityDecayOutput>;

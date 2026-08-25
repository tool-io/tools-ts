import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type LeesStirringFrequencyInput = {
  readonly planningPeriodDays: number;
  readonly sessionsPerMonth: number;
};

export type LeesStirringFrequencyOutput = {
  readonly intervalDays: number;
};

export const leesStirringFrequencyExample = {
  input: {
    planningPeriodDays: 30,
    sessionsPerMonth: 2,
  },
  output: {
    intervalDays: 15,
  },
} satisfies ToolExample<
  LeesStirringFrequencyInput,
  LeesStirringFrequencyOutput
>;

export const calculateLeesStirringFrequency = (
  input: LeesStirringFrequencyInput,
): LeesStirringFrequencyOutput => {
  if (input.sessionsPerMonth <= 0 || input.planningPeriodDays <= 0)
    simpleError(
      "sessionsPerMonth",
      "The planning period and session count must be positive.",
      "invalid_value",
    );
  return {
    intervalDays: roundStatistic(
      input.planningPeriodDays / input.sessionsPerMonth,
    ),
  };
};

export const leesStirringFrequencyTool = createSimpleTool({
  calculate: (input) =>
    calculateLeesStirringFrequency(
      input as unknown as LeesStirringFrequencyInput,
    ),
  description:
    "Spread a chosen number of lees-stirring sessions evenly across an explicitly supplied planning period and return the interval between sessions.",
  id: "oenology/lees-stirring-frequency",
  inputs: [
    {
      description: "Length of the planning period.",
      id: "planningPeriodDays",
      kind: "number",
      label: "Planning period",
      minimum: 0.000001,
      unit: "d",
    },
    {
      description: "Stirring sessions planned during the period.",
      id: "sessionsPerMonth",
      kind: "number",
      label: "Sessions per month",
      minimum: 1,
    },
  ],
  outputs: [
    {
      description: "Days between stirring passes.",
      id: "intervalDays",
      kind: "number",
      label: "Interval",
      unit: "d",
    },
  ],
  title: "Lees Stirring Interval Planner",
});
export const runLeesStirringFrequency = leesStirringFrequencyTool.execute;
export default leesStirringFrequencyTool;

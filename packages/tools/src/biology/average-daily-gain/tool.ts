import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AverageDailyGainInput = {
  readonly daysElapsed: number;
  readonly finalWeightKg: number;
  readonly initialWeightKg: number;
};

export type AverageDailyGainOutput = {
  readonly averageDailyGainKgPerDay: number;
};

export const averageDailyGainExample = {
  input: { daysElapsed: 180, finalWeightKg: 500, initialWeightKg: 320 },
  output: { averageDailyGainKgPerDay: 1 },
} satisfies ToolExample<AverageDailyGainInput, AverageDailyGainOutput>;

export const averageDailyGainTool = createSimpleTool({
  id: "biology/average-daily-gain",
  title: "Average Daily Gain",
  description:
    "Compute average daily gain as (final weight - initial weight) / days elapsed in kilograms per day; the result is signed, so weight loss yields a negative value.",
  inputs: [
    {
      description: "Number of days elapsed; must be greater than zero.",
      id: "daysElapsed",
      kind: "number",
      label: "Days elapsed",
      unit: "days",
    },
    {
      description: "Final body weight in kilograms.",
      id: "finalWeightKg",
      kind: "number",
      label: "Final weight",
      unit: "kg",
    },
    {
      description: "Initial body weight in kilograms.",
      id: "initialWeightKg",
      kind: "number",
      label: "Initial weight",
      unit: "kg",
    },
  ],
  outputs: [
    {
      description: "Average daily gain in kilograms per day; signed.",
      id: "averageDailyGainKgPerDay",
      kind: "number",
      label: "Average daily gain",
      unit: "kg/day",
    },
  ],
  calculate: (input) => {
    const daysElapsed = input.daysElapsed as number;
    const finalWeightKg = input.finalWeightKg as number;
    const initialWeightKg = input.initialWeightKg as number;
    if (!(daysElapsed > 0))
      simpleError(
        "daysElapsed",
        "The days elapsed must be greater than zero.",
        "invalid_days",
      );
    return {
      averageDailyGainKgPerDay: (finalWeightKg - initialWeightKg) / daysElapsed,
    };
  },
});
export const runAverageDailyGain = averageDailyGainTool.execute;
export default averageDailyGainTool;

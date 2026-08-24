import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ZahaviCommuteTimeBudgetInput = {
  readonly meanCommuteMinutes: number;
  readonly tripsPerDay?: number;
};

export type ZahaviCommuteTimeBudgetOutput = {
  readonly dailyBudgetMinutes: number;
  readonly differenceFromOneHourMinutes: number;
};

export const zahaviCommuteTimeBudgetExample = {
  input: {
    meanCommuteMinutes: 30,
    tripsPerDay: 2,
  },
  output: {
    dailyBudgetMinutes: 60,
    differenceFromOneHourMinutes: 0,
  },
} satisfies ToolExample<
  ZahaviCommuteTimeBudgetInput,
  ZahaviCommuteTimeBudgetOutput
>;

const CLASSIC_DAILY_BUDGET_MINUTES = 60;

export const calculateZahaviBudget = (
  input: ZahaviCommuteTimeBudgetInput,
): ZahaviCommuteTimeBudgetOutput => {
  if (
    !Number.isFinite(input.meanCommuteMinutes) ||
    input.meanCommuteMinutes < 0
  )
    simpleError(
      "meanCommuteMinutes",
      "Mean one-way commute time must be a finite nonnegative number.",
      "invalid_value",
    );
  if (
    input.tripsPerDay !== undefined &&
    (!Number.isFinite(input.tripsPerDay) || input.tripsPerDay <= 0)
  )
    simpleError(
      "tripsPerDay",
      "The daily trip count must be positive.",
      "invalid_value",
    );
  const dailyBudgetMinutes =
    input.meanCommuteMinutes * (input.tripsPerDay ?? 2);
  if (!Number.isFinite(dailyBudgetMinutes))
    simpleError(
      "meanCommuteMinutes",
      "The implied daily travel time is outside the finite numeric range.",
      "numeric_range",
    );
  return {
    dailyBudgetMinutes,
    differenceFromOneHourMinutes:
      dailyBudgetMinutes - CLASSIC_DAILY_BUDGET_MINUTES,
  };
};

export const zahaviCommuteTimeBudgetTool = createSimpleTool({
  calculate: (input) =>
    calculateZahaviBudget({
      meanCommuteMinutes: input.meanCommuteMinutes as number,
      tripsPerDay: input.tripsPerDay as number,
    }),
  description:
    "Multiply a mean one-way commute time by commute trips per day and compare this commute-only proxy with Zahavi's approximate one-hour all-travel daily budget.",
  id: "sociology/zahavi-commute-time-budget-constant",
  inputs: [
    {
      description: "Average one-way commute minutes reported by travelers.",
      id: "meanCommuteMinutes",
      kind: "number",
      label: "Mean commute",
      minimum: 0,
      unit: "min",
    },
    {
      default: 2,
      description:
        "Trips per person per day; two covers a home-to-work round trip.",
      id: "tripsPerDay",
      kind: "number",
      label: "Trips per day",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description:
        "Implied daily travel budget in minutes to compare with the sixty minute constant.",
      id: "dailyBudgetMinutes",
      kind: "number",
      label: "Daily budget",
      unit: "min",
    },
    {
      description:
        "Signed difference from the approximate sixty-minute daily budget; positive values are above it.",
      id: "differenceFromOneHourMinutes",
      kind: "number",
      label: "Difference from one hour",
      unit: "min",
    },
  ],
  title: "Zahavi Commute Time Budget Constant Checker",
});
export const runZahaviCommuteTimeBudget = zahaviCommuteTimeBudgetTool.execute;
export default zahaviCommuteTimeBudgetTool;

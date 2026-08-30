import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DailyRateToMonthlyDriftInput = Readonly<{
  readonly secondsPerDay: number;
  readonly daysInMonth: number;
}>;
export type DailyRateToMonthlyDriftOutput = Readonly<{
  readonly monthlySeconds: number;
}>;

export const calculateDailyRateToMonthlyDrift = (
  x: DailyRateToMonthlyDriftInput,
): DailyRateToMonthlyDriftOutput => {
  if (!Number.isFinite(x.secondsPerDay))
    simpleError("secondsPerDay", "Provide a finite number.");
  if (
    !Number.isFinite(x.daysInMonth) ||
    !Number.isSafeInteger(x.daysInMonth) ||
    x.daysInMonth < 1
  )
    simpleError("daysInMonth", "Provide a positive safe integer.");
  if (!(x.daysInMonth <= 31))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const monthlySeconds = x.secondsPerDay * x.daysInMonth;
  if (!Number.isFinite(monthlySeconds))
    simpleError(
      "monthlySeconds",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { monthlySeconds: Object.is(monthlySeconds, -0) ? 0 : monthlySeconds };
};

export const example = {
  input: {
    secondsPerDay: 5,
    daysInMonth: 30,
  },
  output: { monthlySeconds: 150 },
} satisfies ToolExample<
  DailyRateToMonthlyDriftInput,
  DailyRateToMonthlyDriftOutput
>;

export const tool = createSimpleTool({
  id: "horology/daily-rate-to-monthly-drift",
  title: "Daily Rate To Monthly Drift",
  description:
    "Signed clock drift over a specified number of calendar days from seconds gained or lost per day.",
  inputs: [
    {
      id: "secondsPerDay",
      kind: "number",
      label: "Seconds Per Day",
      unit: "s/day",
    },
    {
      id: "daysInMonth",
      kind: "integer",
      label: "Days In Month",
      unit: "day",
      minimum: 1,
    },
  ],
  outputs: [
    {
      id: "monthlySeconds",
      kind: "number",
      label: "Monthly Seconds",
      unit: "s",
    },
  ],
  calculate: (input) =>
    calculateDailyRateToMonthlyDrift({
      secondsPerDay: input.secondsPerDay as number,
      daysInMonth: input.daysInMonth as number,
    }),
});
export const dailyRateToMonthlyDriftTool = tool;
export const runDailyRateToMonthlyDrift = tool.execute;
export default tool;

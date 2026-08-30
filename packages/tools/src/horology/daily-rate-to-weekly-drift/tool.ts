import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DailyRateToWeeklyDriftInput = Readonly<{
  readonly secondsPerDay: number;
}>;
export type DailyRateToWeeklyDriftOutput = Readonly<{
  readonly weeklySeconds: number;
}>;

export const calculateDailyRateToWeeklyDrift = (
  x: DailyRateToWeeklyDriftInput,
): DailyRateToWeeklyDriftOutput => {
  if (!Number.isFinite(x.secondsPerDay))
    simpleError("secondsPerDay", "Provide a finite number.");
  const weeklySeconds = 7 * x.secondsPerDay;
  if (!Number.isFinite(weeklySeconds))
    simpleError(
      "weeklySeconds",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { weeklySeconds: Object.is(weeklySeconds, -0) ? 0 : weeklySeconds };
};

export const example = {
  input: {
    secondsPerDay: 5,
  },
  output: { weeklySeconds: 35 },
} satisfies ToolExample<
  DailyRateToWeeklyDriftInput,
  DailyRateToWeeklyDriftOutput
>;

export const tool = createSimpleTool({
  id: "horology/daily-rate-to-weekly-drift",
  title: "Daily Rate To Weekly Drift",
  description:
    "Signed accumulated clock drift over a seven-day week from seconds gained or lost per day.",
  inputs: [
    {
      id: "secondsPerDay",
      kind: "number",
      label: "Seconds Per Day",
      unit: "s/day",
    },
  ],
  outputs: [
    { id: "weeklySeconds", kind: "number", label: "Weekly Seconds", unit: "s" },
  ],
  calculate: (input) =>
    calculateDailyRateToWeeklyDrift({
      secondsPerDay: input.secondsPerDay as number,
    }),
});
export const dailyRateToWeeklyDriftTool = tool;
export const runDailyRateToWeeklyDrift = tool.execute;
export default tool;

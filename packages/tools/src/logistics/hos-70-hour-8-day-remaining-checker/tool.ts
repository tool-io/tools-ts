import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Hos70Hour8DayRemainingCheckerInput = {
  readonly cycleLimitHours?: number;
  readonly hoursWorkedInLast8Days: number;
};

export type Hos70Hour8DayRemainingCheckerOutput = {
  readonly cycleHoursRemaining: number;
  readonly withinCycle: boolean;
};

export const calculateHos70Hour8DayRemainingChecker = (
  input: Hos70Hour8DayRemainingCheckerInput,
): Hos70Hour8DayRemainingCheckerOutput => {
  const cycleLimitHours = input.cycleLimitHours ?? 70;
  if (
    !Number.isFinite(input.hoursWorkedInLast8Days) ||
    input.hoursWorkedInLast8Days < 0
  )
    return simpleError(
      "hoursWorkedInLast8Days",
      "Hours worked must be finite and non-negative.",
      "invalid_hours",
    );
  if (!Number.isFinite(cycleLimitHours) || cycleLimitHours <= 0)
    return simpleError(
      "cycleLimitHours",
      "The cycle limit must be greater than zero.",
      "invalid_limit",
    );
  return {
    cycleHoursRemaining: cycleLimitHours - input.hoursWorkedInLast8Days,
    withinCycle: input.hoursWorkedInLast8Days <= cycleLimitHours,
  };
};

export const hos70Hour8DayRemainingCheckerExample = {
  input: { cycleLimitHours: 70, hoursWorkedInLast8Days: 61.5 },
  output: { cycleHoursRemaining: 8.5, withinCycle: true },
} satisfies ToolExample<
  Hos70Hour8DayRemainingCheckerInput,
  Hos70Hour8DayRemainingCheckerOutput
>;

export const hos70Hour8DayRemainingCheckerTool = createSimpleTool({
  id: "logistics/hos-70-hour-8-day-remaining-checker",
  title: "HOS 70 Hour 8 Day Remaining Checker",
  description:
    "Compare rolling on-duty hours with a configurable cycle limit. The 70-hour default applies only to qualifying US property carriers operating every day and does not evaluate restarts, recaps, exemptions, or other HOS limits.",
  inputs: [
    {
      description: "On-duty hours worked in the rolling last eight days.",
      id: "hoursWorkedInLast8Days",
      kind: "number",
      label: "Hours in 8 days",
      minimum: 0,
    },
    {
      default: 70,
      description: "Cycle hour limit (70 standard, 60 for the alternate rule).",
      id: "cycleLimitHours",
      kind: "number",
      label: "Cycle limit",
      minimum: Number.MIN_VALUE,
      unit: "h",
    },
  ],
  outputs: [
    {
      description: "Whether the driver is still within the cycle.",
      id: "withinCycle",
      kind: "boolean",
      label: "Within cycle",
    },
    {
      description:
        "Cycle hours remaining before the limit (negative when over).",
      id: "cycleHoursRemaining",
      kind: "number",
      label: "Hours remaining",
    },
  ],
  calculate: (input) =>
    calculateHos70Hour8DayRemainingChecker({
      cycleLimitHours: input.cycleLimitHours as number | undefined,
      hoursWorkedInLast8Days: input.hoursWorkedInLast8Days as number,
    }),
});

export const runHos70Hour8DayRemainingChecker =
  hos70Hour8DayRemainingCheckerTool.execute;
export default hos70Hour8DayRemainingCheckerTool;

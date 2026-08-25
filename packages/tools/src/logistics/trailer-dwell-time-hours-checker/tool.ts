import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TrailerDwellTimeHoursCheckerInput = {
  readonly dwellHours: number;
  readonly freeTimeHours?: number;
};

export type TrailerDwellTimeHoursCheckerOutput = {
  readonly excessHours: number;
  readonly withinFreeTime: boolean;
};

export const calculateTrailerDwellTimeHoursChecker = (
  input: TrailerDwellTimeHoursCheckerInput,
): TrailerDwellTimeHoursCheckerOutput => {
  const freeTimeHours = input.freeTimeHours ?? 2;
  if (!Number.isFinite(input.dwellHours) || input.dwellHours < 0)
    return simpleError(
      "dwellHours",
      "Dwell time must be finite and non-negative.",
      "invalid_hours",
    );
  if (!Number.isFinite(freeTimeHours) || freeTimeHours < 0)
    return simpleError(
      "freeTimeHours",
      "Free time must be finite and non-negative.",
      "invalid_hours",
    );
  return {
    excessHours: Math.max(0, input.dwellHours - freeTimeHours),
    withinFreeTime: input.dwellHours <= freeTimeHours,
  };
};

export const trailerDwellTimeHoursCheckerExample = {
  input: { dwellHours: 4.5, freeTimeHours: 2 },
  output: { excessHours: 2.5, withinFreeTime: false },
} satisfies ToolExample<
  TrailerDwellTimeHoursCheckerInput,
  TrailerDwellTimeHoursCheckerOutput
>;

export const trailerDwellTimeHoursCheckerTool = createSimpleTool({
  id: "logistics/trailer-dwell-time-hours-checker",
  title: "Trailer Dwell Time Hours Checker",
  description:
    "Check trailer dwell hours against the facility free time allowance and report excess hours.",
  inputs: [
    {
      description: "Hours the trailer dwelled at the facility.",
      id: "dwellHours",
      kind: "number",
      label: "Dwell hours",
      minimum: 0,
      unit: "h",
    },
    {
      default: 2,
      description:
        "Free time allowed before dwell counts as excess; zero means all dwell time is excess.",
      id: "freeTimeHours",
      kind: "number",
      label: "Free time",
      minimum: 0,
      unit: "h",
    },
  ],
  outputs: [
    {
      description: "Whether the trailer left within the free time.",
      id: "withinFreeTime",
      kind: "boolean",
      label: "Within free time",
    },
    {
      description: "Dwell hours beyond the free time allowance.",
      id: "excessHours",
      kind: "number",
      label: "Excess hours",
      minimum: 0,
      unit: "h",
    },
  ],
  calculate: (input) =>
    calculateTrailerDwellTimeHoursChecker({
      dwellHours: input.dwellHours as number,
      freeTimeHours: input.freeTimeHours as number | undefined,
    }),
});

export const runTrailerDwellTimeHoursChecker =
  trailerDwellTimeHoursCheckerTool.execute;
export default trailerDwellTimeHoursCheckerTool;

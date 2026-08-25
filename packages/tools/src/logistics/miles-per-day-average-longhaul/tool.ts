import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MilesPerDayAverageLonghaulInput = {
  readonly daysOnRoute: number;
  readonly milesCovered: number;
};

export type MilesPerDayAverageLonghaulOutput = {
  readonly averageMilesPerDay: number;
};

export const calculateMilesPerDayAverageLonghaul = (
  input: MilesPerDayAverageLonghaulInput,
): MilesPerDayAverageLonghaulOutput => {
  if (!Number.isFinite(input.milesCovered) || input.milesCovered < 0)
    return simpleError(
      "milesCovered",
      "Miles covered must be finite and non-negative.",
      "invalid_miles",
    );
  if (!Number.isFinite(input.daysOnRoute) || input.daysOnRoute <= 0)
    return simpleError(
      "daysOnRoute",
      "Days on route must be greater than zero.",
      "invalid_days",
    );
  const averageMilesPerDay = input.milesCovered / input.daysOnRoute;
  if (
    !Number.isFinite(averageMilesPerDay) ||
    (input.milesCovered > 0 && averageMilesPerDay <= 0)
  )
    return simpleError(
      "milesCovered",
      "Average daily mileage is outside the representable range.",
      "average_out_of_range",
    );
  return { averageMilesPerDay };
};

export const milesPerDayAverageLonghaulExample = {
  input: { daysOnRoute: 11, milesCovered: 2750 },
  output: { averageMilesPerDay: 250 },
} satisfies ToolExample<
  MilesPerDayAverageLonghaulInput,
  MilesPerDayAverageLonghaulOutput
>;

export const milesPerDayAverageLonghaulTool = createSimpleTool({
  id: "logistics/miles-per-day-average-longhaul",
  title: "Miles Per Day Average Longhaul Calculator",
  description:
    "Compute average daily mileage for a long-haul run by dividing total miles by days on the route.",
  inputs: [
    {
      description: "Total miles covered.",
      id: "milesCovered",
      kind: "number",
      label: "Miles covered",
      minimum: 0,
    },
    {
      description: "Calendar days spent on the route.",
      id: "daysOnRoute",
      kind: "number",
      label: "Days on route",
      minimum: Number.MIN_VALUE,
      unit: "day",
    },
  ],
  outputs: [
    {
      description: "Average miles driven per day.",
      id: "averageMilesPerDay",
      kind: "number",
      label: "Miles/day",
    },
  ],
  calculate: (input) =>
    calculateMilesPerDayAverageLonghaul({
      daysOnRoute: input.daysOnRoute as number,
      milesCovered: input.milesCovered as number,
    }),
});

export const runMilesPerDayAverageLonghaul =
  milesPerDayAverageLonghaulTool.execute;
export default milesPerDayAverageLonghaulTool;

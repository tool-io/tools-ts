import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MultiDayTripPlanHoursDaysInput = {
  readonly maxDriveHoursPerDay?: number;
  readonly planningSpeedMph?: number;
  readonly tripMiles: number;
};

export type MultiDayTripPlanHoursDaysOutput = {
  readonly plannedDrivingDays: number;
  readonly totalDriveHours: number;
};

export const calculateMultiDayTripPlanHoursDays = (
  input: MultiDayTripPlanHoursDaysInput,
): MultiDayTripPlanHoursDaysOutput => {
  const planningSpeedMph = input.planningSpeedMph ?? 55;
  const maxDriveHoursPerDay = input.maxDriveHoursPerDay ?? 11;
  if (!Number.isFinite(input.tripMiles) || input.tripMiles < 0)
    return simpleError(
      "tripMiles",
      "Trip distance must be finite and non-negative.",
      "invalid_distance",
    );
  if (!Number.isFinite(planningSpeedMph) || planningSpeedMph <= 0)
    return simpleError(
      "planningSpeedMph",
      "Planning speed must be greater than zero.",
      "invalid_speed",
    );
  if (!Number.isFinite(maxDriveHoursPerDay) || maxDriveHoursPerDay <= 0)
    return simpleError(
      "maxDriveHoursPerDay",
      "Daily drive hours must be greater than zero.",
      "invalid_limit",
    );
  const totalDriveHours = input.tripMiles / planningSpeedMph;
  const plannedDrivingDays = Math.ceil(totalDriveHours / maxDriveHoursPerDay);
  if (
    !Number.isFinite(totalDriveHours) ||
    (input.tripMiles > 0 && totalDriveHours <= 0) ||
    !Number.isSafeInteger(plannedDrivingDays)
  )
    return simpleError(
      "tripMiles",
      "The trip duration is outside the representable range.",
      "duration_out_of_range",
    );
  return {
    totalDriveHours,
    plannedDrivingDays,
  };
};

export const multiDayTripPlanHoursDaysExample = {
  input: { maxDriveHoursPerDay: 11, planningSpeedMph: 55, tripMiles: 1200 },
  output: { plannedDrivingDays: 2, totalDriveHours: 21.818181818181817 },
} satisfies ToolExample<
  MultiDayTripPlanHoursDaysInput,
  MultiDayTripPlanHoursDaysOutput
>;

export const multiDayTripPlanHoursDaysTool = createSimpleTool({
  id: "logistics/multi-day-trip-plan-hours-days",
  title: "Multi Day Trip Plan Hours Days Calculator",
  description:
    "Plan a long-haul trip by converting miles to drive hours at a planning speed and rounding up to whole driving days under the daily limit.",
  inputs: [
    {
      description: "Total trip distance in miles.",
      id: "tripMiles",
      kind: "number",
      label: "Trip miles",
      minimum: 0,
    },
    {
      default: 55,
      description: "Average door-to-door planning speed in mph.",
      id: "planningSpeedMph",
      kind: "number",
      label: "Planning speed",
      minimum: Number.MIN_VALUE,
      unit: "mph",
    },
    {
      default: 11,
      description: "Maximum driving hours per day.",
      id: "maxDriveHoursPerDay",
      kind: "number",
      label: "Max drive hours/day",
      minimum: Number.MIN_VALUE,
      unit: "h",
    },
  ],
  outputs: [
    {
      description: "Total estimated driving hours for the trip.",
      id: "totalDriveHours",
      kind: "number",
      label: "Drive hours",
    },
    {
      description: "Whole driving days needed (rounded up).",
      id: "plannedDrivingDays",
      kind: "integer",
      label: "Driving days",
    },
  ],
  calculate: (input) =>
    calculateMultiDayTripPlanHoursDays({
      maxDriveHoursPerDay: input.maxDriveHoursPerDay as number | undefined,
      planningSpeedMph: input.planningSpeedMph as number | undefined,
      tripMiles: input.tripMiles as number,
    }),
});

export const runMultiDayTripPlanHoursDays =
  multiDayTripPlanHoursDaysTool.execute;
export default multiDayTripPlanHoursDaysTool;

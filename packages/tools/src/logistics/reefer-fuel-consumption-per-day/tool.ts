import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ReeferFuelConsumptionPerDayInput = {
  readonly consumptionLitersPerHour: number;
  readonly operatingHoursPerDay?: number;
  readonly transitDays?: number;
};

export type ReeferFuelConsumptionPerDayOutput = {
  readonly litersPerDay: number;
  readonly totalTripLiters: number;
};

export const calculateReeferFuelConsumptionPerDay = (
  input: ReeferFuelConsumptionPerDayInput,
): ReeferFuelConsumptionPerDayOutput => {
  if (
    !Number.isFinite(input.consumptionLitersPerHour) ||
    input.consumptionLitersPerHour <= 0
  )
    return simpleError(
      "consumptionLitersPerHour",
      "The hourly fuel burn must be greater than zero.",
      "invalid_rate",
    );
  const operatingHoursPerDay = input.operatingHoursPerDay ?? 24;
  if (
    !Number.isFinite(operatingHoursPerDay) ||
    operatingHoursPerDay <= 0 ||
    operatingHoursPerDay > 24
  )
    return simpleError(
      "operatingHoursPerDay",
      "Operating hours must be between zero and twenty-four per day.",
      "invalid_hours",
    );
  const transitDays = input.transitDays ?? 1;
  if (!(Number.isSafeInteger(transitDays) && transitDays >= 1))
    return simpleError(
      "transitDays",
      "The transit time must be a whole number of at least one day.",
      "invalid_days",
    );
  const litersPerDay = input.consumptionLitersPerHour * operatingHoursPerDay;
  const totalTripLiters = litersPerDay * transitDays;
  if (!Number.isFinite(litersPerDay) || !Number.isFinite(totalTripLiters))
    return simpleError(
      "consumptionLitersPerHour",
      "The fuel estimate is outside the representable range.",
      "result_out_of_range",
    );
  return { litersPerDay, totalTripLiters };
};

export const reeferFuelConsumptionPerDayExample = {
  input: {
    consumptionLitersPerHour: 3.2,
    operatingHoursPerDay: 24,
    transitDays: 14,
  },
  output: {
    litersPerDay: 76.80000000000001,
    totalTripLiters: 1075.2000000000003,
  },
} satisfies ToolExample<
  ReeferFuelConsumptionPerDayInput,
  ReeferFuelConsumptionPerDayOutput
>;

export const reeferFuelConsumptionPerDayTool = createSimpleTool({
  id: "logistics/reefer-fuel-consumption-per-day",
  title: "Reefer Fuel Consumption per Day",
  description:
    "Project refrigeration-unit diesel use from the rated litres-per-hour burn, daily operating hours and trip length in days.",
  inputs: [
    {
      description:
        "Rated fuel consumption of the reefer unit in litres per hour.",
      id: "consumptionLitersPerHour",
      kind: "number",
      label: "L/hour",
      minimum: Number.MIN_VALUE,
      unit: "L/h",
    },
    {
      default: 24,
      description: "Hours the unit runs per day (continuous operation is 24).",
      id: "operatingHoursPerDay",
      kind: "number",
      label: "Hours/day",
      maximum: 24,
      minimum: Number.MIN_VALUE,
      unit: "h",
    },
    {
      default: 1,
      description: "Transit duration in days.",
      id: "transitDays",
      kind: "integer",
      label: "Days",
      minimum: 1,
    },
  ],
  outputs: [
    {
      description: "Expected fuel consumption per day in litres.",
      id: "litersPerDay",
      kind: "number",
      label: "Litres/day",
    },
    {
      description: "Total fuel for the whole transit in litres.",
      id: "totalTripLiters",
      kind: "number",
      label: "Trip total",
    },
  ],
  calculate: (input) =>
    calculateReeferFuelConsumptionPerDay({
      consumptionLitersPerHour: input.consumptionLitersPerHour as number,
      operatingHoursPerDay: input.operatingHoursPerDay as number | undefined,
      transitDays: input.transitDays as number | undefined,
    }),
});

export const runReeferFuelConsumptionPerDay =
  reeferFuelConsumptionPerDayTool.execute;
export default reeferFuelConsumptionPerDayTool;

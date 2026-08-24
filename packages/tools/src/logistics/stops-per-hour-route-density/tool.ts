import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type StopsPerHourRouteDensityInput = {
  readonly routeDurationHours: number;
  readonly stopsCompleted: number;
};

export type StopsPerHourRouteDensityOutput = {
  readonly stopsPerHour: number;
};

export const calculateStopsPerHourRouteDensity = (
  input: StopsPerHourRouteDensityInput,
): StopsPerHourRouteDensityOutput => {
  if (
    !Number.isFinite(input.routeDurationHours) ||
    input.routeDurationHours <= 0
  )
    return simpleError(
      "routeDurationHours",
      "Route duration must be finite and greater than zero.",
      "invalid_hours",
    );
  if (!Number.isSafeInteger(input.stopsCompleted) || input.stopsCompleted < 0)
    return simpleError(
      "stopsCompleted",
      "Stops completed must be a non-negative safe integer.",
      "invalid_stops",
    );
  if (input.stopsCompleted === 0) return { stopsPerHour: 0 };
  const stopsPerHour = input.stopsCompleted / input.routeDurationHours;
  if (!Number.isFinite(stopsPerHour))
    return simpleError(
      "routeDurationHours",
      "Stops per hour is too large to represent.",
      "result_out_of_range",
    );
  return { stopsPerHour };
};

export const stopsPerHourRouteDensityExample = {
  input: { routeDurationHours: 9.25, stopsCompleted: 148 },
  output: { stopsPerHour: 16 },
} satisfies ToolExample<
  StopsPerHourRouteDensityInput,
  StopsPerHourRouteDensityOutput
>;

export const stopsPerHourRouteDensityTool = createSimpleTool({
  id: "logistics/stops-per-hour-route-density",
  title: "Stops Per Hour Route Density Calculator",
  description:
    "Compute route density as delivery stops completed per hour on the route including drive time.",
  inputs: [
    {
      description: "Stops completed on the route.",
      id: "stopsCompleted",
      kind: "integer",
      label: "Stops completed",
      minimum: 0,
    },
    {
      description: "Total route duration including drive and service time.",
      id: "routeDurationHours",
      kind: "number",
      label: "Route hours",
      minimum: Number.MIN_VALUE,
      unit: "h",
    },
  ],
  outputs: [
    {
      description: "Stops completed per total route hour.",
      id: "stopsPerHour",
      kind: "number",
      label: "Stops per hour",
      minimum: 0,
      unit: "stops/h",
    },
  ],
  calculate: (input) =>
    calculateStopsPerHourRouteDensity({
      routeDurationHours: input.routeDurationHours as number,
      stopsCompleted: input.stopsCompleted as number,
    }),
});

export const runStopsPerHourRouteDensity = stopsPerHourRouteDensityTool.execute;
export default stopsPerHourRouteDensityTool;

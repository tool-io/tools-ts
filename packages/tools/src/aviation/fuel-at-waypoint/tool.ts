import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FuelAtWaypointInput = {
  readonly burnRateKgPerNauticalMile: number;
  readonly distanceNm: number;
  readonly startFuelKg: number;
};

export type FuelAtWaypointOutput = {
  readonly remainingFuelKg: number;
};

export const fuelAtWaypointExample = {
  input: { burnRateKgPerNauticalMile: 12, distanceNm: 200, startFuelKg: 12000 },
  output: { remainingFuelKg: 9600 },
} satisfies ToolExample<FuelAtWaypointInput, FuelAtWaypointOutput>;

export const calculateFuelAtWaypoint = (
  input: FuelAtWaypointInput,
): FuelAtWaypointOutput => {
  if (input.startFuelKg <= 0)
    simpleError(
      "startFuelKg",
      "The starting fuel must be positive.",
      "invalid_fuel",
    );
  if (input.distanceNm < 0)
    simpleError(
      "distanceNm",
      "The distance cannot be negative.",
      "invalid_distance",
    );
  if (input.burnRateKgPerNauticalMile <= 0)
    simpleError(
      "burnRateKgPerNauticalMile",
      "The burn rate must be positive.",
      "invalid_rate",
    );
  const remainingFuelKg =
    input.startFuelKg - input.distanceNm * input.burnRateKgPerNauticalMile;
  if (remainingFuelKg < 0)
    simpleError(
      "startFuelKg",
      "The starting fuel does not cover the distance.",
      "insufficient_fuel",
    );
  return { remainingFuelKg };
};

export const fuelAtWaypointTool = createSimpleTool({
  calculate: (input) =>
    calculateFuelAtWaypoint(input as unknown as FuelAtWaypointInput),
  description:
    "Compute the fuel remaining on arrival at a waypoint from the starting fuel and per-mile burn.",
  id: "aviation/fuel-at-waypoint",
  inputs: [
    {
      description: "Fuel onboard at the departure point.",
      id: "startFuelKg",
      kind: "number",
      label: "Starting fuel",
      unit: "kg",
    },
    {
      description: "Distance to the waypoint.",
      id: "distanceNm",
      kind: "number",
      label: "Distance",
      minimum: 0,
      unit: "nm",
    },
    {
      description: "Average fuel consumption per nautical mile.",
      id: "burnRateKgPerNauticalMile",
      kind: "number",
      label: "Burn rate",
      unit: "kg/nm",
    },
  ],
  outputs: [
    {
      description: "Fuel expected onboard at the waypoint.",
      format: "weight-kg",
      id: "remainingFuelKg",
      kind: "number",
      label: "Remaining fuel",
      unit: "kg",
    },
  ],
  title: "Fuel at Waypoint Calculator",
});
export const runFuelAtWaypoint = fuelAtWaypointTool.execute;
export default fuelAtWaypointTool;

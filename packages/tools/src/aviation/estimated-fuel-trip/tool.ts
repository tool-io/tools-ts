import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type EstimatedFuelTripInput = {
  readonly burnRateKgPerHour: number;
  readonly distanceNm: number;
  readonly groundSpeedKt: number;
};

export type EstimatedFuelTripOutput = {
  readonly tripFuelKg: number;
};

export const estimatedFuelTripExample = {
  input: { burnRateKgPerHour: 2400, distanceNm: 300, groundSpeedKt: 120 },
} satisfies ToolExample<EstimatedFuelTripInput>;

export const estimatedFuelTripTool = createSimpleTool({
  id: "aviation/estimated-fuel-trip",
  title: "Estimated Trip Fuel Calculator",
  description:
    "Estimate the fuel needed for a trip from distance, ground speed, and fuel burn rate.",
  inputs: [
    {
      id: "burnRateKgPerHour",
      label: "Burn rate",
      kind: "number",
      unit: "kg/h",
    },
    { id: "distanceNm", label: "Distance", kind: "number", unit: "nm" },
    {
      id: "groundSpeedKt",
      label: "Ground speed",
      kind: "number",
      unit: "kt",
    },
  ],
  outputs: [
    { id: "tripFuelKg", label: "Trip fuel", kind: "number", unit: "kg" },
  ],
  calculate: (input) => {
    const burnRateKgPerHour = input.burnRateKgPerHour as number;
    const distanceNm = input.distanceNm as number;
    const groundSpeedKt = input.groundSpeedKt as number;
    if (distanceNm <= 0)
      simpleError("distanceNm", "The distance must be greater than zero.");
    if (groundSpeedKt <= 0)
      simpleError(
        "groundSpeedKt",
        "The ground speed must be greater than zero.",
      );
    if (burnRateKgPerHour <= 0)
      simpleError(
        "burnRateKgPerHour",
        "The burn rate must be greater than zero.",
      );
    return {
      tripFuelKg: (distanceNm / groundSpeedKt) * burnRateKgPerHour,
    };
  },
});
export const runEstimatedFuelTrip = estimatedFuelTripTool.execute;
export default estimatedFuelTripTool;

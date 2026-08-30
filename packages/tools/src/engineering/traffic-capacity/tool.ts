import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TrafficCapacityInput = Readonly<{
  readonly vehiclesPerHourPerLane: number;
  readonly laneCount: number;
}>;
export type TrafficCapacityOutput = Readonly<{
  readonly capacityVehiclesPerHour: number;
}>;

export const calculateTrafficCapacity = (
  x: TrafficCapacityInput,
): TrafficCapacityOutput => {
  if (
    !Number.isFinite(x.vehiclesPerHourPerLane) ||
    x.vehiclesPerHourPerLane < 0
  )
    simpleError(
      "vehiclesPerHourPerLane",
      "Provide a finite number at least 0.",
    );
  if (!Number.isFinite(x.laneCount) || x.laneCount < 1)
    simpleError("laneCount", "Provide a finite number at least 1.");
  if (!Number.isSafeInteger(x.laneCount))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const capacityVehiclesPerHour = x.vehiclesPerHourPerLane * x.laneCount;
  if (!Number.isFinite(capacityVehiclesPerHour))
    simpleError(
      "capacityVehiclesPerHour",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    capacityVehiclesPerHour: Object.is(capacityVehiclesPerHour, -0)
      ? 0
      : capacityVehiclesPerHour,
  };
};

export const example = {
  input: { vehiclesPerHourPerLane: 1800, laneCount: 2 },
  output: { capacityVehiclesPerHour: 3600 },
} satisfies ToolExample<TrafficCapacityInput, TrafficCapacityOutput>;

export const tool = createSimpleTool({
  id: "engineering/traffic-capacity",
  title: "Traffic Capacity",
  description:
    "Nominal link capacity from specified per-lane saturation flow times active lane count; excludes signals, merges and adjustments.",
  inputs: [
    {
      id: "vehiclesPerHourPerLane",
      kind: "number",
      label: "Vehicles Per Hour Per Lane",
      unit: "veh/h/lane",
      minimum: 0,
    },
    { id: "laneCount", kind: "integer", label: "Lane Count", minimum: 1 },
  ],
  outputs: [
    {
      id: "capacityVehiclesPerHour",
      kind: "number",
      label: "Capacity Vehicles Per Hour",
      unit: "veh/h",
    },
  ],
  calculate: (input) =>
    calculateTrafficCapacity({
      vehiclesPerHourPerLane: input.vehiclesPerHourPerLane as number,
      laneCount: input.laneCount as number,
    }),
});
export const trafficCapacityTool = tool;
export const runTrafficCapacity = tool.execute;
export default tool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TrafficFlowDensityInput = Readonly<{
  readonly flowVehiclesPerHour: number;
  readonly spaceMeanSpeedKilometersPerHour: number;
}>;
export type TrafficFlowDensityOutput = Readonly<{
  readonly densityVehiclesPerKilometer: number;
}>;

export const calculateTrafficFlowDensity = (
  x: TrafficFlowDensityInput,
): TrafficFlowDensityOutput => {
  if (!Number.isFinite(x.flowVehiclesPerHour) || x.flowVehiclesPerHour < 0)
    simpleError("flowVehiclesPerHour", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.spaceMeanSpeedKilometersPerHour) ||
    x.spaceMeanSpeedKilometersPerHour < 0
  )
    simpleError(
      "spaceMeanSpeedKilometersPerHour",
      "Provide a finite number at least 0.",
    );
  const densityVehiclesPerKilometer =
    x.flowVehiclesPerHour / x.spaceMeanSpeedKilometersPerHour;
  if (!Number.isFinite(densityVehiclesPerKilometer))
    simpleError(
      "densityVehiclesPerKilometer",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    densityVehiclesPerKilometer: Object.is(densityVehiclesPerKilometer, -0)
      ? 0
      : densityVehiclesPerKilometer,
  };
};

export const example = {
  input: { flowVehiclesPerHour: 1200, spaceMeanSpeedKilometersPerHour: 60 },
  output: { densityVehiclesPerKilometer: 20 },
} satisfies ToolExample<TrafficFlowDensityInput, TrafficFlowDensityOutput>;

export const tool = createSimpleTool({
  id: "engineering/traffic-flow-density",
  title: "Traffic Flow Density",
  description:
    "Traffic density k=q/v from observed flow rate and space-mean speed, in vehicles per kilometer.",
  inputs: [
    {
      id: "flowVehiclesPerHour",
      kind: "number",
      label: "Flow Vehicles Per Hour",
      unit: "veh/h",
      minimum: 0,
    },
    {
      id: "spaceMeanSpeedKilometersPerHour",
      kind: "number",
      label: "Space Mean Speed Kilometers Per Hour",
      unit: "km/h",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "densityVehiclesPerKilometer",
      kind: "number",
      label: "Density Vehicles Per Kilometer",
      unit: "veh/km",
    },
  ],
  calculate: (input) =>
    calculateTrafficFlowDensity({
      flowVehiclesPerHour: input.flowVehiclesPerHour as number,
      spaceMeanSpeedKilometersPerHour:
        input.spaceMeanSpeedKilometersPerHour as number,
    }),
});
export const trafficFlowDensityTool = tool;
export const runTrafficFlowDensity = tool.execute;
export default tool;

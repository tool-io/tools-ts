import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type FuelToClimbInput = {
  readonly altitudeToGainFt: number;
  readonly climbRateFpm: number;
  readonly fuelFlowLitersPerHour: number;
};

export type FuelToClimbOutput = {
  readonly fuelLiters: number;
};

export const fuelToClimbExample = {
  input: {
    altitudeToGainFt: 3000,
    climbRateFpm: 500,
    fuelFlowLitersPerHour: 40,
  },
  output: { fuelLiters: 4 },
} satisfies ToolExample<FuelToClimbInput, FuelToClimbOutput>;

export const calculateFuelToClimb = (
  input: FuelToClimbInput,
): FuelToClimbOutput => {
  if (input.altitudeToGainFt <= 0)
    simpleError(
      "altitudeToGainFt",
      "The altitude to gain must be positive.",
      "invalid_altitude",
    );
  if (input.climbRateFpm <= 0)
    simpleError(
      "climbRateFpm",
      "The climb rate must be positive.",
      "invalid_rate",
    );
  if (input.fuelFlowLitersPerHour < 0)
    simpleError(
      "fuelFlowLitersPerHour",
      "The fuel flow cannot be negative.",
      "invalid_flow",
    );
  const minutes = input.altitudeToGainFt / input.climbRateFpm;
  return {
    fuelLiters: roundStatistic((minutes / 60) * input.fuelFlowLitersPerHour),
  };
};

export const fuelToClimbTool = createSimpleTool({
  calculate: (input) =>
    calculateFuelToClimb(input as unknown as FuelToClimbInput),
  description:
    "Compute the fuel needed to climb a given altitude at a given climb rate and fuel flow.",
  id: "aviation/fuel-to-climb",
  inputs: [
    {
      description: "Altitude to gain.",
      id: "altitudeToGainFt",
      kind: "number",
      label: "Altitude to gain",
      unit: "ft",
    },
    {
      description: "Sustained climb rate.",
      id: "climbRateFpm",
      kind: "number",
      label: "Climb rate",
      unit: "ft/min",
    },
    {
      description: "Fuel consumption rate during the climb.",
      id: "fuelFlowLitersPerHour",
      kind: "number",
      label: "Fuel flow",
      unit: "L/h",
    },
  ],
  outputs: [
    {
      description: "Fuel burned during the climb.",
      format: "volume-l",
      id: "fuelLiters",
      kind: "number",
      label: "Fuel to climb",
      unit: "L",
    },
  ],
  title: "Fuel to Climb Calculator",
});
export const runFuelToClimb = fuelToClimbTool.execute;
export default fuelToClimbTool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type FuelBurnInput = {
  readonly flightHours: number;
  readonly fuelFlowLitersPerHour: number;
};

export type FuelBurnOutput = {
  readonly fuelBurnedLiters: number;
};

export const fuelBurnExample = {
  input: { flightHours: 2.5, fuelFlowLitersPerHour: 40 },
  output: { fuelBurnedLiters: 100 },
} satisfies ToolExample<FuelBurnInput, FuelBurnOutput>;

export const calculateFuelBurn = (input: FuelBurnInput): FuelBurnOutput => {
  if (input.flightHours < 0 || input.fuelFlowLitersPerHour < 0)
    simpleError(
      "flightHours",
      "Flight time and flow cannot be negative.",
      "invalid_input",
    );
  return {
    fuelBurnedLiters: roundStatistic(
      input.fuelFlowLitersPerHour * input.flightHours,
    ),
  };
};

export const fuelBurnTool = createSimpleTool({
  calculate: (input) => calculateFuelBurn(input as unknown as FuelBurnInput),
  description:
    "Compute the fuel burned over a flight from the hourly consumption rate.",
  id: "aviation/fuel-burn",
  inputs: [
    {
      description: "Duration of the flight.",
      id: "flightHours",
      kind: "number",
      label: "Flight time",
      unit: "h",
    },
    {
      description: "Fuel consumption rate.",
      id: "fuelFlowLitersPerHour",
      kind: "number",
      label: "Fuel flow",
      unit: "L/h",
    },
  ],
  outputs: [
    {
      description: "Total fuel burned.",
      format: "volume-l",
      id: "fuelBurnedLiters",
      kind: "number",
      label: "Fuel burned",
      unit: "L",
    },
  ],
  title: "Fuel Burn Calculator",
});
export const runFuelBurn = fuelBurnTool.execute;
export default fuelBurnTool;

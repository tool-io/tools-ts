import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FuelPerHourFromBurnInput = {
  readonly fuelUsedKg: number;
  readonly hoursBurned: number;
};

export type FuelPerHourFromBurnOutput = {
  readonly burnKgPerHour: number;
};

export const fuelPerHourFromBurnExample = {
  input: { fuelUsedKg: 300, hoursBurned: 2 },
  output: { burnKgPerHour: 150 },
} satisfies ToolExample<FuelPerHourFromBurnInput, FuelPerHourFromBurnOutput>;

export const calculateFuelPerHourFromBurn = (
  input: FuelPerHourFromBurnInput,
): FuelPerHourFromBurnOutput => {
  if (input.fuelUsedKg <= 0)
    simpleError(
      "fuelUsedKg",
      "Fuel used must be greater than zero.",
      "invalid_fuel_used",
    );
  if (input.hoursBurned <= 0)
    simpleError(
      "hoursBurned",
      "Hours burned must be greater than zero.",
      "invalid_hours_burned",
    );
  return { burnKgPerHour: input.fuelUsedKg / input.hoursBurned };
};

export const fuelPerHourFromBurnTool = createSimpleTool({
  calculate: (input) =>
    calculateFuelPerHourFromBurn(input as unknown as FuelPerHourFromBurnInput),
  description:
    "Compute the average fuel burn rate as burnKgPerHour = fuelUsedKg / hoursBurned.",
  id: "aviation/fuel-per-hour-from-burn",
  inputs: [
    {
      description: "Total fuel consumed over the period.",
      id: "fuelUsedKg",
      kind: "number",
      label: "Fuel used",
      minimum: 0,
      unit: "kg",
    },
    {
      description: "Elapsed time over which the fuel was consumed.",
      id: "hoursBurned",
      kind: "number",
      label: "Hours burned",
      minimum: 0,
      unit: "h",
    },
  ],
  outputs: [
    {
      description: "Average fuel consumption rate.",
      id: "burnKgPerHour",
      kind: "number",
      label: "Burn rate",
      unit: "kg/h",
    },
  ],
  title: "Burn Rate Calculator",
});
export const runFuelPerHourFromBurn = fuelPerHourFromBurnTool.execute;
export default fuelPerHourFromBurnTool;

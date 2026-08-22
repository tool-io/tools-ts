import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TaxiFuelInput = {
  readonly burnRateKgPerHour: number;
  readonly taxiMinutes: number;
};

export type TaxiFuelOutput = {
  readonly taxiFuelKg: number;
};

export const taxiFuelExample = {
  input: { burnRateKgPerHour: 240, taxiMinutes: 12 },
  output: { taxiFuelKg: 48 },
} satisfies ToolExample<TaxiFuelInput, TaxiFuelOutput>;

export const calculateTaxiFuel = (input: TaxiFuelInput): TaxiFuelOutput => {
  if (input.burnRateKgPerHour <= 0)
    simpleError(
      "burnRateKgPerHour",
      "The burn rate must be positive.",
      "invalid_rate",
    );
  if (input.taxiMinutes <= 0)
    simpleError(
      "taxiMinutes",
      "The taxi time must be positive.",
      "invalid_duration",
    );
  return { taxiFuelKg: (input.burnRateKgPerHour * input.taxiMinutes) / 60 };
};

export const taxiFuelTool = createSimpleTool({
  calculate: (input) => calculateTaxiFuel(input as unknown as TaxiFuelInput),
  description:
    "Compute the fuel burned during taxi from the ground burn rate and taxi time.",
  id: "aviation/taxi-fuel",
  inputs: [
    {
      description: "Ground fuel consumption rate.",
      id: "burnRateKgPerHour",
      kind: "number",
      label: "Burn rate",
      unit: "kg/h",
    },
    {
      description: "Duration of ground taxi operations.",
      id: "taxiMinutes",
      kind: "number",
      label: "Taxi time",
      unit: "min",
    },
  ],
  outputs: [
    {
      description: "Fuel needed for taxi.",
      format: "weight-kg",
      id: "taxiFuelKg",
      kind: "number",
      label: "Taxi fuel",
      unit: "kg",
    },
  ],
  title: "Taxi Fuel Calculator",
});
export const runTaxiFuel = taxiFuelTool.execute;
export default taxiFuelTool;

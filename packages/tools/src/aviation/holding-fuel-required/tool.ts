import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HoldingFuelRequiredInput = {
  readonly burnRateKgPerHour: number;
  readonly holdMinutes?: number;
};

export type HoldingFuelRequiredOutput = {
  readonly holdingFuelKg: number;
};

const DEFAULT_HOLD_MINUTES = 45;

export const holdingFuelRequiredExample = {
  input: { burnRateKgPerHour: 2400, holdMinutes: 45 },
  output: { holdingFuelKg: 1800 },
} satisfies ToolExample<HoldingFuelRequiredInput, HoldingFuelRequiredOutput>;

export const calculateHoldingFuelRequired = (
  input: HoldingFuelRequiredInput,
): HoldingFuelRequiredOutput => {
  const minutes = input.holdMinutes ?? DEFAULT_HOLD_MINUTES;
  if (input.burnRateKgPerHour <= 0)
    simpleError(
      "burnRateKgPerHour",
      "The burn rate must be positive.",
      "invalid_rate",
    );
  if (minutes <= 0)
    simpleError(
      "holdMinutes",
      "The hold time must be positive.",
      "invalid_duration",
    );
  return { holdingFuelKg: (input.burnRateKgPerHour * minutes) / 60 };
};

export const holdingFuelRequiredTool = createSimpleTool({
  calculate: (input) =>
    calculateHoldingFuelRequired(input as unknown as HoldingFuelRequiredInput),
  description:
    "Compute the fuel required to hold for a given time at the expected burn rate.",
  id: "aviation/holding-fuel-required",
  inputs: [
    {
      description: "Holding fuel consumption rate.",
      id: "burnRateKgPerHour",
      kind: "number",
      label: "Burn rate",
      unit: "kg/h",
    },
    {
      default: 45,
      description:
        "Time to hold at the fix; forty-five minutes is a common planning default.",
      id: "holdMinutes",
      kind: "number",
      label: "Hold time",
      unit: "min",
    },
  ],
  outputs: [
    {
      description: "Fuel required for the hold.",
      format: "weight-kg",
      id: "holdingFuelKg",
      kind: "number",
      label: "Holding fuel",
      unit: "kg",
    },
  ],
  title: "Holding Fuel Required Calculator",
});
export const runHoldingFuelRequired = holdingFuelRequiredTool.execute;
export default holdingFuelRequiredTool;

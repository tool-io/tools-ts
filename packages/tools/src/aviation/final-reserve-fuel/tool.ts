import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FinalReserveFuelInput = {
  readonly burnRateKgPerHour: number;
  readonly holdMinutes?: number;
};

export type FinalReserveFuelOutput = {
  readonly finalReserveFuelKg: number;
};

const DEFAULT_HOLD_MINUTES = 30;

export const finalReserveFuelExample = {
  input: { burnRateKgPerHour: 2400, holdMinutes: 30 },
  output: { finalReserveFuelKg: 1200 },
} satisfies ToolExample<FinalReserveFuelInput, FinalReserveFuelOutput>;

export const calculateFinalReserveFuel = (
  input: FinalReserveFuelInput,
): FinalReserveFuelOutput => {
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
  return { finalReserveFuelKg: (input.burnRateKgPerHour * minutes) / 60 };
};

export const finalReserveFuelTool = createSimpleTool({
  calculate: (input) =>
    calculateFinalReserveFuel(input as unknown as FinalReserveFuelInput),
  description:
    "Compute the final reserve fuel needed to hold for a given time at the holding burn rate.",
  id: "aviation/final-reserve-fuel",
  inputs: [
    {
      description: "Holding fuel consumption rate.",
      id: "burnRateKgPerHour",
      kind: "number",
      label: "Burn rate",
      unit: "kg/h",
    },
    {
      default: 30,
      description:
        "Endurance to protect; thirty minutes is the typical turbine standard.",
      id: "holdMinutes",
      kind: "number",
      label: "Hold time",
      unit: "min",
    },
  ],
  outputs: [
    {
      description: "Fuel reserved for holding at the destination.",
      format: "weight-kg",
      id: "finalReserveFuelKg",
      kind: "number",
      label: "Final reserve fuel",
      unit: "kg",
    },
  ],
  title: "Final Reserve Fuel Calculator",
});
export const runFinalReserveFuel = finalReserveFuelTool.execute;
export default finalReserveFuelTool;

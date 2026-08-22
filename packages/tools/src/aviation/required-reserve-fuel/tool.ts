import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RequiredReserveFuelInput = {
  readonly fuelFlowLitersPerHour: number;
  readonly reserveMinutes?: number;
};

export type RequiredReserveFuelOutput = {
  readonly reserveLiters: number;
};

/** FAA day-VFR minimum reserve is 30 minutes; night is 45. */
const DEFAULT_RESERVE_MINUTES = 45;

export const requiredReserveFuelExample = {
  input: { fuelFlowLitersPerHour: 40, reserveMinutes: 45 },
  output: { reserveLiters: 30 },
} satisfies ToolExample<RequiredReserveFuelInput, RequiredReserveFuelOutput>;

export const calculateRequiredReserveFuel = (
  input: RequiredReserveFuelInput,
): RequiredReserveFuelOutput => {
  const minutes = input.reserveMinutes ?? DEFAULT_RESERVE_MINUTES;
  if (minutes < 0)
    simpleError(
      "reserveMinutes",
      "The reserve duration cannot be negative.",
      "invalid_duration",
    );
  if (input.fuelFlowLitersPerHour <= 0)
    simpleError(
      "fuelFlowLitersPerHour",
      "The fuel flow must be positive.",
      "invalid_flow",
    );
  return {
    reserveLiters: (input.fuelFlowLitersPerHour * minutes) / 60,
  };
};

export const requiredReserveFuelTool = createSimpleTool({
  calculate: (input) =>
    calculateRequiredReserveFuel(input as unknown as RequiredReserveFuelInput),
  description:
    "Compute the reserve fuel needed for a given endurance time and consumption rate.",
  id: "aviation/required-reserve-fuel",
  inputs: [
    {
      description: "Fuel consumption rate.",
      id: "fuelFlowLitersPerHour",
      kind: "number",
      label: "Fuel flow",
      unit: "L/h",
    },
    {
      default: 45,
      description:
        "Reserve endurance in minutes; FAA VFR day requires thirty, night forty-five.",
      id: "reserveMinutes",
      kind: "number",
      label: "Reserve time",
      unit: "min",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Required reserve fuel volume.",
      format: "volume-l",
      id: "reserveLiters",
      kind: "number",
      label: "Reserve fuel",
      unit: "L",
    },
  ],
  title: "Required Reserve Fuel Calculator",
});
export const runRequiredReserveFuel = requiredReserveFuelTool.execute;
export default requiredReserveFuelTool;

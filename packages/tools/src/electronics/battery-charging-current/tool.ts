import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BatteryChargingCurrentInput = {
  readonly capacityAh: number;
  readonly cRateNumber?: number;
};

export type BatteryChargingCurrentOutput = {
  readonly chargeCurrentA: number;
};

export const batteryChargingCurrentExample = {
  input: { capacityAh: 2 },
  output: { chargeCurrentA: 1 },
} satisfies ToolExample<
  BatteryChargingCurrentInput,
  BatteryChargingCurrentOutput
>;

export const calculateBatteryChargingCurrent = (
  input: BatteryChargingCurrentInput,
): BatteryChargingCurrentOutput => {
  if (!(input.capacityAh > 0))
    simpleError("capacityAh", "Capacity must be positive.", "invalid_capacity");
  const cRateNumber = input.cRateNumber ?? 0.5;
  if (!(cRateNumber >= 0.05) || !(cRateNumber <= 3))
    simpleError(
      "cRateNumber",
      "C-rate must be between 0.05 and 3.",
      "invalid_c_rate",
    );
  return { chargeCurrentA: input.capacityAh * cRateNumber };
};

export const batteryChargingCurrentTool = createSimpleTool({
  calculate: (input) =>
    calculateBatteryChargingCurrent(
      input as unknown as BatteryChargingCurrentInput,
    ),
  description:
    "Compute a safe constant-current charge rate for a battery from its capacity and a C-rate multiple.",
  id: "electronics/battery-charging-current",
  inputs: [
    {
      description: "Rated capacity of the battery.",
      format: "capacity",
      id: "capacityAh",
      kind: "number",
      label: "Capacity",
      unit: "Ah",
    },
    {
      default: 0.5,
      description:
        "Charge rate as a multiple of capacity; typical gentle charging is half the capacity per hour.",
      id: "cRateNumber",
      kind: "number",
      label: "C-rate",
      maximum: 3,
      minimum: 0.05,
    },
  ],
  outputs: [
    {
      description: "Recommended constant charging current.",
      format: "current",
      id: "chargeCurrentA",
      kind: "number",
      label: "Charge current",
      unit: "A",
    },
  ],
  title: "Charge Current C-Rate",
});
export const runBatteryChargingCurrent = batteryChargingCurrentTool.execute;
export default batteryChargingCurrentTool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BatteryChargingTimeInput = {
  readonly capacityAh: number;
  readonly chargeCurrentA: number;
};

export type BatteryChargingTimeOutput = {
  readonly chargingHours: number;
};

export const batteryChargingTimeExample = {
  input: { capacityAh: 10, chargeCurrentA: 2 },
  output: { chargingHours: 6 },
} satisfies ToolExample<BatteryChargingTimeInput, BatteryChargingTimeOutput>;

export const calculateBatteryChargingTime = (
  input: BatteryChargingTimeInput,
): BatteryChargingTimeOutput => {
  if (!(input.capacityAh > 0))
    simpleError("capacityAh", "Capacity must be positive.", "invalid_capacity");
  if (!(input.chargeCurrentA > 0))
    simpleError(
      "chargeCurrentA",
      "Charge current must be positive.",
      "invalid_current",
    );
  return {
    chargingHours: (input.capacityAh / input.chargeCurrentA) * 1.2,
  };
};

export const batteryChargingTimeTool = createSimpleTool({
  calculate: (input) =>
    calculateBatteryChargingTime(input as unknown as BatteryChargingTimeInput),
  description:
    "Estimate the hours needed to fully charge a battery at a constant current, including a documented 1.2 inefficiency factor that accounts for taper and losses.",
  id: "electronics/battery-charging-time",
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
      description: "Constant charging current applied to the battery.",
      format: "current",
      id: "chargeCurrentA",
      kind: "number",
      label: "Charge current",
      unit: "A",
    },
  ],
  outputs: [
    {
      description:
        "Estimated time from empty to full including charging inefficiency.",
      format: "duration",
      id: "chargingHours",
      kind: "number",
      label: "Charging time",
      unit: "h",
    },
  ],
  title: "Charging Time Hours",
});
export const runBatteryChargingTime = batteryChargingTimeTool.execute;
export default batteryChargingTimeTool;

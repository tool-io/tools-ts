import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const BatteryCapacityTool = createSimpleTool({
  id: "chemistry/battery-capacity",
  title: "Battery Capacity Calculator",
  description: "Compute battery capacity in ampere-hours.",
  inputs: [
    {
      id: "currentA",
      label: "Discharge current",
      kind: "number",
      minimum: 0,
      unit: "A",
    },
    { id: "timeHours", label: "Time", kind: "number", minimum: 0, unit: "h" },
  ],
  outputs: [
    { id: "capacityAh", label: "Capacity", kind: "number", unit: "Ah" },
  ],
  calculate: (input) => {
    const h = input.timeHours as number;
    if (h <= 0) simpleError("timeHours", "> 0 h required.", "invalid_time");
    return { capacityAh: (input.currentA as number) * h };
  },
});
export default BatteryCapacityTool;
export const runBatteryCapacity = BatteryCapacityTool.execute;

export type BatteryCapacityInput = {
  readonly currentA: number;
  readonly timeHours: number;
};

export type BatteryCapacityOutput = {
  readonly capacityAh: number;
};

export const batteryCapacityExample = {
  input: {
    currentA: 1,
    timeHours: 1,
  },
  output: {
    capacityAh: 1,
  },
} satisfies ToolExample<BatteryCapacityInput, BatteryCapacityOutput>;

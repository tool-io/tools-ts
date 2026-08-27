import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BatteryLifeInput = {
  readonly capacityMah: number;
  readonly loadMa: number;
};

export type BatteryLifeOutput = {
  readonly runtimeHours: number;
};

export const batteryLifeExample = {
  input: {
    capacityMah: 2000,
    loadMa: 500,
  },
  output: { runtimeHours: 4 },
} satisfies ToolExample<BatteryLifeInput, BatteryLifeOutput>;

export const calculateBatteryLife = (
  input: BatteryLifeInput,
): BatteryLifeOutput => {
  if (input.capacityMah <= 0 || input.loadMa <= 0)
    simpleError(
      "capacityMah",
      "Battery capacity and load current must be positive.",
      "invalid_input",
    );
  return { runtimeHours: input.capacityMah / input.loadMa };
};

export const batteryLifeTool = createSimpleTool({
  calculate: (input) =>
    calculateBatteryLife(input as unknown as BatteryLifeInput),
  description:
    "Estimate battery runtime from rated charge capacity and constant load current: hours = mAh / mA. Real-world derating (Peukert effect, temperature, cutoff voltage) is not modeled.",
  id: "electronics/battery-life",
  inputs: [
    {
      description: "Rated charge capacity of the battery.",
      id: "capacityMah",
      kind: "number",
      label: "Capacity",
      unit: "mAh",
    },
    {
      description: "Constant current drawn by the load.",
      id: "loadMa",
      kind: "number",
      label: "Load current",
      unit: "mA",
    },
  ],
  outputs: [
    {
      description: "Estimated discharge time until the capacity is used up.",
      format: "duration-h",
      id: "runtimeHours",
      kind: "number",
      label: "Runtime",
      unit: "h",
    },
  ],
  title: "Battery Life Calculator",
});
export const runBatteryLife = batteryLifeTool.execute;
export default batteryLifeTool;

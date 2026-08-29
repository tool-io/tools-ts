import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BatteryRemainingCapacityInput = Readonly<{
  readonly fullChargeCapacityAh: number;
  readonly stateOfChargePercent: number;
}>;
export type BatteryRemainingCapacityOutput = Readonly<{
  remainingCapacityAh: number;
}>;

export const calculateBatteryRemainingCapacity = (
  i: BatteryRemainingCapacityInput,
): BatteryRemainingCapacityOutput => {
  const value = (i.fullChargeCapacityAh * i.stateOfChargePercent) / 100;
  if (!Number.isFinite(value))
    simpleError(
      "remainingCapacityAh",
      "The inputs produce a non-finite result.",
    );
  return { remainingCapacityAh: Object.is(value, -0) ? 0 : value };
};

export const example = {
  input: { fullChargeCapacityAh: 80, stateOfChargePercent: 65 },
  output: { remainingCapacityAh: 52 },
} satisfies ToolExample<
  BatteryRemainingCapacityInput,
  BatteryRemainingCapacityOutput
>;

export const tool = createSimpleTool({
  id: "electronics/battery-remaining-capacity",
  title: "Battery Remaining Capacity",
  description:
    "Calculate remaining battery charge in ampere-hours from measured full-charge capacity and state of charge percentage.",
  inputs: [
    {
      id: "fullChargeCapacityAh",
      kind: "number",
      label: "Full Charge Capacity (Ah)",
      unit: "Ah",
      minimum: 0,
    },
    {
      id: "stateOfChargePercent",
      kind: "number",
      label: "State Of Charge (%)",
      unit: "%",
      minimum: 0,
      maximum: 100,
    },
  ],
  outputs: [
    {
      id: "remainingCapacityAh",
      kind: "number",
      label: "Remaining Capacity (Ah)",
      unit: "Ah",
    },
  ],
  calculate: (input) =>
    calculateBatteryRemainingCapacity({
      fullChargeCapacityAh: input.fullChargeCapacityAh as number,
      stateOfChargePercent: input.stateOfChargePercent as number,
    }),
});
export const batteryRemainingCapacityTool = tool;
export const runBatteryRemainingCapacity = tool.execute;
export default tool;

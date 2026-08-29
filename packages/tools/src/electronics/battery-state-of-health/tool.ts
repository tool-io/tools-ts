import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BatteryStateOfHealthInput = Readonly<{
  readonly measuredCapacityAh: number;
  readonly ratedCapacityAh: number;
}>;
export type BatteryStateOfHealthOutput = Readonly<{
  stateOfHealthPercent: number;
}>;

export const calculateBatteryStateOfHealth = (
  i: BatteryStateOfHealthInput,
): BatteryStateOfHealthOutput => {
  const value = (100 * i.measuredCapacityAh) / i.ratedCapacityAh;
  if (!Number.isFinite(value))
    simpleError(
      "stateOfHealthPercent",
      "The inputs produce a non-finite result.",
    );
  return { stateOfHealthPercent: Object.is(value, -0) ? 0 : value };
};

export const example = {
  input: { measuredCapacityAh: 72, ratedCapacityAh: 80 },
  output: { stateOfHealthPercent: 90 },
} satisfies ToolExample<BatteryStateOfHealthInput, BatteryStateOfHealthOutput>;

export const tool = createSimpleTool({
  id: "electronics/battery-state-of-health",
  title: "Battery State Of Health",
  description:
    "Calculate battery state of health as measured full-charge capacity divided by rated new capacity, expressed as a percentage; values over 100% can be valid measurements.",
  inputs: [
    {
      id: "measuredCapacityAh",
      kind: "number",
      label: "Measured Capacity (Ah)",
      unit: "Ah",
      minimum: 0,
    },
    {
      id: "ratedCapacityAh",
      kind: "number",
      label: "Rated Capacity (Ah)",
      unit: "Ah",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [
    {
      id: "stateOfHealthPercent",
      kind: "number",
      label: "State Of Health (%)",
      unit: "%",
    },
  ],
  calculate: (input) =>
    calculateBatteryStateOfHealth({
      measuredCapacityAh: input.measuredCapacityAh as number,
      ratedCapacityAh: input.ratedCapacityAh as number,
    }),
});
export const batteryStateOfHealthTool = tool;
export const runBatteryStateOfHealth = tool.execute;
export default tool;

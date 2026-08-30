import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BatteryCapacityFadeInput = Readonly<{
  readonly initialCapacityAh: number;
  readonly currentCapacityAh: number;
}>;
export type BatteryCapacityFadeOutput = Readonly<{
  capacityFadePercent: number;
}>;

export const calculateBatteryCapacityFade = (
  input: BatteryCapacityFadeInput,
): BatteryCapacityFadeOutput => {
  if (!(
    Number.isFinite(input.initialCapacityAh) && input.initialCapacityAh > 0
  ))
    simpleError(
      "initialCapacityAh",
      "Initial capacity must be finite and positive.",
    );
  if (!(
    Number.isFinite(input.currentCapacityAh) &&
    input.currentCapacityAh >= 0 &&
    input.currentCapacityAh <= input.initialCapacityAh
  ))
    simpleError(
      "currentCapacityAh",
      "Current capacity must lie between zero and initial capacity.",
    );
  const capacityFadePercent =
    (100 * (input.initialCapacityAh - input.currentCapacityAh)) /
    input.initialCapacityAh;
  if (!Number.isFinite(capacityFadePercent))
    simpleError(
      "capacityFadePercent",
      "The inputs produce a non-finite percentage.",
    );
  return { capacityFadePercent };
};

export const example = {
  input: { initialCapacityAh: 100, currentCapacityAh: 80 },
  output: { capacityFadePercent: 20 },
} satisfies ToolExample<BatteryCapacityFadeInput, BatteryCapacityFadeOutput>;

export const tool = createSimpleTool({
  id: "electronics/battery-capacity-fade",
  title: "Battery Capacity Fade",
  description:
    "Calculate capacity loss as a percentage of initial battery capacity, using measurements at comparable discharge rate and temperature.",
  inputs: [
    {
      id: "initialCapacityAh",
      kind: "number",
      label: "Initial capacity",
      unit: "Ah",
      minimum: 0,
    },
    {
      id: "currentCapacityAh",
      kind: "number",
      label: "Current capacity",
      unit: "Ah",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "capacityFadePercent",
      kind: "number",
      label: "Capacity fade",
      unit: "%",
    },
  ],
  calculate: (input) =>
    calculateBatteryCapacityFade({
      initialCapacityAh: input.initialCapacityAh as number,
      currentCapacityAh: input.currentCapacityAh as number,
    }),
});
export const batteryCapacityFadeTool = tool;
export const runBatteryCapacityFade = tool.execute;
export default tool;

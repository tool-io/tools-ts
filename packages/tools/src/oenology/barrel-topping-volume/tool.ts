import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type BarrelToppingVolumeInput = {
  readonly barrelCount: number;
  readonly millilitersPerBarrelPerWeek: number;
  readonly weeks: number;
};

export type BarrelToppingVolumeOutput = {
  readonly toppingLiters: number;
};

export const barrelToppingVolumeExample = {
  input: {
    barrelCount: 20,
    millilitersPerBarrelPerWeek: 50,
    weeks: 4,
  },
  output: {
    toppingLiters: 4,
  },
} satisfies ToolExample<BarrelToppingVolumeInput, BarrelToppingVolumeOutput>;

export const calculateBarrelToppingVolume = (
  input: BarrelToppingVolumeInput,
): BarrelToppingVolumeOutput => {
  if (input.barrelCount < 0)
    simpleError(
      "barrelCount",
      "The barrel count cannot be negative.",
      "invalid_value",
    );
  return {
    toppingLiters: roundStatistic(
      (input.barrelCount * input.millilitersPerBarrelPerWeek * input.weeks) /
        1000,
    ),
  };
};

export const barrelToppingVolumeTool = createSimpleTool({
  calculate: (input) =>
    calculateBarrelToppingVolume(input as unknown as BarrelToppingVolumeInput),
  description:
    "Plan the topping wine needed for a barrel group over the coming interval.",
  id: "oenology/barrel-topping-volume",
  inputs: [
    {
      description: "Barrels in the topping program.",
      id: "barrelCount",
      kind: "integer",
      label: "Barrels",
      maximum: 100000,
      minimum: 0,
    },
    {
      description: "Planning allowance of topping wine per barrel per week.",
      id: "millilitersPerBarrelPerWeek",
      kind: "number",
      label: "Allowance per barrel",
      minimum: 0,
      unit: "mL/wk",
    },
    {
      description: "Weeks between topping rounds.",
      id: "weeks",
      kind: "number",
      label: "Weeks",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Topping wine to keep ready for the interval.",
      id: "toppingLiters",
      kind: "number",
      label: "Topping volume",
      unit: "L",
    },
  ],
  title: "Barrel Topping Volume Calculator",
});
export const runBarrelToppingVolume = barrelToppingVolumeTool.execute;
export default barrelToppingVolumeTool;

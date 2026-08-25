import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type MultiTankWeightedAbvInput = {
  readonly tankAbvPercents: readonly number[];
  readonly tankVolumesLiters: readonly number[];
};

export type MultiTankWeightedAbvOutput = {
  readonly weightedAbvPercent: number;
};

export const multiTankWeightedAbvExample = {
  input: {
    tankAbvPercents: [13, 14],
    tankVolumesLiters: [500, 700],
  },
  output: {
    weightedAbvPercent: 13.5833333333,
  },
} satisfies ToolExample<MultiTankWeightedAbvInput, MultiTankWeightedAbvOutput>;

export const calculateMultiTankWeightedAbv = (
  input: MultiTankWeightedAbvInput,
): MultiTankWeightedAbvOutput => {
  if (input.tankAbvPercents.length !== input.tankVolumesLiters.length)
    simpleError(
      "tankVolumesLiters",
      "Every tank needs both an alcohol value and a volume.",
      "length_mismatch",
    );
  if (input.tankAbvPercents.length === 0)
    simpleError(
      "tankAbvPercents",
      "At least one tank is required.",
      "invalid_value",
    );
  let alcoholVolume = 0;
  let totalVolume = 0;
  for (let index = 0; index < input.tankVolumesLiters.length; index += 1) {
    if (input.tankAbvPercents[index] < 0 || input.tankAbvPercents[index] > 100)
      simpleError(
        "tankAbvPercents",
        "Every tank ABV must be between zero and one hundred percent.",
        "invalid_value",
      );
    if (input.tankVolumesLiters[index] < 0)
      simpleError(
        "tankVolumesLiters",
        "Tank volumes cannot be negative.",
        "invalid_value",
      );
    totalVolume += input.tankVolumesLiters[index];
    alcoholVolume +=
      input.tankVolumesLiters[index] * input.tankAbvPercents[index];
  }
  if (totalVolume <= 0)
    simpleError(
      "tankVolumesLiters",
      "The combined tank volume must be positive.",
      "invalid_value",
    );
  return {
    weightedAbvPercent: roundStatistic(alcoholVolume / totalVolume),
  };
};

export const multiTankWeightedAbvTool = createSimpleTool({
  calculate: (input) =>
    calculateMultiTankWeightedAbv(
      input as unknown as MultiTankWeightedAbvInput,
    ),
  description:
    "Compute the volume-weighted alcohol of a blend across any number of tanks.",
  id: "oenology/multi-tank-weighted-abv",
  inputs: [
    {
      description: "Alcohol by volume of each tank.",
      id: "tankAbvPercents",
      kind: "numberList",
      label: "Tank ABV values",
      unit: "%",
    },
    {
      description: "Volume of each tank aligned with the ABV list.",
      id: "tankVolumesLiters",
      kind: "numberList",
      label: "Tank volumes",
      unit: "L",
    },
  ],
  outputs: [
    {
      description: "Volume-weighted alcohol of the combined lot.",
      id: "weightedAbvPercent",
      kind: "number",
      label: "Weighted ABV",
      unit: "%",
    },
  ],
  title: "Multi-Tank Volume Weighted ABV Calculator",
});
export const runMultiTankWeightedAbv = multiTankWeightedAbvTool.execute;
export default multiTankWeightedAbvTool;

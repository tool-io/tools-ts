import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type PotentialAlcoholFromBrixInput = {
  readonly abvPercentPerBrix: number;
  readonly brix: number;
};

export type PotentialAlcoholFromBrixOutput = {
  readonly potentialAlcoholPercent: number;
};

export const potentialAlcoholFromBrixExample = {
  input: {
    abvPercentPerBrix: 0.59,
    brix: 21,
  },
  output: {
    potentialAlcoholPercent: 12.39,
  },
} satisfies ToolExample<
  PotentialAlcoholFromBrixInput,
  PotentialAlcoholFromBrixOutput
>;

export const calculatePotentialAlcoholFromBrix = (
  input: PotentialAlcoholFromBrixInput,
): PotentialAlcoholFromBrixOutput => {
  return {
    potentialAlcoholPercent: roundStatistic(
      input.brix * input.abvPercentPerBrix,
    ),
  };
};

export const potentialAlcoholFromBrixTool = createSimpleTool({
  calculate: (input) =>
    calculatePotentialAlcoholFromBrix(
      input as unknown as PotentialAlcoholFromBrixInput,
    ),
  description:
    "Estimate potential alcohol from Brix using a caller-selected conversion factor appropriate to the fermentation assumptions; residual sugar and conversion efficiency can change actual ABV.",
  id: "oenology/potential-alcohol-brix",
  inputs: [
    {
      description:
        "Potential ABV percentage points assigned to each degree Brix.",
      id: "abvPercentPerBrix",
      kind: "number",
      label: "ABV per Brix",
      minimum: 0.000001,
    },
    {
      description: "Dissolved sugar concentration in degrees Brix.",
      id: "brix",
      label: "Brix",
      kind: "number",
      maximum: 100,
      minimum: 0,
      unit: "°Bx",
    },
  ],
  outputs: [
    {
      description: "Estimated alcohol by volume after full fermentation.",
      id: "potentialAlcoholPercent",
      kind: "number",
      label: "Potential alcohol",
      unit: "%",
    },
  ],
  title: "Potential Alcohol from Brix Calculator",
});
export const runPotentialAlcoholFromBrix = potentialAlcoholFromBrixTool.execute;
export default potentialAlcoholFromBrixTool;

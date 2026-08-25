import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type PotentialAlcoholFromSgInput = {
  readonly abvPercentPerBrix: number;
  readonly specificGravity: number;
};

export type PotentialAlcoholFromSgOutput = {
  readonly potentialAlcoholPercent: number;
};

export const potentialAlcoholFromSgExample = {
  input: {
    abvPercentPerBrix: 0.59,
    specificGravity: 1.083,
  },
  output: {
    potentialAlcoholPercent: 11.8020596493,
  },
} satisfies ToolExample<
  PotentialAlcoholFromSgInput,
  PotentialAlcoholFromSgOutput
>;

export const calculatePotentialAlcoholFromSg = (
  input: PotentialAlcoholFromSgInput,
): PotentialAlcoholFromSgOutput => {
  const densityDelta = input.specificGravity - 1;
  const brix = (densityDelta * 258.6) / (1 + (densityDelta * 227.1) / 258.2);
  return {
    potentialAlcoholPercent: roundStatistic(brix * input.abvPercentPerBrix),
  };
};

export const potentialAlcoholFromSgTool = createSimpleTool({
  calculate: (input) =>
    calculatePotentialAlcoholFromSg(
      input as unknown as PotentialAlcoholFromSgInput,
    ),
  description:
    "Convert must specific gravity to approximate Brix and then potential alcohol with a caller-selected ABV-per-Brix factor; residual sugar and fermentation efficiency can change actual ABV.",
  id: "oenology/potential-alcohol-sg",
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
      description: "Specific gravity of the must.",
      id: "specificGravity",
      label: "Specific gravity",
      kind: "number",
      minimum: 1,
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
  title: "Potential Alcohol from SG Calculator",
});
export const runPotentialAlcoholFromSg = potentialAlcoholFromSgTool.execute;
export default potentialAlcoholFromSgTool;

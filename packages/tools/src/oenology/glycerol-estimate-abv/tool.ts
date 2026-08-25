import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type GlycerolEstimateAbvInput = {
  readonly abvPercent: number;
  readonly glycerolGPerLPerAbvPoint: number;
};

export type GlycerolEstimateAbvOutput = {
  readonly glycerolGPerL: number;
};

export const glycerolEstimateAbvExample = {
  input: {
    abvPercent: 13,
    glycerolGPerLPerAbvPoint: 0.5,
  },
  output: {
    glycerolGPerL: 6.5,
  },
} satisfies ToolExample<GlycerolEstimateAbvInput, GlycerolEstimateAbvOutput>;

export const calculateGlycerolEstimate = (
  input: GlycerolEstimateAbvInput,
): GlycerolEstimateAbvOutput => {
  return {
    glycerolGPerL: roundStatistic(
      input.abvPercent * input.glycerolGPerLPerAbvPoint,
    ),
  };
};

export const glycerolEstimateAbvTool = createSimpleTool({
  calculate: (input) =>
    calculateGlycerolEstimate(input as unknown as GlycerolEstimateAbvInput),
  description:
    "Create a scenario estimate by multiplying ABV by a caller-supplied glycerol-per-ABV factor calibrated for the fermentation; ABV alone cannot determine glycerol concentration.",
  id: "oenology/glycerol-estimate-abv",
  inputs: [
    {
      description: "Alcohol by volume of the finished wine.",
      id: "abvPercent",
      kind: "number",
      label: "ABV",
      maximum: 100,
      minimum: 0,
      unit: "%",
    },
    {
      description:
        "Calibrated glycerol concentration per ABV percentage point.",
      id: "glycerolGPerLPerAbvPoint",
      kind: "number",
      label: "Glycerol factor",
      minimum: 0,
      unit: "(g/L)/% ABV",
    },
  ],
  outputs: [
    {
      description: "Estimated glycerol concentration of the wine.",
      id: "glycerolGPerL",
      kind: "number",
      label: "Glycerol",
      unit: "g/L",
    },
  ],
  title: "Calibrated Glycerol Estimate from ABV Calculator",
});
export const runGlycerolEstimateAbv = glycerolEstimateAbvTool.execute;
export default glycerolEstimateAbvTool;

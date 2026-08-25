import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type H2o2So2ReductionInput = {
  readonly solutionStrengthPercent: number;
  readonly volumeLiters: number;
  readonly so2ToReduceMgPerL: number;
};

export type H2o2So2ReductionOutput = {
  readonly hydrogenPeroxideMl: number;
};

export const h2o2So2ReductionExample = {
  input: {
    solutionStrengthPercent: 1,
    volumeLiters: 100,
    so2ToReduceMgPerL: 20,
  },
  output: {
    hydrogenPeroxideMl: 106.2,
  },
} satisfies ToolExample<H2o2So2ReductionInput, H2o2So2ReductionOutput>;

const H2O2_PER_SO2_MASS_RATIO = 0.531;

export const calculateH2o2So2Reduction = (
  input: H2o2So2ReductionInput,
): H2o2So2ReductionOutput => {
  const strengthPercent = input.solutionStrengthPercent;
  if (strengthPercent <= 0)
    simpleError(
      "solutionStrengthPercent",
      "The solution strength must be positive.",
      "invalid_value",
    );
  const so2Milligrams = input.so2ToReduceMgPerL * input.volumeLiters;
  const h2o2Milligrams = so2Milligrams * H2O2_PER_SO2_MASS_RATIO;
  const milligramsPerMl = strengthPercent * 10;
  return {
    hydrogenPeroxideMl: roundStatistic(h2o2Milligrams / milligramsPerMl),
  };
};

export const h2o2So2ReductionTool = createSimpleTool({
  calculate: (input) =>
    calculateH2o2So2Reduction(input as unknown as H2o2So2ReductionInput),
  description:
    "Calculate the theoretical hydrogen-peroxide solution volume for a 1:1 molar reaction with a specified SO2 mass; actual wine treatment requires controlled trials, analysis, and regulatory review.",
  id: "oenology/h2o2-so2-reduction",
  inputs: [
    {
      description: "Weight-volume strength of the hydrogen peroxide solution.",
      id: "solutionStrengthPercent",
      kind: "number",
      label: "Solution strength",
      minimum: 0,
      unit: "%",
    },
    {
      description: "Volume of wine to treat.",
      id: "volumeLiters",
      kind: "number",
      label: "Volume",
      minimum: 0,
      unit: "L",
    },
    {
      description: "Amount of free SO2 to remove from each liter.",
      id: "so2ToReduceMgPerL",
      kind: "number",
      label: "SO2 to reduce",
      minimum: 0,
      unit: "mg/L",
    },
  ],
  outputs: [
    {
      description: "Theoretical hydrogen peroxide solution volume.",
      id: "hydrogenPeroxideMl",
      kind: "number",
      label: "Hydrogen peroxide",
      unit: "mL",
    },
  ],
  title: "H2O2 SO2 Reduction Dose Calculator",
});
export const runH2o2So2Reduction = h2o2So2ReductionTool.execute;
export default h2o2So2ReductionTool;

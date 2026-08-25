import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type Cuso4H2sTrialDoseInput = {
  readonly h2sMgPerL: number;
  readonly solutionStrengthPercent: number;
};

export type Cuso4H2sTrialDoseOutput = {
  readonly trialDoseMlPerL: number;
};

export const cuso4H2sTrialDoseExample = {
  input: {
    h2sMgPerL: 1,
    solutionStrengthPercent: 1,
  },
  output: {
    trialDoseMlPerL: 0.732629107981,
  },
} satisfies ToolExample<Cuso4H2sTrialDoseInput, Cuso4H2sTrialDoseOutput>;

const CUSO4_MG_PER_H2S_MG = 249.68 / 34.08;

export const calculateCuso4TrialDose = (
  input: Cuso4H2sTrialDoseInput,
): Cuso4H2sTrialDoseOutput => {
  const strength = input.solutionStrengthPercent;
  if (strength <= 0)
    simpleError(
      "solutionStrengthPercent",
      "The solution strength must be positive.",
      "invalid_value",
    );
  const saltMgPerL = input.h2sMgPerL * CUSO4_MG_PER_H2S_MG;
  return {
    trialDoseMlPerL: roundStatistic(saltMgPerL / (strength * 10)),
  };
};

export const cuso4H2sTrialDoseTool = createSimpleTool({
  calculate: (input) =>
    calculateCuso4TrialDose(input as unknown as Cuso4H2sTrialDoseInput),
  description:
    "Compute the theoretical stoichiometric copper sulfate trial dose for a measured hydrogen sulfide level; bench trials should start well below it.",
  id: "oenology/cuso4-h2s-trial-dose",
  inputs: [
    {
      description: "Hydrogen sulfide to bind with copper.",
      id: "h2sMgPerL",
      kind: "number",
      label: "H2S",
      minimum: 0,
      unit: "mg/L",
    },
    {
      description:
        "Weight-volume strength of the copper sulfate pentahydrate solution.",
      id: "solutionStrengthPercent",
      kind: "number",
      label: "Solution strength",
      minimum: 0,
      unit: "%",
    },
  ],
  outputs: [
    {
      description:
        "Stoichiometric solution dose per liter of wine for the full H2S load.",
      id: "trialDoseMlPerL",
      kind: "number",
      label: "Trial dose",
      unit: "mL/L",
    },
  ],
  title: "Hydrogen Sulfide Copper Sulfate Trial Dose Calculator",
});
export const runCuso4H2sTrialDose = cuso4H2sTrialDoseTool.execute;
export default cuso4H2sTrialDoseTool;

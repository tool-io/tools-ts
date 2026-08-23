import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type UddFractionalSurvivalInput = {
  readonly annualDeathProbability: number;
  readonly fractionOfYears: number;
};

export type UddFractionalSurvivalOutput = {
  readonly fractionalSurvivalProbability: number;
};

export const uddFractionalSurvivalExample = {
  input: {
    annualDeathProbability: 0.5,
    fractionOfYears: 0.5,
  },
  output: {
    fractionalSurvivalProbability: 0.75,
  },
} satisfies ToolExample<
  UddFractionalSurvivalInput,
  UddFractionalSurvivalOutput
>;

export const calculateUddFractionalSurvival = (
  input: UddFractionalSurvivalInput,
): UddFractionalSurvivalOutput => {
  return {
    fractionalSurvivalProbability: roundStatistic(
      1 - input.fractionOfYears * input.annualDeathProbability,
    ),
  };
};

export const uddFractionalSurvivalTool = createSimpleTool({
  calculate: (input) =>
    calculateUddFractionalSurvival(
      input as unknown as UddFractionalSurvivalInput,
    ),
  description:
    "Interpolate survival within the year under the uniform distribution of deaths assumption.",
  id: "actuarial/udd-fractional-survival",
  inputs: [
    {
      description: "Probability of dying within the full year.",
      id: "annualDeathProbability",
      kind: "number",
      label: "Annual death probability",
      maximum: 1,
      minimum: 0,
    },
    {
      description: "Elapsed fraction of the year, between zero and one.",
      id: "fractionOfYears",
      kind: "number",
      label: "Fraction of years",
      maximum: 1,
      minimum: 0,
    },
  ],
  outputs: [
    {
      description:
        "Probability of surviving to the fractional point within the year.",
      id: "fractionalSurvivalProbability",
      kind: "number",
      label: "Fractional survival probability",
    },
  ],
  title: "UDD Fractional Survival Calculator",
});
export const runUddFractionalSurvival = uddFractionalSurvivalTool.execute;
export default uddFractionalSurvivalTool;

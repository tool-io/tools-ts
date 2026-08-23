import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ConstantForceFractionalSurvivalInput = {
  readonly annualDeathProbability: number;
  readonly fractionOfYears: number;
};

export type ConstantForceFractionalSurvivalOutput = {
  readonly fractionalSurvivalProbability: number;
};

export const constantForceFractionalSurvivalExample = {
  input: {
    annualDeathProbability: 0.75,
    fractionOfYears: 0.5,
  },
  output: {
    fractionalSurvivalProbability: 0.5,
  },
} satisfies ToolExample<
  ConstantForceFractionalSurvivalInput,
  ConstantForceFractionalSurvivalOutput
>;

export const calculateConstantForceFractionalSurvival = (
  input: ConstantForceFractionalSurvivalInput,
): ConstantForceFractionalSurvivalOutput => {
  if (input.annualDeathProbability < 0 || input.annualDeathProbability > 1)
    simpleError(
      "annualDeathProbability",
      "Annual death probability must be between zero and one.",
      "invalid_probability",
    );
  if (input.fractionOfYears < 0 || input.fractionOfYears > 1)
    simpleError(
      "fractionOfYears",
      "The elapsed fraction must be between zero and one.",
      "invalid_fraction",
    );
  if (input.fractionOfYears === 0) return { fractionalSurvivalProbability: 1 };
  if (input.annualDeathProbability === 1 && input.fractionOfYears < 1)
    return { fractionalSurvivalProbability: 0 };
  return {
    fractionalSurvivalProbability:
      (1 - input.annualDeathProbability) ** input.fractionOfYears,
  };
};

export const constantForceFractionalSurvivalTool = createSimpleTool({
  calculate: (input) =>
    calculateConstantForceFractionalSurvival({
      annualDeathProbability: input.annualDeathProbability as number,
      fractionOfYears: input.fractionOfYears as number,
    }),
  description:
    "Interpolate survival within the year under a constant force of mortality.",
  id: "actuarial/constant-force-fractional-survival",
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
  title: "Constant Force Fractional Survival Calculator",
});
export const runConstantForceFractionalSurvival =
  constantForceFractionalSurvivalTool.execute;
export default constantForceFractionalSurvivalTool;

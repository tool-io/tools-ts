import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BalducciFractionalSurvivalInput = {
  readonly annualDeathProbability: number;
  readonly fractionOfYears: number;
};

export type BalducciFractionalSurvivalOutput = {
  readonly fractionalSurvivalProbability: number;
};

export const balducciFractionalSurvivalExample = {
  input: {
    annualDeathProbability: 0.5,
    fractionOfYears: 0.5,
  },
  output: {
    fractionalSurvivalProbability: 0.6666666666666666,
  },
} satisfies ToolExample<
  BalducciFractionalSurvivalInput,
  BalducciFractionalSurvivalOutput
>;

export const calculateBalducciFractionalSurvival = (
  input: BalducciFractionalSurvivalInput,
): BalducciFractionalSurvivalOutput => {
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
  const survival = 1 - input.annualDeathProbability;
  return {
    fractionalSurvivalProbability:
      survival /
      (1 - (1 - input.fractionOfYears) * input.annualDeathProbability),
  };
};

export const balducciFractionalSurvivalTool = createSimpleTool({
  calculate: (input) =>
    calculateBalducciFractionalSurvival({
      annualDeathProbability: input.annualDeathProbability as number,
      fractionOfYears: input.fractionOfYears as number,
    }),
  description:
    "Interpolate survival within the year under the Balducci hypothesis of hyperbolic mortality density.",
  id: "actuarial/balducci-fractional-survival",
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
  title: "Balducci Fractional Survival Calculator",
});
export const runBalducciFractionalSurvival =
  balducciFractionalSurvivalTool.execute;
export default balducciFractionalSurvivalTool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CompoundPoissonTotalVarianceInput = {
  readonly claimFrequency: number;
  readonly severitySecondMoment: number;
};

export type CompoundPoissonTotalVarianceOutput = {
  readonly standardDeviation: number;
  readonly totalVariance: number;
};

export const compoundPoissonTotalVarianceExample = {
  input: {
    claimFrequency: 10,
    severitySecondMoment: 2500,
  },
  output: {
    standardDeviation: 158.11388300841898,
    totalVariance: 25000,
  },
} satisfies ToolExample<
  CompoundPoissonTotalVarianceInput,
  CompoundPoissonTotalVarianceOutput
>;

export const calculateCompoundPoissonTotalVariance = (
  input: CompoundPoissonTotalVarianceInput,
): CompoundPoissonTotalVarianceOutput => {
  if (input.claimFrequency < 0)
    simpleError(
      "claimFrequency",
      "Expected claim frequency cannot be negative.",
      "invalid_frequency",
    );
  if (input.severitySecondMoment < 0)
    simpleError(
      "severitySecondMoment",
      "The second moment of severity cannot be negative.",
      "invalid_value",
    );
  const variance = input.claimFrequency * input.severitySecondMoment;
  if (!Number.isFinite(variance))
    simpleError(
      "severitySecondMoment",
      "Aggregate variance is outside the finite numeric range.",
      "result_not_finite",
    );
  return {
    standardDeviation: Math.sqrt(variance),
    totalVariance: variance,
  };
};

export const compoundPoissonTotalVarianceTool = createSimpleTool({
  calculate: (input) =>
    calculateCompoundPoissonTotalVariance({
      claimFrequency: input.claimFrequency as number,
      severitySecondMoment: input.severitySecondMoment as number,
    }),
  description:
    "Calculate the variance of aggregate claims for a compound Poisson model as the claim frequency times the second moment of severity.",
  id: "actuarial/compound-poisson-total-variance",
  inputs: [
    {
      description: "Expected number of claims per period.",
      id: "claimFrequency",
      kind: "number",
      label: "Claim frequency",
      minimum: 0,
    },
    {
      description: "Second raw moment of the single-claim severity.",
      id: "severitySecondMoment",
      kind: "number",
      label: "Severity second moment",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Standard deviation of aggregate claims.",
      id: "standardDeviation",
      kind: "number",
      label: "Standard deviation",
    },
    {
      description: "Variance of aggregate claims.",
      id: "totalVariance",
      kind: "number",
      label: "Total variance",
    },
  ],
  title: "Compound Poisson Total Variance Calculator",
});
export const runCompoundPoissonTotalVariance =
  compoundPoissonTotalVarianceTool.execute;
export default compoundPoissonTotalVarianceTool;

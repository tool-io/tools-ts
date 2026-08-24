import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RequiredContributionInput = {
  readonly targetAmount?: number;
  readonly currentSavings?: number;
  readonly annualRatePercent?: number;
  readonly years?: number;
  readonly contributionsPerYear?: number;
};

export type RequiredContributionOutput = {
  readonly requiredContributionUsd: number;
};

export const calculateRequiredContribution = (
  input: RequiredContributionInput,
): RequiredContributionOutput => {
  const targetAmount = input.targetAmount ?? 50000;
  const currentSavings = input.currentSavings ?? 10000;
  const annualRatePercent = input.annualRatePercent ?? 5;
  const years = input.years ?? 10;
  const periodsPerYear = input.contributionsPerYear ?? 12;
  if (annualRatePercent < 0)
    return simpleError(
      "annualRatePercent",
      "Annual rate percent must not be negative.",
      "invalid_rate",
    );
  if (targetAmount < 0)
    return simpleError(
      "targetAmount",
      "Target amount must not be negative.",
      "invalid_amount",
    );
  if (currentSavings < 0)
    return simpleError(
      "currentSavings",
      "Current savings must not be negative.",
      "invalid_amount",
    );
  const periods = years * periodsPerYear;
  if (!Number.isInteger(years) || years < 1)
    simpleError("years", "Years must be a positive integer.");
  if (!Number.isInteger(periodsPerYear) || periodsPerYear < 1)
    simpleError(
      "contributionsPerYear",
      "Contributions per year must be a positive integer.",
    );
  const periodicRate = annualRatePercent / 100 / periodsPerYear;
  const growthFactor = (1 + periodicRate) ** periods;
  const annuityFactor =
    periodicRate === 0 ? periods : (growthFactor - 1) / periodicRate;
  const requiredContributionUsd =
    (targetAmount - currentSavings * growthFactor) / annuityFactor;
  if (!Number.isFinite(requiredContributionUsd))
    simpleError(
      "annualRatePercent",
      "The required contribution exceeds the numeric range.",
    );
  return { requiredContributionUsd };
};

export const requiredContributionExample = {
  input: {
    targetAmount: 50000,
    currentSavings: 10000,
    annualRatePercent: 5,
    years: 10,
    contributionsPerYear: 12,
  },
  output: {
    requiredContributionUsd: 215.9287276229688,
  },
} satisfies ToolExample<RequiredContributionInput, RequiredContributionOutput>;

export const requiredContributionTool = createSimpleTool({
  id: "finance/required-contribution",
  title: "Required Contribution Calculator",
  description:
    "Periodic contribution needed to reach a savings target from current savings, with ordinary-annuity contributions and periodic compounding.",
  inputs: [
    {
      description: "Savings goal in US dollars.",
      default: 50000,
      id: "targetAmount",
      kind: "number",
      label: "Target amount",
    },
    {
      description: "Existing balance in US dollars.",
      default: 10000,
      id: "currentSavings",
      kind: "number",
      label: "Current savings",
    },
    {
      description: "Nominal annual growth rate in percent.",
      default: 5,
      id: "annualRatePercent",
      kind: "number",
      label: "Annual rate",
    },
    {
      description: "Years until the target date.",
      default: 10,
      id: "years",
      kind: "integer",
      label: "Years",
      minimum: 1,
    },
    {
      description: "Contributions made each year.",
      default: 12,
      id: "contributionsPerYear",
      kind: "integer",
      label: "Contributions per year",
      minimum: 1,
    },
  ],
  outputs: [
    {
      description:
        "Contribution per period in US dollars; negative means current savings already exceed the target.",
      id: "requiredContributionUsd",
      kind: "number",
      label: "Required contribution",
    },
  ],
  calculate: (input) =>
    calculateRequiredContribution({
      annualRatePercent: input.annualRatePercent as number,
      contributionsPerYear: input.contributionsPerYear as number,
      currentSavings: input.currentSavings as number,
      targetAmount: input.targetAmount as number,
      years: input.years as number,
    }),
});

export const runRequiredContribution = requiredContributionTool.execute;
export default requiredContributionTool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type StableAgeDistributionProportionInput = {
  readonly growthRateR: number;
  readonly ages: readonly number[];
  readonly weights: readonly number[];
};

export type StableAgeDistributionProportionOutput = {
  readonly proportions: number[];
  readonly meanAge: number;
};

export const calculateStableAgeDistributionProportion = (
  input: StableAgeDistributionProportionInput,
): StableAgeDistributionProportionOutput => {
  const ages = input.ages;
  const weights = input.weights;
  if (!Number.isFinite(input.growthRateR))
    simpleError(
      "growthRateR",
      "The intrinsic growth rate must be finite.",
      "invalid_rate",
    );
  if (ages.length === 0)
    simpleError("ages", "Provide at least one age.", "invalid_list");
  if (ages.length !== weights.length)
    simpleError(
      "weights",
      "The weight list must align with the age list.",
      "invalid_list",
    );
  for (const value of ages)
    if (!(typeof value === "number" && Number.isFinite(value) && value >= 0))
      simpleError(
        "ages",
        "Ages must be finite and non-negative.",
        "invalid_list",
      );
  for (const value of weights)
    if (!(typeof value === "number" && Number.isFinite(value) && value >= 0))
      simpleError(
        "weights",
        "Weights must be finite and non-negative.",
        "invalid_list",
      );
  const scaled = ages.map(
    (age, index) => Math.exp(-input.growthRateR * age) * weights[index]!,
  );
  let total = 0;
  for (const value of scaled) total += value;
  if (!(total > 0))
    simpleError(
      "weights",
      "The weighted sum must be positive to normalize.",
      "invalid_list",
    );
  const proportions = scaled.map((value) => value / total);
  let meanAge = 0;
  for (let index = 0; index < ages.length; index += 1)
    meanAge += proportions[index]! * ages[index]!;
  return { proportions, meanAge };
};

export const stableAgeDistributionProportionExample = {
  input: { growthRateR: 0.01, ages: [0, 30, 60], weights: [1, 1, 1] },
  output: {
    proportions: [0.4367518169107908, 0.32355370388335947, 0.2396944792058498],
    meanAge: 24.08827986885177,
  },
} satisfies ToolExample<
  StableAgeDistributionProportionInput,
  StableAgeDistributionProportionOutput
>;

export const stableAgeDistributionProportionTool = createSimpleTool({
  id: "demography/stable-age-distribution-proportion",
  title: "Stable Age Distribution Proportion Calculator",
  description:
    "Compute the stable-population age composition c(a) proportional to exp(-r a) times the person-year weight at each age, normalized to sum to one, plus its mean age.",
  inputs: [
    {
      description: "Intrinsic annual growth rate r of the stable population.",
      id: "growthRateR",
      kind: "number",
      label: "Growth rate r",
    },
    {
      description: "Age at the start of each group in years.",
      id: "ages",
      kind: "numberList",
      label: "Ages",
    },
    {
      description: "Person-years lived or exposure weight for each group.",
      id: "weights",
      kind: "numberList",
      label: "Weights",
    },
  ],
  outputs: [
    {
      description: "Proportion of the stable population in each group.",
      id: "proportions",
      kind: "numberList",
      label: "c(a)",
    },
    {
      description: "Mean age of the resulting distribution in years.",
      id: "meanAge",
      kind: "number",
      label: "Mean age",
    },
  ],
  calculate: (input) =>
    calculateStableAgeDistributionProportion(
      input as unknown as StableAgeDistributionProportionInput,
    ),
});

export const runStableAgeDistributionProportion =
  stableAgeDistributionProportionTool.execute;
export default stableAgeDistributionProportionTool;

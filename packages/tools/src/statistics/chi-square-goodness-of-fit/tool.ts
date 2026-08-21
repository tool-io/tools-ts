import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { lowerRegularizedGamma } from "../../core/stats.js";
import { roundStatistic } from "../input.js";

export type ChiSquareGoodnessOfFitInput = {
  readonly expectedProbabilities?: readonly number[];
  readonly observed: readonly number[];
  readonly significanceLevel?: number;
};

export type ChiSquareGoodnessOfFitOutput = {
  readonly chiSquare: number;
  readonly degreesOfFreedom: number;
  readonly pValue: number;
  readonly significant: boolean;
};

const PROBABILITY_SUM_TOLERANCE = 1e-9;

export const chiSquareGoodnessOfFitExample = {
  input: { observed: [10, 10, 10, 10, 10, 10] },
  output: {
    chiSquare: 0,
    degreesOfFreedom: 5,
    pValue: 1,
    significant: false,
  },
} satisfies ToolExample<
  ChiSquareGoodnessOfFitInput,
  ChiSquareGoodnessOfFitOutput
>;

export const calculateChiSquareGoodnessOfFit = (
  input: ChiSquareGoodnessOfFitInput,
): ChiSquareGoodnessOfFitOutput => {
  const observed = input.observed as readonly number[];
  const categories = observed.length;
  if (categories < 2)
    simpleError(
      "observed",
      "Provide at least two categories.",
      "insufficient_categories",
    );
  if (!observed.every((count) => Number.isInteger(count) && count >= 0))
    simpleError(
      "observed",
      "Observed counts must be nonnegative integers.",
      "invalid_observed_counts",
    );
  const total = observed.reduce((sum, count) => sum + count, 0);
  if (total <= 0)
    simpleError(
      "observed",
      "Observed counts must sum to a positive total.",
      "empty_observed_counts",
    );
  let expectedCounts: number[];
  if (input.expectedProbabilities === undefined) {
    const uniformCount = total / categories;
    expectedCounts = Array.from({ length: categories }, () => uniformCount);
  } else {
    const provided = input.expectedProbabilities as readonly number[];
    if (provided.length !== categories)
      simpleError(
        "expectedProbabilities",
        "Expected probabilities must match the number of categories.",
        "probability_length_mismatch",
      );
    if (!provided.every((probability) => probability > 0))
      simpleError(
        "expectedProbabilities",
        "Expected probabilities must be positive.",
        "invalid_expected_probabilities",
      );
    const probabilitySum = provided.reduce((sum, probability) => sum + probability, 0);
    if (Math.abs(probabilitySum - 1) > PROBABILITY_SUM_TOLERANCE)
      simpleError(
        "expectedProbabilities",
        "Expected probabilities must sum to one.",
        "invalid_probability_sum",
      );
    expectedCounts = provided.map((probability) => total * probability);
  }
  let chiSquare = 0;
  for (let index = 0; index < categories; index += 1) {
    const expected = expectedCounts[index]!;
    const deviation = observed[index]! - expected;
    chiSquare += (deviation * deviation) / expected;
  }
  const degreesOfFreedom = categories - 1;
  // Survival function of the chi-square distribution: Q(df/2, x/2).
  const rawPValue =
    1 - lowerRegularizedGamma(degreesOfFreedom / 2, chiSquare / 2);
  const pValue = Math.min(1, Math.max(0, rawPValue));
  const significanceLevel = input.significanceLevel ?? 0.05;
  return {
    chiSquare: roundStatistic(chiSquare),
    degreesOfFreedom,
    pValue: roundStatistic(pValue),
    significant: pValue <= significanceLevel,
  };
};

export const chiSquareGoodnessOfFitTool = createSimpleTool({
  calculate: (input) =>
    calculateChiSquareGoodnessOfFit(
      input as unknown as ChiSquareGoodnessOfFitInput,
    ),
  description:
    "Test how well observed category counts fit an expected distribution.",
  id: "statistics/chi-square-goodness-of-fit",
  inputs: [
    {
      description: "Observed count per category.",
      id: "observed",
      kind: "numberList",
      label: "Observed counts",
    },
    {
      description:
        "Probability per category; defaults to a uniform distribution.",
      id: "expectedProbabilities",
      kind: "numberList",
      label: "Expected probabilities",
      required: false,
    },
    {
      default: 0.05,
      description:
        "Significance threshold for rejecting the expected distribution.",
      id: "significanceLevel",
      kind: "number",
      label: "Significance level",
      maximum: 1,
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Chi-square statistic of the sample.",
      id: "chiSquare",
      kind: "number",
      label: "Chi-square statistic",
    },
    {
      description: "Degrees of freedom, one less than the categories.",
      format: "count",
      id: "degreesOfFreedom",
      kind: "integer",
      label: "Degrees of freedom",
    },
    {
      description: "p-value of the goodness-of-fit test.",
      format: "probability",
      id: "pValue",
      kind: "number",
      label: "p-value",
    },
    {
      description: "Whether to reject the expected distribution at the level.",
      id: "significant",
      kind: "boolean",
      label: "Significant",
    },
  ],
  title: "Chi-Square Goodness-of-Fit Calculator",
});
export const runChiSquareGoodnessOfFit = chiSquareGoodnessOfFitTool.execute;
export default chiSquareGoodnessOfFitTool;

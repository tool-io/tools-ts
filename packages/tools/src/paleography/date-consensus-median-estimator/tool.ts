import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DateConsensusMedianEstimatorInput = {
  readonly proposedYears: readonly number[];
};

export type DateConsensusMedianEstimatorOutput = {
  readonly medianYear: number;
  readonly meanYear: number;
  readonly yearSpread: number;
  readonly proposalCount: number;
};

export const calculateDateConsensusMedianEstimator = (
  input: DateConsensusMedianEstimatorInput,
): DateConsensusMedianEstimatorOutput => {
  if (!(Array.isArray(input.proposedYears) && input.proposedYears.length > 0))
    return simpleError(
      "proposedYears",
      "Provide at least one proposed dating year.",
      "invalid_years",
    );
  if (!input.proposedYears.every(Number.isSafeInteger))
    return simpleError(
      "proposedYears",
      "Every proposed year must be a safe integer.",
      "invalid_year",
    );
  const years = [...input.proposedYears].sort((a, b) => a - b);
  const middle = Math.floor(years.length / 2);
  const medianYear =
    years.length % 2 === 1
      ? years[middle]
      : years[middle - 1] / 2 + years[middle] / 2;
  const meanYear = years.reduce(
    (mean, year, index) => mean + (year - mean) / (index + 1),
    0,
  );
  return {
    meanYear,
    medianYear,
    proposalCount: years.length,
    yearSpread: years[years.length - 1] - years[0],
  };
};

export const dateConsensusMedianEstimatorExample = {
  input: { proposedYears: [1120, 1098, 1115] },
  output: {
    meanYear: 1111,
    medianYear: 1115,
    proposalCount: 3,
    yearSpread: 22,
  },
} satisfies ToolExample<
  DateConsensusMedianEstimatorInput,
  DateConsensusMedianEstimatorOutput
>;

export const dateConsensusMedianEstimatorTool = createSimpleTool({
  id: "paleography/date-consensus-median-estimator",
  title: "Date Consensus Median Estimator",
  description:
    "Condense several proposed datings of a manuscript into a consensus by reporting their numeric median (mean of the two central values for even counts), arithmetic mean, spread, and tally.",
  inputs: [
    {
      description: "Proposed dating years in calendar years.",
      id: "proposedYears",
      kind: "numberList",
      label: "Proposed years",
    },
  ],
  outputs: [
    {
      description: "Median of the proposed years after ascending sort.",
      id: "medianYear",
      kind: "number",
      label: "Median year",
    },
    {
      description: "Arithmetic mean of the proposed years.",
      id: "meanYear",
      kind: "number",
      label: "Mean year",
    },
    {
      description: "Newest minus oldest proposed year.",
      id: "yearSpread",
      kind: "number",
      label: "Spread",
    },
    {
      description: "Number of proposals received.",
      id: "proposalCount",
      kind: "integer",
      label: "Proposals",
    },
  ],
  calculate: (input) =>
    calculateDateConsensusMedianEstimator({
      proposedYears: input.proposedYears as readonly number[],
    }),
});

export const runDateConsensusMedianEstimator =
  dateConsensusMedianEstimatorTool.execute;
export default dateConsensusMedianEstimatorTool;

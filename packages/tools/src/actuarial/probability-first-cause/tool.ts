import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type ProbabilityFirstCauseInput = {
  readonly causeIndex: number;
  readonly decrementRates: readonly number[];
};

export type ProbabilityFirstCauseOutput = {
  readonly firstCauseProbability: number;
};

export const probabilityFirstCauseExample = {
  input: {
    causeIndex: 1,
    decrementRates: [0.5, 0.5],
  },
  output: {
    firstCauseProbability: 0.5,
  },
} satisfies ToolExample<
  ProbabilityFirstCauseInput,
  ProbabilityFirstCauseOutput
>;

const hazardFromRate = (rate: number): number => -Math.log(1 - rate);

export const calculateProbabilityFirstCause = (
  input: ProbabilityFirstCauseInput,
): ProbabilityFirstCauseOutput => {
  const index = input.causeIndex - 1;
  if (
    !Number.isSafeInteger(input.causeIndex) ||
    index < 0 ||
    index >= input.decrementRates.length
  )
    simpleError(
      "causeIndex",
      "The cause index must point at an entry in the decrement rates list.",
      "invalid_cause_index",
    );
  for (const rate of input.decrementRates)
    if (!Number.isFinite(rate) || rate < 0 || rate >= 1)
      simpleError(
        "decrementRates",
        "Each decrement rate must stay within the interval from zero to one.",
        "invalid_value",
      );
  let totalHazard = 0;
  for (const rate of input.decrementRates) totalHazard += hazardFromRate(rate);
  if (totalHazard === 0)
    simpleError(
      "decrementRates",
      "At least one decrement must have a positive rate.",
      "invalid_value",
    );
  return {
    firstCauseProbability: roundStatistic(
      hazardFromRate(input.decrementRates[index]) / totalHazard,
    ),
  };
};

export const probabilityFirstCauseTool = createSimpleTool({
  calculate: (input) =>
    calculateProbabilityFirstCause(
      input as unknown as ProbabilityFirstCauseInput,
    ),
  description:
    "Calculate the probability that a given cause of decrement is the first to remove the life, using constant hazards derived from independent annual rates.",
  id: "actuarial/probability-first-cause",
  inputs: [
    {
      description:
        "One-based position of the cause of interest within the decrement rates list.",
      id: "causeIndex",
      kind: "integer",
      label: "Cause index",
      minimum: 1,
    },
    {
      description: "Independent annual decrement rates, one per cause.",
      id: "decrementRates",
      kind: "numberList",
      label: "Decrement rates",
    },
  ],
  outputs: [
    {
      description: "Probability that the selected cause is the first to act.",
      id: "firstCauseProbability",
      kind: "number",
      label: "First cause probability",
    },
  ],
  title: "Probability First Cause Calculator",
});
export const runProbabilityFirstCause = probabilityFirstCauseTool.execute;
export default probabilityFirstCauseTool;

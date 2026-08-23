import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type TotalDecrementRateInput = {
  readonly independentDecrementRates: readonly number[];
};

export type TotalDecrementRateOutput = {
  readonly totalDecrementRate: number;
};

export const totalDecrementRateExample = {
  input: {
    independentDecrementRates: [0.2, 0.1],
  },
  output: {
    totalDecrementRate: 0.28,
  },
} satisfies ToolExample<TotalDecrementRateInput, TotalDecrementRateOutput>;

export const calculateTotalDecrementRate = (
  input: TotalDecrementRateInput,
): TotalDecrementRateOutput => {
  for (const rate of input.independentDecrementRates)
    if (!Number.isFinite(rate) || rate < 0 || rate >= 1)
      simpleError(
        "independentDecrementRates",
        "Each decrement rate must stay within the interval from zero to one.",
        "invalid_value",
      );
  let survival = 1;
  for (const rate of input.independentDecrementRates) survival *= 1 - rate;
  return {
    totalDecrementRate: roundStatistic(1 - survival),
  };
};

export const totalDecrementRateTool = createSimpleTool({
  calculate: (input) =>
    calculateTotalDecrementRate(input as unknown as TotalDecrementRateInput),
  description:
    "Combine independent causes of decrement into the total probability of leaving active status during the year.",
  id: "actuarial/total-decrement-rate",
  inputs: [
    {
      description:
        "Independent annual decrement rates, one per cause of decrement.",
      id: "independentDecrementRates",
      kind: "numberList",
      label: "Independent decrement rates",
    },
  ],
  outputs: [
    {
      description:
        "Probability of leaving active status from any cause during the year.",
      id: "totalDecrementRate",
      kind: "number",
      label: "Total decrement rate",
    },
  ],
  title: "Total Decrement Rate Calculator",
});
export const runTotalDecrementRate = totalDecrementRateTool.execute;
export default totalDecrementRateTool;

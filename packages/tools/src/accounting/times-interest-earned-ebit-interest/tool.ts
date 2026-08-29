import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TimesInterestEarnedInput = {
  readonly operatingIncome: number;
  readonly interestExpense: number;
};

export type TimesInterestEarnedOutput = {
  readonly timesInterestEarned: number;
};

export const timesInterestEarnedExample = {
  input: { interestExpense: 2000, operatingIncome: 43000 },
  output: { timesInterestEarned: 21.5 },
} satisfies ToolExample<TimesInterestEarnedInput, TimesInterestEarnedOutput>;

export const calculateTimesInterestEarned = (
  input: TimesInterestEarnedInput,
): TimesInterestEarnedOutput => {
  if (!Number.isFinite(input.interestExpense) || !(input.interestExpense > 0))
    simpleError(
      "interestExpense",
      "Interest expense must be greater than zero because the coverage ratio is undefined otherwise.",
      "positive_interest_expense_required",
    );
  if (!Number.isFinite(input.operatingIncome))
    simpleError(
      "operatingIncome",
      "Operating income must be finite.",
      "finite_operating_income_required",
    );
  const timesInterestEarned = input.operatingIncome / input.interestExpense;
  if (!Number.isFinite(timesInterestEarned))
    simpleError(
      "operatingIncome",
      "The coverage ratio is outside the finite numeric range.",
      "result_not_finite",
    );
  return {
    timesInterestEarned: timesInterestEarned === 0 ? 0 : timesInterestEarned,
  };
};

export const timesInterestEarnedTool = createSimpleTool({
  calculate: (input) =>
    calculateTimesInterestEarned({
      interestExpense: input.interestExpense as number,
      operatingIncome: input.operatingIncome as number,
    }),
  description:
    "Calculate times interest earned as operating income (EBIT) divided by interest expense, measuring how many times current earnings cover interest obligations.",
  id: "accounting/times-interest-earned-ebit-interest",
  inputs: [
    {
      description:
        "Operating income for the period, equivalent to earnings before interest and taxes.",
      id: "operatingIncome",
      kind: "number",
      label: "Operating income (EBIT)",
    },
    {
      description: "Total interest expense for the same period.",
      id: "interestExpense",
      kind: "number",
      label: "Interest expense",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description:
        "Number of times operating income covers interest expense; higher values indicate stronger debt-service capacity.",
      id: "timesInterestEarned",
      kind: "number",
      label: "Times interest earned",
    },
  ],
  title: "Times Interest Earned Calculator",
});
export const runTimesInterestEarned = timesInterestEarnedTool.execute;
export default timesInterestEarnedTool;

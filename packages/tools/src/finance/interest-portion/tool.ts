import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const interestPortionTool = createSimpleTool({
  id: "finance/interest-portion",
  title: "Interest Portion Calculator",
  description:
    "Calculate the interest portion of the next loan payment from the outstanding balance.",
  inputs: [
    { id: "balance", label: "Outstanding balance", kind: "number", minimum: 0 },
    {
      id: "annualRatePercent",
      label: "Annual rate",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
    {
      default: 12,
      description: "Number of payments per year.",
      id: "paymentsPerYear",
      label: "Payments per year",
      kind: "number",
    },
  ],
  outputs: [{ id: "interest", label: "Interest portion", kind: "number" }],
  calculate: (input) => {
    const paymentsPerYear = input.paymentsPerYear as number;
    if (paymentsPerYear <= 0)
      simpleError(
        "paymentsPerYear",
        "Payments per year must be greater than zero.",
        "invalid_payments_per_year",
      );
    return {
      interest:
        ((input.balance as number) *
          ((input.annualRatePercent as number) / 100)) /
        paymentsPerYear,
    };
  },
});
export const runInterestPortion = interestPortionTool.execute;
export default interestPortionTool;

export type InterestPortionInput = {
  readonly balance: number;
  readonly annualRatePercent: number;
  readonly paymentsPerYear: number;
};

export type InterestPortionOutput = {
  readonly interest: number;
};

export const interestPortionExample = {
  input: { balance: 240_000, annualRatePercent: 6, paymentsPerYear: 12 },
  output: { interest: 1_200 },
} satisfies ToolExample<InterestPortionInput, InterestPortionOutput>;

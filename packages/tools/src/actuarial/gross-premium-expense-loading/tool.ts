import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type GrossPremiumExpenseLoadingInput = {
  readonly fixedExpense?: number;
  readonly netPremium: number;
  readonly variableExpenseRatio?: number;
};

export type GrossPremiumExpenseLoadingOutput = {
  readonly grossPremium: number;
};

export const grossPremiumExpenseLoadingExample = {
  input: {
    fixedExpense: 50,
    netPremium: 800,
    variableExpenseRatio: 0.2,
  },
  output: {
    grossPremium: 1062.5,
  },
} satisfies ToolExample<
  GrossPremiumExpenseLoadingInput,
  GrossPremiumExpenseLoadingOutput
>;

export const calculateGrossPremiumExpenseLoading = (
  input: GrossPremiumExpenseLoadingInput,
): GrossPremiumExpenseLoadingOutput => {
  const fixedExpense = input.fixedExpense ?? 0;
  if (!Number.isFinite(fixedExpense) || fixedExpense < 0)
    simpleError(
      "fixedExpense",
      "The fixed expense must be finite and nonnegative.",
      "invalid_fixed_expense",
    );
  if (!Number.isFinite(input.netPremium) || input.netPremium < 0)
    simpleError(
      "netPremium",
      "The net premium must be finite and nonnegative.",
      "invalid_net_premium",
    );
  const variableExpenseRatio = input.variableExpenseRatio ?? 0;
  if (
    !Number.isFinite(variableExpenseRatio) ||
    variableExpenseRatio < 0 ||
    !(variableExpenseRatio < 1)
  )
    simpleError(
      "variableExpenseRatio",
      "The variable expense ratio must be finite, nonnegative, and below one so a gross premium exists.",
      "invalid_loading",
    );
  const grossPremium =
    (input.netPremium + fixedExpense) / (1 - variableExpenseRatio);
  if (!Number.isFinite(grossPremium))
    simpleError(
      "netPremium",
      "The gross premium is outside the finite numeric range.",
      "result_not_finite",
    );
  return {
    grossPremium,
  };
};

export const grossPremiumExpenseLoadingTool = createSimpleTool({
  calculate: (input) =>
    calculateGrossPremiumExpenseLoading({
      fixedExpense: input.fixedExpense as number,
      netPremium: input.netPremium as number,
      variableExpenseRatio: input.variableExpenseRatio as number,
    }),
  description:
    "Load a net premium with a fixed expense and a variable expense ratio to obtain the gross premium.",
  id: "actuarial/gross-premium-expense-loading",
  inputs: [
    {
      default: 0,
      description: "Flat expense added per premium period.",
      id: "fixedExpense",
      kind: "number",
      label: "Fixed expense",
      minimum: 0,
    },
    {
      description: "Net premium before expense loading.",
      id: "netPremium",
      kind: "number",
      label: "Net premium",
      minimum: 0,
    },
    {
      default: 0,
      description:
        "Fraction of the gross premium consumed by variable expenses; must stay strictly below one.",
      id: "variableExpenseRatio",
      kind: "number",
      label: "Variable expense ratio",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Gross premium covering benefits and expenses.",
      id: "grossPremium",
      kind: "number",
      label: "Gross premium",
    },
  ],
  title: "Gross Premium Expense Loading Calculator",
});
export const runGrossPremiumExpenseLoading =
  grossPremiumExpenseLoadingTool.execute;
export default grossPremiumExpenseLoadingTool;

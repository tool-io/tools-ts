import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type OperatingExpenseRatioInput = Readonly<{
  readonly operatingExpenses: number;
  readonly effectiveGrossIncome: number;
}>;
export type OperatingExpenseRatioOutput = Readonly<{
  readonly expenseRatioPercent: number;
}>;

export const calculateOperatingExpenseRatio = (
  x: OperatingExpenseRatioInput,
): OperatingExpenseRatioOutput => {
  if (!Number.isFinite(x.operatingExpenses) || x.operatingExpenses < 0)
    simpleError("operatingExpenses", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.effectiveGrossIncome) || x.effectiveGrossIncome <= 0)
    simpleError("effectiveGrossIncome", "Provide a finite positive number.");
  const expenseRatioPercent =
    (100 * x.operatingExpenses) / x.effectiveGrossIncome;
  if (!Number.isFinite(expenseRatioPercent))
    simpleError(
      "expenseRatioPercent",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    expenseRatioPercent: Object.is(expenseRatioPercent, -0)
      ? 0
      : expenseRatioPercent,
  };
};

export const example = {
  input: {
    operatingExpenses: 40000,
    effectiveGrossIncome: 100000,
  },
  output: { expenseRatioPercent: 40 },
} satisfies ToolExample<
  OperatingExpenseRatioInput,
  OperatingExpenseRatioOutput
>;

export const tool = createSimpleTool({
  id: "real-estate/operating-expense-ratio",
  title: "Operating Expense Ratio",
  description:
    "Operating expenses as a percentage of effective gross income; excludes debt service.",
  inputs: [
    {
      id: "operatingExpenses",
      kind: "number",
      label: "Operating Expenses",
      unit: "currency",
      minimum: 0,
    },
    {
      id: "effectiveGrossIncome",
      kind: "number",
      label: "Effective Gross Income",
      unit: "currency",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "expenseRatioPercent",
      kind: "number",
      label: "Expense Ratio Percent",
      unit: "percent",
    },
  ],
  calculate: (input) =>
    calculateOperatingExpenseRatio({
      operatingExpenses: input.operatingExpenses as number,
      effectiveGrossIncome: input.effectiveGrossIncome as number,
    }),
});
export const operatingExpenseRatioTool = tool;
export const runOperatingExpenseRatio = tool.execute;
export default tool;

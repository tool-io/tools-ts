import { createSimpleTool, simpleError } from "../../core/simple.js";
export const debtToIncomeRatioTool = createSimpleTool({
  id: "finance/debt-to-income-ratio",
  title: "Debt-to-Income Ratio Calculator",
  description:
    "Calculate monthly debt payments as a percentage of gross monthly income.",
  inputs: [
    { id: "monthlyDebt", label: "Monthly debt", kind: "number", minimum: 0 },
    {
      id: "grossMonthlyIncome",
      label: "Gross monthly income",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "ratio",
      label: "Debt-to-income ratio",
      kind: "number",
      format: "ratio",
    },
    {
      id: "percent",
      label: "Debt-to-income ratio",
      kind: "number",
      format: "percentage",
      unit: "%",
    },
  ],
  calculate: (input) => {
    const income = input.grossMonthlyIncome as number;
    if (income <= 0)
      simpleError(
        "grossMonthlyIncome",
        "Gross monthly income must be positive.",
      );
    const ratio = (input.monthlyDebt as number) / income;
    return { ratio, percent: ratio * 100 };
  },
});
export const runDebtToIncomeRatio = debtToIncomeRatioTool.execute;
export default debtToIncomeRatioTool;

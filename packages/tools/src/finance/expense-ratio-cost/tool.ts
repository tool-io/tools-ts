import { createSimpleTool } from "../../core/simple.js";
export const expenseRatioCostTool = createSimpleTool({
  id: "finance/expense-ratio-cost",
  title: "Expense Ratio Cost Calculator",
  description:
    "Estimate one year of fund expenses from invested assets and an expense ratio.",
  inputs: [
    { id: "assets", label: "Invested assets", kind: "number", minimum: 0 },
    {
      id: "expenseRatioPercent",
      label: "Expense ratio",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
  ],
  outputs: [{ id: "annualCost", label: "Annual cost", kind: "number" }],
  calculate: (input) => {
    return {
      annualCost:
        ((input.assets as number) * (input.expenseRatioPercent as number)) /
        100,
    };
  },
});
export const runExpenseRatioCost = expenseRatioCostTool.execute;
export default expenseRatioCostTool;

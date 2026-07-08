import { createSimpleTool, simpleError } from "../../core/simple.js";
export const profitMarginTool = createSimpleTool({
  id: "finance/profit-margin",
  title: "Profit Margin Calculator",
  description:
    "Calculate profit and profit margin percentage from revenue and total cost.",
  inputs: [
    { id: "revenue", label: "Revenue", kind: "number" },
    { id: "cost", label: "Cost", kind: "number" },
  ],
  outputs: [
    { id: "profit", label: "Profit", kind: "number" },
    {
      id: "profitMarginPercent",
      label: "Profit margin",
      kind: "number",
      unit: "%",
    },
  ],
  calculate: (input) => {
    const revenue = input.revenue as number;
    if (revenue === 0) simpleError("revenue", "Revenue must not be zero.");
    const profit = revenue - (input.cost as number);
    return { profit, profitMarginPercent: (profit / revenue) * 100 };
  },
});
export const runProfitMargin = profitMarginTool.execute;
export default profitMarginTool;

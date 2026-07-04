import { createSimpleTool, simpleError } from "../../core/simple.js";
export const grossMarginTool = createSimpleTool({
  id: "finance/gross-margin",
  title: "Gross Margin Calculator",
  description:
    "Calculate gross profit and gross margin percentage from revenue and cost of goods sold.",
  inputs: [
    { id: "revenue", label: "Revenue", kind: "number" },
    { id: "costOfGoodsSold", label: "Cost of goods sold", kind: "number" },
  ],
  outputs: [
    { id: "grossProfit", label: "Gross profit", kind: "number" },
    {
      id: "grossMarginPercent",
      label: "Gross margin",
      kind: "number",
      unit: "%",
    },
  ],
  calculate: (input) => {
    const revenue = input.revenue as number;
    if (revenue === 0) simpleError("revenue", "Revenue must not be zero.");
    const grossProfit = revenue - (input.costOfGoodsSold as number);
    return { grossProfit, grossMarginPercent: (grossProfit / revenue) * 100 };
  },
});
export const runGrossMargin = grossMarginTool.execute;
export default grossMarginTool;

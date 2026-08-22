import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type GrossProfitAmountInput = {
  readonly revenue: number;
  readonly costOfGoodsSold: number;
};

export type GrossProfitAmountOutput = {
  readonly grossProfit: number;
};

export const grossProfitAmountExample = {
  input: { revenue: 1200, costOfGoodsSold: 800 },
  output: { grossProfit: 400 },
} satisfies ToolExample<GrossProfitAmountInput, GrossProfitAmountOutput>;

export const calculateGrossProfitAmount = (
  input: GrossProfitAmountInput,
): GrossProfitAmountOutput => ({
  grossProfit: input.revenue - input.costOfGoodsSold,
});

export const grossProfitAmountTool = createSimpleTool({
  calculate: (input) =>
    calculateGrossProfitAmount(input as unknown as GrossProfitAmountInput),
  description:
    "Calculate gross profit as revenue minus the cost of goods sold.",
  id: "finance/gross-profit-amount",
  inputs: [
    {
      description: "Total sales revenue for the period.",
      id: "revenue",
      kind: "number",
      label: "Revenue",
      unit: "currency",
    },
    {
      description: "Direct cost of producing the sold goods or services.",
      id: "costOfGoodsSold",
      kind: "number",
      label: "Cost of goods sold",
      unit: "currency",
    },
  ],
  outputs: [
    {
      description: "Revenue remaining after cost of goods sold.",
      id: "grossProfit",
      kind: "number",
      label: "Gross profit",
      unit: "currency",
    },
  ],
  title: "Gross Profit Amount Calculator",
});
export const runGrossProfitAmount = grossProfitAmountTool.execute;
export default grossProfitAmountTool;

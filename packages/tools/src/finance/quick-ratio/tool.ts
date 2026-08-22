import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type QuickRatioInput = {
  readonly cash: number;
  readonly marketableSecurities: number;
  readonly receivables: number;
  readonly currentLiabilities: number;
};

export type QuickRatioOutput = {
  readonly quickRatio: number;
};

export const quickRatioExample = {
  input: {
    cash: 40000,
    marketableSecurities: 25000,
    receivables: 35000,
    currentLiabilities: 50000,
  },
  output: { quickRatio: 2 },
} satisfies ToolExample<QuickRatioInput, QuickRatioOutput>;

export const calculateQuickRatio = (
  input: QuickRatioInput,
): QuickRatioOutput => {
  const { cash, marketableSecurities, receivables, currentLiabilities } = input;
  if (currentLiabilities === 0)
    simpleError(
      "currentLiabilities",
      "Current liabilities must not be zero.",
      "invalid_current_liabilities",
    );
  return {
    quickRatio:
      (cash + marketableSecurities + receivables) / currentLiabilities,
  };
};

export const quickRatioTool = createSimpleTool({
  calculate: (input) =>
    calculateQuickRatio(input as unknown as QuickRatioInput),
  description:
    "Calculate the quick ratio as cash, marketable securities, and receivables divided by current liabilities.",
  id: "finance/quick-ratio",
  inputs: [
    {
      description: "Cash and cash equivalents on hand.",
      id: "cash",
      kind: "number",
      label: "Cash and cash equivalents",
      unit: "currency",
    },
    {
      description: "Investments readily sellable at market value.",
      id: "marketableSecurities",
      kind: "number",
      label: "Marketable securities",
      unit: "currency",
    },
    {
      description: "Money owed by customers for sales on credit.",
      id: "receivables",
      kind: "number",
      label: "Accounts receivable",
      unit: "currency",
    },
    {
      description: "Total obligations due within one year.",
      id: "currentLiabilities",
      kind: "number",
      label: "Current liabilities",
      unit: "currency",
    },
  ],
  outputs: [
    {
      description: "Liquid assets per unit of current liabilities.",
      format: "ratio",
      id: "quickRatio",
      kind: "number",
      label: "Quick ratio",
    },
  ],
  title: "Quick Ratio Calculator",
});
export const runQuickRatio = quickRatioTool.execute;
export default quickRatioTool;

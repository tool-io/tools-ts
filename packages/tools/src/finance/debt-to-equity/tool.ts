import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DebtToEquityInput = {
  readonly totalDebt: number;
  readonly shareholdersEquity: number;
};

export type DebtToEquityOutput = {
  readonly debtToEquity: number;
};

export const debtToEquityExample = {
  input: { totalDebt: 300000, shareholdersEquity: 600000 },
  output: { debtToEquity: 0.5 },
} satisfies ToolExample<DebtToEquityInput, DebtToEquityOutput>;

export const calculateDebtToEquity = (
  input: DebtToEquityInput,
): DebtToEquityOutput => {
  const { totalDebt, shareholdersEquity } = input;
  if (shareholdersEquity === 0)
    simpleError(
      "shareholdersEquity",
      "Shareholders' equity must not be zero.",
      "invalid_shareholders_equity",
    );
  return { debtToEquity: totalDebt / shareholdersEquity };
};

export const debtToEquityTool = createSimpleTool({
  calculate: (input) =>
    calculateDebtToEquity(input as unknown as DebtToEquityInput),
  description:
    "Calculate leverage as total debt divided by shareholders' equity.",
  id: "finance/debt-to-equity",
  inputs: [
    {
      description: "Total interest-bearing debt outstanding.",
      id: "totalDebt",
      kind: "number",
      label: "Total debt",
      unit: "currency",
    },
    {
      description: "Total shareholders' equity.",
      id: "shareholdersEquity",
      kind: "number",
      label: "Shareholders' equity",
      unit: "currency",
    },
  ],
  outputs: [
    {
      description: "Total debt per unit of shareholders' equity.",
      format: "ratio",
      id: "debtToEquity",
      kind: "number",
      label: "Debt-to-equity ratio",
    },
  ],
  title: "Debt to Equity Calculator",
});
export const runDebtToEquity = debtToEquityTool.execute;
export default debtToEquityTool;

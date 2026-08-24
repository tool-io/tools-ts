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
  if (!Number.isFinite(totalDebt) || totalDebt < 0)
    simpleError(
      "totalDebt",
      "Total debt must be a finite non-negative amount.",
      "invalid_total_debt",
    );
  if (!Number.isFinite(shareholdersEquity) || shareholdersEquity === 0)
    simpleError(
      "shareholdersEquity",
      "Shareholders' equity must be finite and nonzero.",
      "invalid_shareholders_equity",
    );
  const debtToEquity = totalDebt / shareholdersEquity;
  if (!Number.isFinite(debtToEquity))
    simpleError(
      "totalDebt",
      "The debt-to-equity ratio exceeds the numeric range.",
      "numeric_range",
    );
  return { debtToEquity };
};

export const debtToEquityTool = createSimpleTool({
  calculate: (input) =>
    calculateDebtToEquity({
      totalDebt: input.totalDebt as number,
      shareholdersEquity: input.shareholdersEquity as number,
    }),
  description:
    "Calculate leverage as total debt divided by shareholders' equity.",
  id: "finance/debt-to-equity",
  inputs: [
    {
      description: "Total interest-bearing debt outstanding.",
      id: "totalDebt",
      kind: "number",
      label: "Total debt",
      minimum: 0,
      unit: "currency",
    },
    {
      description:
        "Total shareholders' equity; negative equity produces a negative ratio whose usual leverage interpretation is not meaningful.",
      id: "shareholdersEquity",
      kind: "number",
      label: "Shareholders' equity",
      unit: "currency",
    },
  ],
  outputs: [
    {
      description:
        "Total debt per unit of shareholders' equity; a negative result reflects negative equity.",
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

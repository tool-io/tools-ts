import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CashOnCashReturnInput = {
  readonly annualPreTaxCashFlowUsd: number;
  readonly totalCashInvestedUsd: number;
};

export type CashOnCashReturnOutput = {
  readonly cashOnCashReturnPercent: number;
};

export const calculateCashOnCashReturn = (
  input: CashOnCashReturnInput,
): CashOnCashReturnOutput => {
  if (!(input.totalCashInvestedUsd > 0))
    return simpleError(
      "totalCashInvestedUsd",
      "Total cash invested must be greater than zero.",
      "invalid_value",
    );
  return {
    cashOnCashReturnPercent:
      (input.annualPreTaxCashFlowUsd / input.totalCashInvestedUsd) * 100,
  };
};

export const cashOnCashReturnExample = {
  input: { annualPreTaxCashFlowUsd: 36000, totalCashInvestedUsd: 450000 },
  output: { cashOnCashReturnPercent: 8 },
} satisfies ToolExample<CashOnCashReturnInput, CashOnCashReturnOutput>;

export const cashOnCashReturnTool = createSimpleTool({
  id: "real-estate/cash-on-cash-return",
  title: "Cash on Cash Return Calculator",
  description:
    "Compute the pre-tax cash-on-cash return from annual pre-tax cash flow and total cash invested.",
  inputs: [
    {
      description: "Annual pre-tax cash flow in US dollars.",
      id: "annualPreTaxCashFlowUsd",
      kind: "number",
      label: "Annual cash flow",
    },
    {
      description:
        "Total cash invested (down payment plus costs) in US dollars.",
      id: "totalCashInvestedUsd",
      kind: "number",
      label: "Cash invested",
    },
  ],
  outputs: [
    {
      description: "Cash-on-cash return in percent per year.",
      id: "cashOnCashReturnPercent",
      kind: "number",
      label: "CoC return",
    },
  ],
  calculate: (input) =>
    calculateCashOnCashReturn({
      annualPreTaxCashFlowUsd: input.annualPreTaxCashFlowUsd as number,
      totalCashInvestedUsd: input.totalCashInvestedUsd as number,
    }),
});

export const runCashOnCashReturn = cashOnCashReturnTool.execute;
export default cashOnCashReturnTool;

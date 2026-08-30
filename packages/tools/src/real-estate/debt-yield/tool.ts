import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DebtYieldInput = Readonly<{
  readonly annualNoi: number;
  readonly loanAmount: number;
}>;
export type DebtYieldOutput = Readonly<{
  readonly debtYieldPercent: number;
}>;

export const calculateDebtYield = (x: DebtYieldInput): DebtYieldOutput => {
  if (!Number.isFinite(x.annualNoi))
    simpleError("annualNoi", "Provide a finite number.");
  if (!Number.isFinite(x.loanAmount) || x.loanAmount <= 0)
    simpleError("loanAmount", "Provide a finite positive number.");
  const debtYieldPercent = (100 * x.annualNoi) / x.loanAmount;
  if (!Number.isFinite(debtYieldPercent))
    simpleError(
      "debtYieldPercent",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    debtYieldPercent: Object.is(debtYieldPercent, -0) ? 0 : debtYieldPercent,
  };
};

export const example = {
  input: {
    annualNoi: 10000,
    loanAmount: 100000,
  },
  output: { debtYieldPercent: 10 },
} satisfies ToolExample<DebtYieldInput, DebtYieldOutput>;

export const tool = createSimpleTool({
  id: "real-estate/debt-yield",
  title: "Debt Yield",
  description:
    "Property debt yield: annual net operating income divided by loan principal.",
  inputs: [
    { id: "annualNoi", kind: "number", label: "Annual Noi", unit: "currency" },
    {
      id: "loanAmount",
      kind: "number",
      label: "Loan Amount",
      unit: "currency",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "debtYieldPercent",
      kind: "number",
      label: "Debt Yield Percent",
      unit: "percent",
    },
  ],
  calculate: (input) =>
    calculateDebtYield({
      annualNoi: input.annualNoi as number,
      loanAmount: input.loanAmount as number,
    }),
});
export const debtYieldTool = tool;
export const runDebtYield = tool.execute;
export default tool;

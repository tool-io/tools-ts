import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PaybackPeriodInput = {
  readonly initialInvestment: number;
  readonly cashFlows: readonly number[];
};

export type PaybackPeriodOutput = {
  readonly paybackPeriodYears: number;
};

export const calculatePaybackPeriod = (
  input: PaybackPeriodInput,
): PaybackPeriodOutput => {
  const investment = input.initialInvestment;
  if (!(investment > 0))
    return simpleError(
      "initialInvestment",
      "Initial investment must be positive.",
      "invalid_investment",
    );
  const flows = input.cashFlows;
  if (!flows.length)
    return simpleError(
      "cashFlows",
      "cashFlows must not be empty.",
      "empty_list",
    );
  let cumulative = 0;
  for (let year = 0; year < flows.length; year += 1) {
    const flow = flows[year];
    if (flow > 0 && cumulative + flow >= investment)
      return { paybackPeriodYears: year + (investment - cumulative) / flow };
    cumulative += flow;
  }
  return simpleError(
    "cashFlows",
    "Cash flows never recover the initial investment within the horizon.",
    "never_recovered",
  );
};

export const paybackPeriodExample = {
  input: {
    initialInvestment: 1000,
    cashFlows: [300, 500, 700],
  },
  output: {
    paybackPeriodYears: 2.2857142857142856,
  },
} satisfies ToolExample<PaybackPeriodInput, PaybackPeriodOutput>;

export const paybackPeriodTool = createSimpleTool({
  id: "finance/payback-period",
  title: "Payback Period Calculator",
  description:
    "Years required for cumulative cash flows to recover an initial investment, interpolated fractionally within the recovery year.",
  inputs: [
    {
      description: "Upfront outlay to recover.",
      id: "initialInvestment",
      kind: "number",
      label: "Initial investment",
    },
    {
      description: "End-of-year cash inflows in chronological order.",
      id: "cashFlows",
      kind: "numberList",
      label: "Cash flows",
    },
  ],
  outputs: [
    {
      description:
        "Recovery time in years, fractional when recovery happens mid-year.",
      id: "paybackPeriodYears",
      kind: "number",
      label: "paybackPeriodYears",
    },
  ],
  calculate: (input) =>
    calculatePaybackPeriod({
      cashFlows: input.cashFlows as readonly number[],
      initialInvestment: input.initialInvestment as number,
    }),
});

export const runPaybackPeriod = paybackPeriodTool.execute;
export default paybackPeriodTool;

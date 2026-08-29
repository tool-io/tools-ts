import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DeferredRevenueInput = {
  readonly contractAmount: number;
  readonly contractMonths: number;
  readonly monthsElapsed: number;
};

export type DeferredRevenueOutput = {
  readonly monthlyRevenue: number;
  readonly recognizedRevenue: number;
  readonly remainingDeferredRevenue: number;
};

export const deferredRevenueExample = {
  input: { contractAmount: 60000, contractMonths: 24, monthsElapsed: 10 },
  output: {
    monthlyRevenue: 2500,
    recognizedRevenue: 25000,
    remainingDeferredRevenue: 35000,
  },
} satisfies ToolExample<DeferredRevenueInput, DeferredRevenueOutput>;

export const calculateDeferredRevenue = (
  input: DeferredRevenueInput,
): DeferredRevenueOutput => {
  if (!Number.isFinite(input.contractAmount) || input.contractAmount < 0)
    simpleError(
      "contractAmount",
      "The contract amount must be a finite non-negative number.",
      "invalid_contract_amount",
    );
  if (!Number.isSafeInteger(input.contractMonths) || input.contractMonths <= 0)
    simpleError(
      "contractMonths",
      "The contract length must be a positive whole number of months.",
      "invalid_contract_months",
    );
  if (!Number.isSafeInteger(input.monthsElapsed) || input.monthsElapsed < 0)
    simpleError(
      "monthsElapsed",
      "The elapsed period must be a non-negative whole number of months.",
      "invalid_months_elapsed",
    );
  const monthlyRevenue = input.contractAmount / input.contractMonths;
  const recognizedRevenue =
    input.monthsElapsed >= input.contractMonths
      ? input.contractAmount
      : (input.contractAmount * input.monthsElapsed) / input.contractMonths;
  return {
    monthlyRevenue,
    recognizedRevenue,
    remainingDeferredRevenue:
      input.contractAmount - recognizedRevenue === 0
        ? 0
        : input.contractAmount - recognizedRevenue,
  };
};

export const deferredRevenueTool = createSimpleTool({
  calculate: (input) =>
    calculateDeferredRevenue({
      contractAmount: input.contractAmount as number,
      contractMonths: input.contractMonths as number,
      monthsElapsed: input.monthsElapsed as number,
    }),
  description:
    "Recognize deferred revenue straight line by month: per-month revenue, amount recognized after elapsed months, and the remaining deferred balance.",
  id: "accounting/deferred-revenue-recognition-per-month-straight-line",
  inputs: [
    {
      description: "Total amount collected in advance for the contract.",
      id: "contractAmount",
      kind: "number",
      label: "Contract amount",
      minimum: 0,
    },
    {
      description: "Total contract service length in whole months.",
      id: "contractMonths",
      kind: "integer",
      label: "Contract months",
      minimum: 1,
    },
    {
      description:
        "Whole months elapsed since the contract started; later than the contract length is capped at full recognition.",
      id: "monthsElapsed",
      kind: "integer",
      label: "Months elapsed",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Revenue recognized per full month of service.",
      id: "monthlyRevenue",
      kind: "number",
      label: "Monthly revenue",
    },
    {
      description:
        "Cumulative revenue recognized after the elapsed months, capped at the contract amount.",
      id: "recognizedRevenue",
      kind: "number",
      label: "Recognized revenue",
    },
    {
      description:
        "Deferred revenue still on the balance sheet after recognition.",
      id: "remainingDeferredRevenue",
      kind: "number",
      label: "Remaining deferred revenue",
    },
  ],
  title: "Deferred Revenue Straight-Line Recognition Calculator",
});
export const runDeferredRevenue = deferredRevenueTool.execute;
export default deferredRevenueTool;

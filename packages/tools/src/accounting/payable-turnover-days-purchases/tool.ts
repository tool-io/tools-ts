import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PayableTurnoverInput = {
  readonly creditPurchases: number;
  readonly averageAccountsPayable: number;
  readonly daysInPeriod: number;
};

export type PayableTurnoverOutput = {
  readonly payableTurnover: number;
  readonly daysPayableOutstanding: number;
};

export const payableTurnoverExample = {
  input: {
    creditPurchases: 600000,
    averageAccountsPayable: 50000,
    daysInPeriod: 360,
  },
  output: { payableTurnover: 12, daysPayableOutstanding: 30 },
} satisfies ToolExample<PayableTurnoverInput, PayableTurnoverOutput>;

export const calculatePayableTurnover = (
  input: PayableTurnoverInput,
): PayableTurnoverOutput => {
  for (const [field, value] of Object.entries(input)) {
    if (!Number.isFinite(value) || value <= 0)
      simpleError(
        field,
        "The value must be finite and greater than zero.",
        "positive_value_required",
      );
  }
  const payableTurnover = input.creditPurchases / input.averageAccountsPayable;
  const daysPayableOutstanding =
    (input.averageAccountsPayable / input.creditPurchases) * input.daysInPeriod;
  if (
    !Number.isFinite(payableTurnover) ||
    !Number.isFinite(daysPayableOutstanding) ||
    payableTurnover <= 0 ||
    daysPayableOutstanding <= 0
  )
    simpleError(
      "creditPurchases",
      "The result is outside the representable positive numeric range.",
      "result_out_of_range",
    );
  return { payableTurnover, daysPayableOutstanding };
};

export const payableTurnoverTool = createSimpleTool({
  calculate: (input) =>
    calculatePayableTurnover({
      creditPurchases: input.creditPurchases as number,
      averageAccountsPayable: input.averageAccountsPayable as number,
      daysInPeriod: input.daysInPeriod as number,
    }),
  description:
    "Calculate payable turnover and payment days from credit purchases and average accounts payable for the same period and currency.",
  id: "accounting/payable-turnover-days-purchases",
  title: "Payable Turnover and Days Calculator",
  inputs: [
    {
      id: "creditPurchases",
      kind: "number",
      label: "Credit purchases",
      minimum: 0,
      description:
        "Supplier purchases on credit in the period; must be positive.",
    },
    {
      id: "averageAccountsPayable",
      kind: "number",
      label: "Average accounts payable",
      minimum: 0,
      description:
        "Average supplier payable balance for the period; must be positive.",
    },
    {
      id: "daysInPeriod",
      kind: "number",
      label: "Days in period",
      minimum: 0,
      unit: "days",
      description: "Positive duration of the measurement period in days.",
    },
  ],
  outputs: [
    {
      id: "payableTurnover",
      kind: "number",
      label: "Payable turnover",
      description:
        "Credit purchases divided by average accounts payable, in turns per period.",
    },
    {
      id: "daysPayableOutstanding",
      kind: "number",
      label: "Days payable outstanding",
      unit: "days",
      description: "Period duration divided by payable turnover.",
    },
  ],
});
export const runPayableTurnover = payableTurnoverTool.execute;
export default payableTurnoverTool;

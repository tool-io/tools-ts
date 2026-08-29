import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DsoDaysSalesOutstandingInput = {
  readonly averageAccountsReceivable: number;
  readonly creditSales: number;
  readonly daysInPeriod: number;
};

export type DsoDaysSalesOutstandingOutput = {
  readonly daysSalesOutstanding: number;
};

export const dsoDaysSalesOutstandingExample = {
  input: {
    averageAccountsReceivable: 50000,
    creditSales: 365000,
    daysInPeriod: 365,
  },
  output: { daysSalesOutstanding: 50 },
} satisfies ToolExample<
  DsoDaysSalesOutstandingInput,
  DsoDaysSalesOutstandingOutput
>;

export const calculateDsoDaysSalesOutstanding = (
  input: DsoDaysSalesOutstandingInput,
): DsoDaysSalesOutstandingOutput => {
  if (
    !Number.isFinite(input.averageAccountsReceivable) ||
    input.averageAccountsReceivable < 0
  )
    simpleError(
      "averageAccountsReceivable",
      "Average receivables must be finite and non-negative.",
      "invalid_average_receivables",
    );
  if (!(input.creditSales > 0))
    simpleError(
      "creditSales",
      "Credit sales must be greater than zero because the ratio is undefined otherwise.",
      "positive_credit_sales_required",
    );
  if (!(input.daysInPeriod > 0))
    simpleError(
      "daysInPeriod",
      "The number of days in the period must be greater than zero.",
      "positive_days_required",
    );
  const daysSalesOutstanding =
    (input.averageAccountsReceivable / input.creditSales) * input.daysInPeriod;
  if (!Number.isFinite(daysSalesOutstanding))
    simpleError(
      "daysInPeriod",
      "DSO exceeds the finite numeric range.",
      "result_not_finite",
    );
  return { daysSalesOutstanding };
};

export const dsoDaysSalesOutstandingTool = createSimpleTool({
  calculate: (input) =>
    calculateDsoDaysSalesOutstanding({
      averageAccountsReceivable: input.averageAccountsReceivable as number,
      creditSales: input.creditSales as number,
      daysInPeriod: input.daysInPeriod as number,
    }),
  description:
    "Calculate days sales outstanding as average accounts receivable divided by credit sales, times the number of days in the period.",
  id: "accounting/dso-days-sales-outstanding",
  inputs: [
    {
      description:
        "Average accounts receivable balance for the period, for example beginning plus ending divided by two.",
      id: "averageAccountsReceivable",
      kind: "number",
      label: "Average accounts receivable",
      minimum: 0,
    },
    {
      description:
        "Total credit sales for the same period; cash sales are excluded from days sales outstanding.",
      id: "creditSales",
      kind: "number",
      label: "Credit sales",
      minimum: 0,
    },
    {
      default: 365,
      description:
        "Number of days in the measurement period, such as 30, 90, or 365.",
      id: "daysInPeriod",
      kind: "number",
      label: "Days in period",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description:
        "Average collection period in days; higher values mean slower collections.",
      id: "daysSalesOutstanding",
      kind: "number",
      label: "Days sales outstanding",
    },
  ],
  title: "DSO Days Sales Outstanding Calculator",
});
export const runDsoDaysSalesOutstanding = dsoDaysSalesOutstandingTool.execute;
export default dsoDaysSalesOutstandingTool;

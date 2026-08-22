import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
export const salesTaxTotalTool = createSimpleTool({
  id: "finance/sales-tax-total",
  title: "Sales Tax Total Calculator",
  description:
    "Calculate the sales tax amount and gross total for an amount and tax rate.",
  inputs: [
    { id: "amount", label: "Net amount", kind: "number", minimum: 0 },
    {
      id: "taxRatePercent",
      label: "Tax rate",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
  ],
  outputs: [
    { id: "taxAmount", label: "Tax amount", kind: "number" },
    { id: "total", label: "Total with tax", kind: "number" },
  ],
  calculate: (input) => {
    const amount = input.amount as number;
    const taxAmount = (amount * (input.taxRatePercent as number)) / 100;
    return { taxAmount, total: amount + taxAmount };
  },
});
export const runSalesTaxTotal = salesTaxTotalTool.execute;
export default salesTaxTotalTool;

export type SalesTaxTotalInput = {
  readonly amount: number;
  readonly taxRatePercent: number;
};

export type SalesTaxTotalOutput = {
  readonly taxAmount: number;
  readonly total: number;
};

export const salesTaxTotalExample = {
  input: { amount: 80, taxRatePercent: 7.5 },
  output: { taxAmount: 6, total: 86 },
} satisfies ToolExample<SalesTaxTotalInput, SalesTaxTotalOutput>;

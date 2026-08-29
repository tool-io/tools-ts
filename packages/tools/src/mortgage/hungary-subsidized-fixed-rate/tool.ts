import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { monthlyPayment } from "../financial-models.js";

export const example = {
  input: {
    principal: 1200,
    subsidizedAnnualRatePercent: 0,
    marketAnnualRatePercent: 0,
    termMonths: 12,
  },
  output: {
    subsidizedMonthlyPayment: 100,
    marketMonthlyPayment: 100,
    monthlySavings: 0,
    totalSavings: 0,
  },
} satisfies ToolExample<Record<string, number>, Record<string, number>>;

export const tool = createSimpleTool({
  id: "mortgage/hungary-subsidized-fixed-rate",
  title: "Hungary Subsidized Fixed-Rate Mortgage Comparison",
  description:
    "Compare caller-supplied subsidized and market fixed rates for a Hungarian-style amortizing mortgage. This does not determine eligibility, caps, subsidies, or fees.",
  inputs: [
    {
      id: "principal",
      kind: "number",
      label: "Principal",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "subsidizedAnnualRatePercent",
      kind: "number",
      label: "Subsidized annual rate",
      minimum: 0,
    },
    {
      id: "marketAnnualRatePercent",
      kind: "number",
      label: "Market annual rate",
      minimum: 0,
    },
    { id: "termMonths", kind: "integer", label: "Term in months", minimum: 1 },
  ],
  outputs: [
    {
      id: "subsidizedMonthlyPayment",
      kind: "number",
      label: "Subsidized payment",
    },
    { id: "marketMonthlyPayment", kind: "number", label: "Market payment" },
    { id: "monthlySavings", kind: "number", label: "Monthly difference" },
    { id: "totalSavings", kind: "number", label: "Total payment difference" },
  ],
  calculate: (input) => {
    const principal = input.principal as number;
    const months = input.termMonths as number;
    const subsidizedMonthlyPayment = monthlyPayment(
      principal,
      input.subsidizedAnnualRatePercent as number,
      months,
    );
    const marketMonthlyPayment = monthlyPayment(
      principal,
      input.marketAnnualRatePercent as number,
      months,
    );
    return {
      subsidizedMonthlyPayment,
      marketMonthlyPayment,
      monthlySavings: marketMonthlyPayment - subsidizedMonthlyPayment,
      totalSavings: (marketMonthlyPayment - subsidizedMonthlyPayment) * months,
    };
  },
});
export type HungarySubsidizedFixedRateInput = Readonly<typeof example.input>;
export type HungarySubsidizedFixedRateOutput = Readonly<typeof example.output>;
export const hungarySubsidizedFixedRateTool = tool;
export const runHungarySubsidizedFixedRate = tool.execute;
export default tool;

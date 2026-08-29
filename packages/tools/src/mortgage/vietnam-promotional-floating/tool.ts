import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { monthlyPayment, remainingBalance } from "../financial-models.js";

export const example = {
  input: {
    principal: 1200,
    initialAnnualRatePercent: 0,
    laterAnnualRatePercent: 0,
    termMonths: 12,
    initialPeriodMonths: 6,
  },
  output: {
    initialMonthlyPayment: 100,
    balanceAtRateChange: 600,
    laterMonthlyPayment: 100,
    projectedTotalInterest: 0,
  },
} satisfies ToolExample<Record<string, number>, Record<string, number>>;

export const tool = createSimpleTool({
  id: "mortgage/vietnam-promotional-floating",
  title: "Vietnam Promotional-to-Floating Mortgage Calculator",
  description:
    "Project a Vietnamese mortgage from a promotional rate into a caller-supplied floating-rate scenario, with a remaining balance and projected payments.",
  inputs: [
    {
      id: "principal",
      kind: "number",
      label: "Principal",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "initialAnnualRatePercent",
      kind: "number",
      label: "Initial annual rate",
      minimum: 0,
    },
    {
      id: "laterAnnualRatePercent",
      kind: "number",
      label: "Later annual rate",
      minimum: 0,
    },
    { id: "termMonths", kind: "integer", label: "Term in months", minimum: 2 },
    {
      id: "initialPeriodMonths",
      kind: "integer",
      label: "Initial period in months",
      minimum: 1,
    },
  ],
  outputs: [
    { id: "initialMonthlyPayment", kind: "number", label: "Initial payment" },
    {
      id: "balanceAtRateChange",
      kind: "number",
      label: "Balance at rate change",
    },
    { id: "laterMonthlyPayment", kind: "number", label: "Later payment" },
    {
      id: "projectedTotalInterest",
      kind: "number",
      label: "Projected total interest",
    },
  ],
  calculate: (input) => {
    const principal = input.principal as number;
    const months = input.termMonths as number;
    const firstMonths = input.initialPeriodMonths as number;
    if (firstMonths >= months)
      simpleError(
        "initialPeriodMonths",
        "Initial period must be shorter than the term.",
      );
    const firstRate = input.initialAnnualRatePercent as number;
    const initialMonthlyPayment = monthlyPayment(principal, firstRate, months);
    const balanceAtRateChange = remainingBalance(
      principal,
      firstRate,
      initialMonthlyPayment,
      firstMonths,
    );
    const laterMonthlyPayment = monthlyPayment(
      balanceAtRateChange,
      input.laterAnnualRatePercent as number,
      months - firstMonths,
    );
    return {
      initialMonthlyPayment,
      balanceAtRateChange,
      laterMonthlyPayment,
      projectedTotalInterest:
        initialMonthlyPayment * firstMonths +
        laterMonthlyPayment * (months - firstMonths) -
        principal,
    };
  },
});
export type VietnamPromotionalFloatingInput = Readonly<typeof example.input>;
export type VietnamPromotionalFloatingOutput = Readonly<typeof example.output>;
export const vietnamPromotionalFloatingTool = tool;
export const runVietnamPromotionalFloating = tool.execute;
export default tool;

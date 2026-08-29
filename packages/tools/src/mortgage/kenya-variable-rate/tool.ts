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
  id: "mortgage/kenya-variable-rate",
  title: "Kenya Variable-Rate Mortgage Calculator",
  description:
    "Project a Kenyan mortgage through one caller-supplied rate change. This is a scenario calculation, not a forecast or a statement of lender terms.",
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
export type KenyaVariableRateInput = Readonly<typeof example.input>;
export type KenyaVariableRateOutput = Readonly<typeof example.output>;
export const kenyaVariableRateTool = tool;
export const runKenyaVariableRate = tool.execute;
export default tool;

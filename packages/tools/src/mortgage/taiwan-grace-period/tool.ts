import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { monthlyPayment } from "../financial-models.js";

export const example = {
  input: {
    principal: 1200,
    annualRatePercent: 0,
    termMonths: 12,
    graceMonths: 6,
  },
  output: {
    graceMonthlyPayment: 0,
    laterMonthlyPayment: 200,
    projectedTotalInterest: 0,
  },
} satisfies ToolExample<Record<string, number>, Record<string, number>>;
export const tool = createSimpleTool({
  id: "mortgage/taiwan-grace-period",
  title: "Taiwan Grace-Period Mortgage Calculator",
  description:
    "Model an interest-only grace period followed by level amortizing payments over the remaining months. The full principal remains due when the grace period ends.",
  inputs: [
    {
      id: "principal",
      kind: "number",
      label: "Principal",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "annualRatePercent",
      kind: "number",
      label: "Annual rate",
      minimum: 0,
    },
    { id: "termMonths", kind: "integer", label: "Term in months", minimum: 2 },
    {
      id: "graceMonths",
      kind: "integer",
      label: "Interest-only grace months",
      minimum: 1,
    },
  ],
  outputs: [
    {
      id: "graceMonthlyPayment",
      kind: "number",
      label: "Grace-period payment",
    },
    { id: "laterMonthlyPayment", kind: "number", label: "Later payment" },
    {
      id: "projectedTotalInterest",
      kind: "number",
      label: "Projected total interest",
    },
  ],
  calculate: (input) => {
    const principal = input.principal as number,
      months = input.termMonths as number,
      grace = input.graceMonths as number;
    if (grace >= months)
      simpleError("graceMonths", "Grace period must be shorter than term.");
    const graceMonthlyPayment =
      (principal * (input.annualRatePercent as number)) / 1200;
    const laterMonthlyPayment = monthlyPayment(
      principal,
      input.annualRatePercent as number,
      months - grace,
    );
    return {
      graceMonthlyPayment,
      laterMonthlyPayment,
      projectedTotalInterest:
        graceMonthlyPayment * grace +
        laterMonthlyPayment * (months - grace) -
        principal,
    };
  },
});
export type TaiwanGracePeriodInput = Readonly<typeof example.input>;
export type TaiwanGracePeriodOutput = Readonly<typeof example.output>;
export const taiwanGracePeriodTool = tool;
export const runTaiwanGracePeriod = tool.execute;
export default tool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MonthlyMortgagePaymentInput = Readonly<{
  readonly principal: number;
  readonly annualInterestPercent: number;
  readonly termMonths: number;
}>;
export type MonthlyMortgagePaymentOutput = Readonly<{
  readonly monthlyPayment: number;
}>;

export const calculateMonthlyMortgagePayment = (
  x: MonthlyMortgagePaymentInput,
): MonthlyMortgagePaymentOutput => {
  if (!Number.isFinite(x.principal) || x.principal <= 0)
    simpleError("principal", "Provide a finite positive number.");
  if (!Number.isFinite(x.annualInterestPercent) || x.annualInterestPercent < 0)
    simpleError(
      "annualInterestPercent",
      "Provide a finite nonnegative number.",
    );
  if (
    !Number.isFinite(x.termMonths) ||
    !Number.isSafeInteger(x.termMonths) ||
    x.termMonths < 1
  )
    simpleError("termMonths", "Provide a positive safe integer.");
  const monthlyPayment = ((r, n, p) =>
    r === 0 ? p / n : (p * r) / (1 - (1 + r) ** -n))(
    x.annualInterestPercent / 1200,
    x.termMonths,
    x.principal,
  );
  if (!Number.isFinite(monthlyPayment))
    simpleError(
      "monthlyPayment",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { monthlyPayment: Object.is(monthlyPayment, -0) ? 0 : monthlyPayment };
};

export const example = {
  input: {
    principal: 200000,
    annualInterestPercent: 6,
    termMonths: 360,
  },
  output: { monthlyPayment: 1199.1010503055138 },
} satisfies ToolExample<
  MonthlyMortgagePaymentInput,
  MonthlyMortgagePaymentOutput
>;

export const tool = createSimpleTool({
  id: "real-estate/monthly-mortgage-payment",
  title: "Monthly Mortgage Payment",
  description:
    "Level monthly principal-and-interest payment on a fully amortizing fixed-rate loan, including a zero-interest branch.",
  inputs: [
    {
      id: "principal",
      kind: "number",
      label: "Principal",
      unit: "currency",
      minimum: 0,
    },
    {
      id: "annualInterestPercent",
      kind: "number",
      label: "Annual Interest Percent",
      unit: "percent",
      minimum: 0,
    },
    { id: "termMonths", kind: "integer", label: "Term Months", minimum: 1 },
  ],
  outputs: [
    {
      id: "monthlyPayment",
      kind: "number",
      label: "Monthly Payment",
      unit: "currency",
    },
  ],
  calculate: (input) =>
    calculateMonthlyMortgagePayment({
      principal: input.principal as number,
      annualInterestPercent: input.annualInterestPercent as number,
      termMonths: input.termMonths as number,
    }),
});
export const monthlyMortgagePaymentTool = tool;
export const runMonthlyMortgagePayment = tool.execute;
export default tool;

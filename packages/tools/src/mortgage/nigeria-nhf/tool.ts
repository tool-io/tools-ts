import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { monthlyPayment } from "../financial-models.js";

export const example = {
  input: {
    principal: 1200,
    annualRatePercent: 0,
    termMonths: 12,
  },
  output: {
    monthlyPayment: 100,
    totalInterest: 0,
  },
} satisfies ToolExample<Record<string, number>, Record<string, number>>;

export const tool = createSimpleTool({
  id: "mortgage/nigeria-nhf",
  title: "Nigeria NHF Mortgage Payment Calculator",
  description:
    "Estimate a Nigerian NHF-style fixed-rate amortizing payment from caller-supplied principal, annual rate, and term. This does not determine NHF eligibility, current rates, or fees.",
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
    { id: "termMonths", kind: "integer", label: "Term in months", minimum: 1 },
  ],
  outputs: [
    { id: "monthlyPayment", kind: "number", label: "Monthly payment" },
    { id: "totalInterest", kind: "number", label: "Total interest" },
  ],
  calculate: (input) => {
    const principal = input.principal as number;
    const months = input.termMonths as number;
    const payment = monthlyPayment(
      principal,
      input.annualRatePercent as number,
      months,
    );
    return {
      monthlyPayment: payment,
      totalInterest: payment * months - principal,
    };
  },
});
export type NigeriaNhfInput = Readonly<typeof example.input>;
export type NigeriaNhfOutput = Readonly<typeof example.output>;
export const nigeriaNhfTool = tool;
export const runNigeriaNhf = tool.execute;
export default tool;

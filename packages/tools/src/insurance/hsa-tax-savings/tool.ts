import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly annualContribution: number;
  readonly marginalIncomeTaxPercent: number;
  readonly payrollTaxPercent: number;
  readonly annualInvestmentGrowth: number;
  readonly capitalGainsTaxPercent: number;
}>;
export type Output = Readonly<{
  readonly contributionTaxSavings: number;
  readonly payrollTaxSavings: number;
  readonly growthTaxSavings: number;
  readonly totalEstimatedTaxSavings: number;
}>;

export const calculate = (input: Input): Output => {
  const contributionTaxSavings =
      (input.annualContribution * input.marginalIncomeTaxPercent) / 100,
    payrollTaxSavings =
      (input.annualContribution * input.payrollTaxPercent) / 100,
    growthTaxSavings =
      (input.annualInvestmentGrowth * input.capitalGainsTaxPercent) / 100;
  return {
    contributionTaxSavings,
    payrollTaxSavings,
    growthTaxSavings,
    totalEstimatedTaxSavings:
      contributionTaxSavings + payrollTaxSavings + growthTaxSavings,
  };
};

export const exampleInput = {
  annualContribution: 5000,
  marginalIncomeTaxPercent: 20,
  payrollTaxPercent: 7.5,
  annualInvestmentGrowth: 1000,
  capitalGainsTaxPercent: 15,
} satisfies Input;
export const exampleOutput = {
  contributionTaxSavings: 1000,
  payrollTaxSavings: 375,
  growthTaxSavings: 150,
  totalEstimatedTaxSavings: 1525,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      annualContribution: input.annualContribution as number,
      marginalIncomeTaxPercent: input.marginalIncomeTaxPercent as number,
      payrollTaxPercent: input.payrollTaxPercent as number,
      annualInvestmentGrowth: input.annualInvestmentGrowth as number,
      capitalGainsTaxPercent: input.capitalGainsTaxPercent as number,
    }),
  description:
    "Estimate HSA contribution, payroll, and investment-growth tax savings.",
  id: "insurance/hsa-tax-savings",
  inputs: [
    {
      id: "annualContribution",
      label: "Annual HSA contribution",
      kind: "number",
      minimum: 0,
    },
    {
      id: "marginalIncomeTaxPercent",
      label: "Marginal income tax rate",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
    {
      id: "payrollTaxPercent",
      label: "Payroll tax rate",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
    {
      id: "annualInvestmentGrowth",
      label: "Annual investment growth",
      kind: "number",
      minimum: 0,
    },
    {
      id: "capitalGainsTaxPercent",
      label: "Capital-gains tax rate",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
  ],
  outputs: [
    {
      id: "contributionTaxSavings",
      label: "Contribution tax savings",
      kind: "number",
      minimum: 0,
    },
    {
      id: "payrollTaxSavings",
      label: "Payroll tax savings",
      kind: "number",
      minimum: 0,
    },
    {
      id: "growthTaxSavings",
      label: "Tax savings on growth",
      kind: "number",
      minimum: 0,
    },
    {
      id: "totalEstimatedTaxSavings",
      label: "Total estimated tax savings",
      kind: "number",
      minimum: 0,
    },
  ],
  title: "HSA Tax Savings",
});

export const run = tool.execute;
export default tool;

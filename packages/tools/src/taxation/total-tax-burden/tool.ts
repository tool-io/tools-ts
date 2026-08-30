import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly incomeTax: number;
  readonly payrollTax: number;
  readonly propertyTax: number;
  readonly consumptionTax: number;
  readonly grossIncome: number;
}>;
export type Output = Readonly<{
  readonly totalTax: number;
  readonly effectiveBurdenPercent: number;
  readonly afterTaxIncome: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.grossIncome <= 0)
    simpleError(
      "grossIncome",
      "Gross income must be positive.",
      "invalid_income",
    );
  const totalTax =
    input.incomeTax +
    input.payrollTax +
    input.propertyTax +
    input.consumptionTax;
  return {
    totalTax,
    effectiveBurdenPercent: (totalTax / input.grossIncome) * 100,
    afterTaxIncome: input.grossIncome - totalTax,
  };
};

export const exampleInput = {
  incomeTax: 100,
  payrollTax: 50,
  propertyTax: 25,
  consumptionTax: 25,
  grossIncome: 1000,
} satisfies Input;
export const exampleOutput = {
  totalTax: 200,
  effectiveBurdenPercent: 20,
  afterTaxIncome: 800,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      incomeTax: input.incomeTax as number,
      payrollTax: input.payrollTax as number,
      propertyTax: input.propertyTax as number,
      consumptionTax: input.consumptionTax as number,
      grossIncome: input.grossIncome as number,
    }),
  description:
    "Combine supplied tax categories into a total and effective burden.",
  id: "taxation/total-tax-burden",
  inputs: [
    { id: "incomeTax", label: "Income tax", kind: "number", minimum: 0 },
    { id: "payrollTax", label: "Payroll tax", kind: "number", minimum: 0 },
    { id: "propertyTax", label: "Property tax", kind: "number", minimum: 0 },
    {
      id: "consumptionTax",
      label: "Consumption tax",
      kind: "number",
      minimum: 0,
    },
    { id: "grossIncome", label: "Gross income", kind: "number", minimum: 0 },
  ],
  outputs: [
    { id: "totalTax", label: "Total tax burden", kind: "number", minimum: 0 },
    {
      id: "effectiveBurdenPercent",
      label: "Effective burden",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
    { id: "afterTaxIncome", label: "After-tax income", kind: "number" },
  ],
  title: "Total Tax Burden",
});

export const run = tool.execute;
export default tool;

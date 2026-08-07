import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export type EmployeeCost = {
  readonly annualCost: number;
  readonly benefitsAndOverhead: number;
  readonly costPerHour: number;
  readonly currency: string;
  readonly monthlyCost: number;
  readonly payrollTaxCost: number;
  readonly salary: number;
};
export const calculateEmployeeCost = (
  salary: number,
  payrollTaxPercent: number,
  benefits: number,
  overhead: number,
  annualHours: number,
  currency: string,
): EmployeeCost | null => {
  if (!currency.trim() || annualHours <= 0) return null;
  const payrollTaxCost = (salary * payrollTaxPercent) / 100,
    annualCost = salary + payrollTaxCost + benefits + overhead;
  return {
    annualCost,
    benefitsAndOverhead: benefits + overhead,
    costPerHour: annualCost / annualHours,
    currency,
    monthlyCost: annualCost / 12,
    payrollTaxCost,
    salary,
  };
};
export const employeeCostExample = {
  input: {
    annualHours: 2_080,
    benefits: 12_000,
    currency: "USD",
    overhead: 8_000,
    payrollTaxPercent: 7.65,
    salary: 70_000,
  },
  output: {
    result: {
      annualCost: 95_355,
      benefitsAndOverhead: 20_000,
      costPerHour: 45.84375,
      currency: "USD",
      monthlyCost: 7_946.25,
      payrollTaxCost: 5_355,
      salary: 70_000,
    },
  },
} satisfies ToolExample<
  {
    readonly annualHours: number;
    readonly benefits: number;
    readonly currency: string;
    readonly overhead: number;
    readonly payrollTaxPercent: number;
    readonly salary: number;
  },
  { readonly result: EmployeeCost }
>;
export const employeeCostTool = createSimpleTool({
  id: "cost/employee",
  title: "Employee Cost Calculator",
  description:
    "Estimate annual, monthly, and hourly employer cost beyond base salary.",
  inputs: [
    { id: "currency", kind: "string", label: "Currency" },
    { id: "salary", kind: "number", label: "Annual salary", minimum: 0 },
    {
      id: "payrollTaxPercent",
      kind: "number",
      label: "Employer payroll tax (%)",
      minimum: 0,
    },
    { id: "benefits", kind: "number", label: "Annual benefits", minimum: 0 },
    { id: "overhead", kind: "number", label: "Annual overhead", minimum: 0 },
    {
      id: "annualHours",
      kind: "number",
      label: "Annual work hours",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [
    {
      format: "cost/employee",
      id: "result",
      kind: "object",
      label: "Employee cost",
    },
  ],
  calculate: (input) => {
    const result = calculateEmployeeCost(
      input.salary as number,
      input.payrollTaxPercent as number,
      input.benefits as number,
      input.overhead as number,
      input.annualHours as number,
      input.currency as string,
    );
    if (!result)
      return simpleError(
        "annualHours",
        "Annual hours must be positive and currency nonempty.",
      );
    return { result };
  },
});
export const runEmployeeCost = employeeCostTool.execute;
export default employeeCostTool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly acceleratedDeductions: number;
  readonly baselineDeductions: number;
  readonly marginalTaxRatePercent: number;
  readonly studyCost: number;
}>;
export type Output = Readonly<{
  readonly incrementalDeduction: number;
  readonly grossTaxTimingBenefit: number;
  readonly netFirstPeriodBenefit: number;
}>;

export const calculate = (input: Input): Output => {
  const incrementalDeduction =
    input.acceleratedDeductions - input.baselineDeductions;
  const grossTaxTimingBenefit =
    (incrementalDeduction * input.marginalTaxRatePercent) / 100;
  return {
    incrementalDeduction,
    grossTaxTimingBenefit,
    netFirstPeriodBenefit: grossTaxTimingBenefit - input.studyCost,
  };
};

export const exampleInput = {
  acceleratedDeductions: 250000,
  baselineDeductions: 100000,
  marginalTaxRatePercent: 30,
  studyCost: 10000,
} satisfies Input;
export const exampleOutput = {
  incrementalDeduction: 150000,
  grossTaxTimingBenefit: 45000,
  netFirstPeriodBenefit: 35000,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      acceleratedDeductions: input.acceleratedDeductions as number,
      baselineDeductions: input.baselineDeductions as number,
      marginalTaxRatePercent: input.marginalTaxRatePercent as number,
      studyCost: input.studyCost as number,
    }),
  description:
    "Compare first-period deductions and study cost using a caller-supplied marginal rate.",
  id: "taxation/cost-segregation-benefit",
  inputs: [
    {
      id: "acceleratedDeductions",
      label: "Accelerated deductions",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
    {
      id: "baselineDeductions",
      label: "Baseline deductions",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
    {
      id: "marginalTaxRatePercent",
      label: "Marginal tax rate",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
    {
      id: "studyCost",
      label: "Study cost",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
  ],
  outputs: [
    {
      id: "incrementalDeduction",
      label: "Incremental deduction",
      kind: "number",
      unit: "currency",
    },
    {
      id: "grossTaxTimingBenefit",
      label: "Gross tax timing benefit",
      kind: "number",
      unit: "currency",
    },
    {
      id: "netFirstPeriodBenefit",
      label: "Net first-period benefit",
      kind: "number",
      unit: "currency",
    },
  ],
  title: "Cost-Segregation Benefit",
});

export const run = tool.execute;
export default tool;

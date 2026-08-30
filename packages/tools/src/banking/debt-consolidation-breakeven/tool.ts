import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly currentMonthlyCost: number;
  readonly newMonthlyCost: number;
  readonly upfrontFees: number;
}>;
export type Output = Readonly<{
  readonly monthlySavings: number;
  readonly breakEvenMonths: number;
  readonly hasSavings: boolean;
}>;

export const calculate = (input: Input): Output => {
  const monthlySavings = input.currentMonthlyCost - input.newMonthlyCost;
  if (monthlySavings <= 0)
    return { monthlySavings, breakEvenMonths: 0, hasSavings: false };
  return {
    monthlySavings,
    breakEvenMonths: input.upfrontFees / monthlySavings,
    hasSavings: true,
  };
};

export const exampleInput = {
  currentMonthlyCost: 700,
  newMonthlyCost: 600,
  upfrontFees: 1200,
} satisfies Input;
export const example = {
  input: exampleInput,
  output: calculate(exampleInput),
} satisfies ToolExample<Input, Output>;
export const edgeCase = {
  currentMonthlyCost: 600,
  newMonthlyCost: 650,
  upfrontFees: 500,
} satisfies Input;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      currentMonthlyCost: input.currentMonthlyCost as number,
      newMonthlyCost: input.newMonthlyCost as number,
      upfrontFees: input.upfrontFees as number,
    }),
  description:
    "Calculate monthly savings and fee break-even time for a consolidation scenario.",
  id: "banking/debt-consolidation-breakeven",
  inputs: [
    {
      id: "currentMonthlyCost",
      label: "Current monthly cost",
      kind: "number",
      minimum: 0,
      unit: "currency/month",
    },
    {
      id: "newMonthlyCost",
      label: "New monthly cost",
      kind: "number",
      minimum: 0,
      unit: "currency/month",
    },
    {
      id: "upfrontFees",
      label: "Upfront fees",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
  ],
  outputs: [
    {
      id: "monthlySavings",
      label: "Monthly savings",
      kind: "number",
      unit: "currency/month",
    },
    {
      id: "breakEvenMonths",
      label: "Break-even time",
      kind: "number",
      minimum: 0,
      unit: "months",
    },
    { id: "hasSavings", label: "Has monthly savings", kind: "boolean" },
  ],
  title: "Debt Consolidation Breakeven",
});

export const run = tool.execute;
export default tool;

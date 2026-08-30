import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly householdIncome: number;
  readonly annualEmployeePremium: number;
  readonly affordabilityPercent: number;
}>;
export type Output = Readonly<{
  readonly premiumToIncomePercent: number;
  readonly affordablePremiumLimit: number;
  readonly premiumMargin: number;
  readonly affordable: boolean;
}>;

export const calculate = (input: Input): Output => {
  if (input.householdIncome <= 0)
    simpleError(
      "householdIncome",
      "Household income must be positive.",
      "invalid_income",
    );
  const premiumToIncomePercent =
      (input.annualEmployeePremium / input.householdIncome) * 100,
    affordablePremiumLimit =
      (input.householdIncome * input.affordabilityPercent) / 100;
  return {
    premiumToIncomePercent,
    affordablePremiumLimit,
    premiumMargin: affordablePremiumLimit - input.annualEmployeePremium,
    affordable: premiumToIncomePercent <= input.affordabilityPercent,
  };
};

export const exampleInput = {
  householdIncome: 50000,
  annualEmployeePremium: 4000,
  affordabilityPercent: 9,
} satisfies Input;
export const exampleOutput = {
  premiumToIncomePercent: 8,
  affordablePremiumLimit: 4500,
  premiumMargin: 500,
  affordable: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      householdIncome: input.householdIncome as number,
      annualEmployeePremium: input.annualEmployeePremium as number,
      affordabilityPercent: input.affordabilityPercent as number,
    }),
  description:
    "Test coverage affordability using a caller-supplied income percentage.",
  id: "insurance/coverage-affordability",
  inputs: [
    {
      id: "householdIncome",
      label: "Household income",
      kind: "number",
      minimum: 0,
    },
    {
      id: "annualEmployeePremium",
      label: "Annual employee premium",
      kind: "number",
      minimum: 0,
    },
    {
      id: "affordabilityPercent",
      label: "Affordability threshold",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
  ],
  outputs: [
    {
      id: "premiumToIncomePercent",
      label: "Premium-to-income percentage",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
    {
      id: "affordablePremiumLimit",
      label: "Affordable premium limit",
      kind: "number",
      minimum: 0,
    },
    {
      id: "premiumMargin",
      label: "Affordable limit minus premium",
      kind: "number",
    },
    { id: "affordable", label: "Coverage is affordable", kind: "boolean" },
  ],
  title: "Coverage Affordability",
});

export const run = tool.execute;
export default tool;

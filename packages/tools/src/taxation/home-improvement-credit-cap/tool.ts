import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly eligibleCosts: readonly number[];
  readonly categoryCaps: readonly number[];
  readonly annualCap: number;
}>;
export type Output = Readonly<{
  readonly categoryCredits: readonly number[];
  readonly uncappedAnnualTotal: number;
  readonly allowedAnnualCredit: number;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.eligibleCosts.length === 0 ||
    input.eligibleCosts.length !== input.categoryCaps.length ||
    input.eligibleCosts.some((value) => value < 0) ||
    input.categoryCaps.some((value) => value < 0)
  )
    simpleError(
      "eligibleCosts",
      "Costs and caps must be aligned, nonempty, and nonnegative.",
      "invalid_categories",
    );
  const categoryCredits = input.eligibleCosts.map((value, index) =>
    Math.min(value, input.categoryCaps[index]),
  );
  const uncappedAnnualTotal = categoryCredits.reduce((a, b) => a + b, 0);
  return {
    categoryCredits,
    uncappedAnnualTotal,
    allowedAnnualCredit: Math.min(uncappedAnnualTotal, input.annualCap),
  };
};

export const exampleInput = {
  eligibleCosts: [800, 2500, 1000],
  categoryCaps: [600, 2000, 1200],
  annualCap: 3200,
} satisfies Input;
export const exampleOutput = {
  categoryCredits: [600, 2000, 1000],
  uncappedAnnualTotal: 3600,
  allowedAnnualCredit: 3200,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      eligibleCosts: input.eligibleCosts as readonly number[],
      categoryCaps: input.categoryCaps as readonly number[],
      annualCap: input.annualCap as number,
    }),
  description:
    "Apply caller-supplied category and annual caps to home-improvement costs.",
  id: "taxation/home-improvement-credit-cap",
  inputs: [
    {
      id: "eligibleCosts",
      label: "Eligible category costs",
      kind: "numberList",
      unit: "currency",
    },
    {
      id: "categoryCaps",
      label: "Category caps",
      kind: "numberList",
      unit: "currency",
    },
    {
      id: "annualCap",
      label: "Annual aggregate cap",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
  ],
  outputs: [
    {
      id: "categoryCredits",
      label: "Credits after category caps",
      kind: "numberList",
      unit: "currency",
    },
    {
      id: "uncappedAnnualTotal",
      label: "Total after category caps",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
    {
      id: "allowedAnnualCredit",
      label: "Allowed annual credit",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
  ],
  title: "Home-Improvement Credit Cap",
});

export const run = tool.execute;
export default tool;

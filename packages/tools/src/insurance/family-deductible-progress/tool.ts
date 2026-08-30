import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly familyDeductible: number;
  readonly individualDeductible: number;
  readonly memberEligibleExpenses: readonly number[];
}>;
export type Output = Readonly<{
  readonly memberAppliedAmounts: readonly number[];
  readonly familyAppliedAmount: number;
  readonly familyRemaining: number;
  readonly familyDeductibleMet: boolean;
}>;

export const calculate = (input: Input): Output => {
  if (input.memberEligibleExpenses.some((value) => value < 0))
    simpleError(
      "memberEligibleExpenses",
      "Member expenses must be nonnegative.",
      "invalid_expenses",
    );
  const memberAppliedAmounts = input.memberEligibleExpenses.map((value) =>
      Math.min(value, input.individualDeductible),
    ),
    familyAppliedAmount = Math.min(
      input.familyDeductible,
      memberAppliedAmounts.reduce((a, b) => a + b, 0),
    );
  return {
    memberAppliedAmounts,
    familyAppliedAmount,
    familyRemaining: input.familyDeductible - familyAppliedAmount,
    familyDeductibleMet: familyAppliedAmount >= input.familyDeductible,
  };
};

export const exampleInput = {
  familyDeductible: 3000,
  individualDeductible: 1500,
  memberEligibleExpenses: [2000, 1000],
} satisfies Input;
export const exampleOutput = {
  memberAppliedAmounts: [1500, 1000],
  familyAppliedAmount: 2500,
  familyRemaining: 500,
  familyDeductibleMet: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      familyDeductible: input.familyDeductible as number,
      individualDeductible: input.individualDeductible as number,
      memberEligibleExpenses: input.memberEligibleExpenses as readonly number[],
    }),
  description: "Track embedded individual expenses toward a family deductible.",
  id: "insurance/family-deductible-progress",
  inputs: [
    {
      id: "familyDeductible",
      label: "Family deductible",
      kind: "number",
      minimum: 0,
    },
    {
      id: "individualDeductible",
      label: "Embedded individual deductible",
      kind: "number",
      minimum: 0,
    },
    {
      id: "memberEligibleExpenses",
      label: "Eligible expenses by member",
      kind: "numberList",
    },
  ],
  outputs: [
    {
      id: "memberAppliedAmounts",
      label: "Amounts applied by member",
      kind: "numberList",
    },
    {
      id: "familyAppliedAmount",
      label: "Total applied to family deductible",
      kind: "number",
      minimum: 0,
    },
    {
      id: "familyRemaining",
      label: "Family deductible remaining",
      kind: "number",
      minimum: 0,
    },
    {
      id: "familyDeductibleMet",
      label: "Family deductible met",
      kind: "boolean",
    },
  ],
  title: "Family Deductible Progress",
});

export const run = tool.execute;
export default tool;

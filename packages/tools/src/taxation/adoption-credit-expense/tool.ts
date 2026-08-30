import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly qualifiedExpenses: number;
  readonly employerAssistance: number;
  readonly creditCap: number;
}>;
export type Output = Readonly<{
  readonly netEligibleExpenses: number;
  readonly creditableExpense: number;
}>;

export const calculate = (input: Input): Output => {
  const netEligibleExpenses = Math.max(
    0,
    input.qualifiedExpenses - input.employerAssistance,
  );
  return {
    netEligibleExpenses,
    creditableExpense: Math.min(netEligibleExpenses, input.creditCap),
  };
};

export const exampleInput = {
  qualifiedExpenses: 20000,
  employerAssistance: 5000,
  creditCap: 16000,
} satisfies Input;
export const exampleOutput = {
  netEligibleExpenses: 15000,
  creditableExpense: 15000,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      qualifiedExpenses: input.qualifiedExpenses as number,
      employerAssistance: input.employerAssistance as number,
      creditCap: input.creditCap as number,
    }),
  description:
    "Subtract employer assistance from qualified adoption expenses and apply a caller-supplied cap.",
  id: "taxation/adoption-credit-expense",
  inputs: [
    {
      id: "qualifiedExpenses",
      label: "Qualified expenses",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
    {
      id: "employerAssistance",
      label: "Excluded employer assistance",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
    {
      id: "creditCap",
      label: "Credit cap",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
  ],
  outputs: [
    {
      id: "netEligibleExpenses",
      label: "Net eligible expenses",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
    {
      id: "creditableExpense",
      label: "Creditable expense",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
  ],
  title: "Adoption Credit Expense",
});

export const run = tool.execute;
export default tool;

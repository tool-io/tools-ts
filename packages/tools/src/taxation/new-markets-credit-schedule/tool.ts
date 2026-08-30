import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly qualifiedEquityInvestment: number;
}>;
export type Output = Readonly<{
  readonly annualCreditSchedule: readonly number[];
  readonly totalCredit: number;
}>;

export const calculate = (input: Input): Output => {
  const rates = [5, 5, 5, 6, 6, 6, 6];
  const annualCreditSchedule = rates.map(
    (rate) => (input.qualifiedEquityInvestment * rate) / 100,
  );
  return {
    annualCreditSchedule,
    totalCredit: annualCreditSchedule.reduce((a, b) => a + b, 0),
  };
};

export const exampleInput = {
  qualifiedEquityInvestment: 1000000,
} satisfies Input;
export const exampleOutput = {
  annualCreditSchedule: [50000, 50000, 50000, 60000, 60000, 60000, 60000],
  totalCredit: 390000,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      qualifiedEquityInvestment: input.qualifiedEquityInvestment as number,
    }),
  description:
    "Generate the seven-year 5/5/5/6/6/6/6 percent credit schedule for a supplied investment.",
  id: "taxation/new-markets-credit-schedule",
  inputs: [
    {
      id: "qualifiedEquityInvestment",
      label: "Qualified equity investment",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
  ],
  outputs: [
    {
      id: "annualCreditSchedule",
      label: "Seven-year credit schedule",
      kind: "numberList",
      unit: "currency",
    },
    {
      id: "totalCredit",
      label: "Total seven-year credit",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
  ],
  title: "New-Markets Credit Schedule",
});

export const run = tool.execute;
export default tool;

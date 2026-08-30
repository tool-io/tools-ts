import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { nonnegative, positive, fraction } from "../shared.js";

export type Input = Readonly<{
  readonly monthlyArpu: number;
  readonly grossMarginFraction: number;
  readonly monthlyChurnFraction: number;
}>;
export type Output = Readonly<{
  readonly expectedLifetimeMonths: number;
  readonly lifetimeGrossProfit: number;
}>;
export const calculate = (input: Input): Output => {
  nonnegative(input.monthlyArpu, "monthlyArpu");
  fraction(input.grossMarginFraction, "grossMarginFraction");
  fraction(input.monthlyChurnFraction, "monthlyChurnFraction");
  positive(input.monthlyChurnFraction, "monthlyChurnFraction");
  const expectedLifetimeMonths = 1 / input.monthlyChurnFraction;
  return {
    expectedLifetimeMonths,
    lifetimeGrossProfit:
      input.monthlyArpu * input.grossMarginFraction * expectedLifetimeMonths,
  };
};
export const exampleInput = {
  monthlyArpu: 20,
  grossMarginFraction: 0.5,
  monthlyChurnFraction: 0.1,
} satisfies Input;
export const exampleOutput = {
  expectedLifetimeMonths: 10,
  lifetimeGrossProfit: 100,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "entrepreneurship/churn-based-lifetime-value",
  title: "Churn Based Lifetime Value",
  description:
    "Estimate lifetime gross profit assuming constant monthly customer churn.",
  inputs: [
    { id: "monthlyArpu", label: "Monthly arpu", kind: "number" },
    {
      id: "grossMarginFraction",
      label: "Gross margin fraction",
      kind: "number",
    },
    {
      id: "monthlyChurnFraction",
      label: "Monthly churn fraction",
      kind: "number",
    },
  ],
  outputs: [
    {
      id: "expectedLifetimeMonths",
      label: "Expected lifetime months",
      kind: "integer",
    },
    {
      id: "lifetimeGrossProfit",
      label: "Lifetime gross profit",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      monthlyArpu: value.monthlyArpu as number,
      grossMarginFraction: value.grossMarginFraction as number,
      monthlyChurnFraction: value.monthlyChurnFraction as number,
    }),
});
export const run = tool.execute;
export default tool;

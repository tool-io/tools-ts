import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly monthlyNetIncome: number;
  readonly allowableLivingExpenses: number;
  readonly minimumPaymentThreshold: number;
}>;
export type Output = Readonly<{
  readonly monthlyDisposableIncome: number;
  readonly paymentCapacityMargin: number;
  readonly belowPaymentThreshold: boolean;
}>;

export const calculate = (input: Input): Output => {
  const monthlyDisposableIncome =
    input.monthlyNetIncome - input.allowableLivingExpenses;
  return {
    monthlyDisposableIncome,
    paymentCapacityMargin:
      monthlyDisposableIncome - input.minimumPaymentThreshold,
    belowPaymentThreshold:
      monthlyDisposableIncome < input.minimumPaymentThreshold,
  };
};

export const exampleInput = {
  monthlyNetIncome: 3000,
  allowableLivingExpenses: 2950,
  minimumPaymentThreshold: 100,
} satisfies Input;
export const exampleOutput = {
  monthlyDisposableIncome: 50,
  paymentCapacityMargin: -50,
  belowPaymentThreshold: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      monthlyNetIncome: input.monthlyNetIncome as number,
      allowableLivingExpenses: input.allowableLivingExpenses as number,
      minimumPaymentThreshold: input.minimumPaymentThreshold as number,
    }),
  description:
    "Compare disposable income with a caller-supplied collection payment threshold.",
  id: "taxation/cnc-affordability",
  inputs: [
    {
      id: "monthlyNetIncome",
      label: "Monthly net income",
      kind: "number",
      minimum: 0,
    },
    {
      id: "allowableLivingExpenses",
      label: "Allowable living expenses",
      kind: "number",
      minimum: 0,
    },
    {
      id: "minimumPaymentThreshold",
      label: "Caller minimum payment threshold",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "monthlyDisposableIncome",
      label: "Monthly disposable income",
      kind: "number",
    },
    {
      id: "paymentCapacityMargin",
      label: "Payment-capacity margin",
      kind: "number",
    },
    {
      id: "belowPaymentThreshold",
      label: "Below supplied payment threshold",
      kind: "boolean",
    },
  ],
  title: "CNC Affordability",
});

export const run = tool.execute;
export default tool;

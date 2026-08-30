import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  money,
  integer,
  sumMoney,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly revenueLineAmountsMinor: readonly number[];
  readonly expenseLineAmountsMinor: readonly number[];
}>;
export type Output = Readonly<{
  readonly singleStepRevenueTotalMinor: number;
  readonly singleStepExpenseTotalMinor: number;
  readonly singleStepNetIncomeMinor: number;
}>;
const inputFields = [
  {
    id: "revenueLineAmountsMinor",
    label: "Revenue line amounts minor",
    kind: "numberList",
  },
  {
    id: "expenseLineAmountsMinor",
    label: "Expense line amounts minor",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.revenueLineAmountsMinor.forEach((v) =>
    money(v, "revenueLineAmountsMinor"),
  );
  input.expenseLineAmountsMinor.forEach((v) =>
    money(v, "expenseLineAmountsMinor"),
  );
  const r = sumMoney(input.revenueLineAmountsMinor),
    e = sumMoney(input.expenseLineAmountsMinor);
  return {
    singleStepRevenueTotalMinor: r,
    singleStepExpenseTotalMinor: e,
    singleStepNetIncomeMinor: integer(r - e, "netIncome"),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  revenueLineAmountsMinor: [1000, 200],
  expenseLineAmountsMinor: [400, 300],
} satisfies Input;
export const exampleOutput = {
  singleStepRevenueTotalMinor: 1200,
  singleStepExpenseTotalMinor: 700,
  singleStepNetIncomeMinor: 500,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "accounting/income-statement-single-step-builder",
  title: "Income Statement Single Step Builder Tool",
  description:
    "Build a single-step statement from caller classified revenue/expense lines in one currency; signed net loss retained, classification and completeness not independently audited.",
  inputs: inputFields,
  outputs: [
    {
      id: "singleStepRevenueTotalMinor",
      label: "Single step revenue total minor",
      kind: "number",
    },
    {
      id: "singleStepExpenseTotalMinor",
      label: "Single step expense total minor",
      kind: "number",
    },
    {
      id: "singleStepNetIncomeMinor",
      label: "Single step net income minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      revenueLineAmountsMinor:
        value.revenueLineAmountsMinor as readonly number[],
      expenseLineAmountsMinor:
        value.expenseLineAmountsMinor as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;

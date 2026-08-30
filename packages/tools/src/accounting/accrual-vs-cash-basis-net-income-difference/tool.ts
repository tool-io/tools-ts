import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, integer, signedSum } from "../batch-shared.js";
export type Input = Readonly<{
  readonly cashBasisNetIncomeMinor: number;
  readonly increaseEarnedUncollectedRevenueMinor: number;
  readonly increaseUnearnedCashReceiptsMinor: number;
  readonly increaseUnpaidExpensesMinor: number;
  readonly increaseUnexpiredPrepaidExpensesMinor: number;
}>;
export type Output = Readonly<{
  readonly signedAccrualBasisAdjustmentMinor: number;
  readonly modeledAccrualBasisNetIncomeMinor: number;
}>;
const inputFields = [
  {
    id: "cashBasisNetIncomeMinor",
    label: "Cash basis net income minor",
    kind: "number",
  },
  {
    id: "increaseEarnedUncollectedRevenueMinor",
    label: "Increase earned uncollected revenue minor",
    kind: "number",
  },
  {
    id: "increaseUnearnedCashReceiptsMinor",
    label: "Increase unearned cash receipts minor",
    kind: "number",
  },
  {
    id: "increaseUnpaidExpensesMinor",
    label: "Increase unpaid expenses minor",
    kind: "number",
  },
  {
    id: "increaseUnexpiredPrepaidExpensesMinor",
    label: "Increase unexpired prepaid expenses minor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  integer(input.cashBasisNetIncomeMinor, "cashBasisNetIncomeMinor");
  integer(
    input.increaseEarnedUncollectedRevenueMinor,
    "increaseEarnedUncollectedRevenueMinor",
  );
  integer(
    input.increaseUnearnedCashReceiptsMinor,
    "increaseUnearnedCashReceiptsMinor",
  );
  integer(input.increaseUnpaidExpensesMinor, "increaseUnpaidExpensesMinor");
  integer(
    input.increaseUnexpiredPrepaidExpensesMinor,
    "increaseUnexpiredPrepaidExpensesMinor",
  );
  const adjustment = signedSum([
    input.increaseEarnedUncollectedRevenueMinor,
    -input.increaseUnearnedCashReceiptsMinor,
    -input.increaseUnpaidExpensesMinor,
    input.increaseUnexpiredPrepaidExpensesMinor,
  ]);
  return {
    signedAccrualBasisAdjustmentMinor: adjustment,
    modeledAccrualBasisNetIncomeMinor: signedSum([
      input.cashBasisNetIncomeMinor,
      adjustment,
    ]),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  cashBasisNetIncomeMinor: 500,
  increaseEarnedUncollectedRevenueMinor: 100,
  increaseUnearnedCashReceiptsMinor: 50,
  increaseUnpaidExpensesMinor: 30,
  increaseUnexpiredPrepaidExpensesMinor: 20,
} satisfies Input;
export const exampleOutput = {
  signedAccrualBasisAdjustmentMinor: 40,
  modeledAccrualBasisNetIncomeMinor: 540,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "accounting/accrual-vs-cash-basis-net-income-difference",
  title: "Accrual vs Cash Basis Net Income Difference Calculator",
  description:
    "Bridge cash-basis profit using explicit signed period changes in earned receivables, unearned receipts, unpaid expenses and unexpired prepaids; other noncash items are outside this declared model.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedAccrualBasisAdjustmentMinor",
      label: "Signed accrual basis adjustment minor",
      kind: "number",
    },
    {
      id: "modeledAccrualBasisNetIncomeMinor",
      label: "Modeled accrual basis net income minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      cashBasisNetIncomeMinor: value.cashBasisNetIncomeMinor as number,
      increaseEarnedUncollectedRevenueMinor:
        value.increaseEarnedUncollectedRevenueMinor as number,
      increaseUnearnedCashReceiptsMinor:
        value.increaseUnearnedCashReceiptsMinor as number,
      increaseUnpaidExpensesMinor: value.increaseUnpaidExpensesMinor as number,
      increaseUnexpiredPrepaidExpensesMinor:
        value.increaseUnexpiredPrepaidExpensesMinor as number,
    }),
});
export const run = tool.execute;
export default tool;

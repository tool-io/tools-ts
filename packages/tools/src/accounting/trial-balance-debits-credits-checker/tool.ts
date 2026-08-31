import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  money,
  integer,
  sumMoney,
  aligned,
  unique,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly accountNames: readonly string[];
  readonly signedDebitBalancesMinor: readonly number[];
  readonly callerToleranceMinor: number;
}>;
export type Output = Readonly<{
  readonly totalDebitBalancesMinor: number;
  readonly totalCreditBalancesMinor: number;
  readonly signedTrialBalanceDifferenceMinor: number;
  readonly withinCallerTolerance: boolean;
}>;
const inputFields = [
  { id: "accountNames", label: "Account names", kind: "stringList" },
  {
    id: "signedDebitBalancesMinor",
    label: "Signed debit balances minor",
    kind: "numberList",
  },
  {
    id: "callerToleranceMinor",
    label: "Caller tolerance minor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  money(input.callerToleranceMinor, "callerToleranceMinor");
  input.signedDebitBalancesMinor.forEach((v) =>
    integer(v, "signedDebitBalancesMinor"),
  );
  aligned(input.accountNames, input.signedDebitBalancesMinor, "accountNames");
  unique(input.accountNames, "accounts");
  const d = sumMoney(input.signedDebitBalancesMinor.filter((v) => v > 0)),
    c = sumMoney(
      input.signedDebitBalancesMinor.filter((v) => v < 0).map((v) => -v),
    ),
    gap = integer(d - c, "difference");
  return {
    totalDebitBalancesMinor: d,
    totalCreditBalancesMinor: c,
    signedTrialBalanceDifferenceMinor: gap,
    withinCallerTolerance: Math.abs(gap) <= input.callerToleranceMinor,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  accountNames: ["Cash", "Payable", "Equity"],
  signedDebitBalancesMinor: [1000, -400, -600],
  callerToleranceMinor: 0,
} satisfies Input;
export const exampleOutput = {
  totalDebitBalancesMinor: 1000,
  totalCreditBalancesMinor: 1000,
  signedTrialBalanceDifferenceMinor: 0,
  withinCallerTolerance: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "accounting/trial-balance-debits-credits-checker",
  title: "Trial Balance Debits Credits Checker",
  description:
    "Audit actual signed debit-positive ledger account balances in integer minor units; equal trial totals do not prove correct account classification, completeness or fraud absence.",
  inputs: inputFields,
  outputs: [
    {
      id: "totalDebitBalancesMinor",
      label: "Total debit balances minor",
      kind: "number",
    },
    {
      id: "totalCreditBalancesMinor",
      label: "Total credit balances minor",
      kind: "number",
    },
    {
      id: "signedTrialBalanceDifferenceMinor",
      label: "Signed trial balance difference minor",
      kind: "number",
    },
    {
      id: "withinCallerTolerance",
      label: "Within caller tolerance",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      accountNames: value.accountNames as readonly string[],
      signedDebitBalancesMinor:
        value.signedDebitBalancesMinor as readonly number[],
      callerToleranceMinor: value.callerToleranceMinor as number,
    }),
});
export const run = tool.execute;
export default tool;

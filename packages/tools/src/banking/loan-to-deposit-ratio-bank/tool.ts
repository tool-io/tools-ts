import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  aligned,
  binary,
  sumMoney,
  money,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedLoanComponentMinor: readonly number[];
  readonly callerLoanIncludedFlags: readonly number[];
  readonly observedDepositComponentMinor: readonly number[];
  readonly callerDepositIncludedFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly callerIncludedLoanMinor: number;
  readonly callerIncludedDepositMinor: number;
  readonly callerLoanDepositRatio: number;
}>;
const inputFields = [
  {
    id: "observedLoanComponentMinor",
    label: "Observed loan component minor",
    kind: "numberList",
  },
  {
    id: "callerLoanIncludedFlags",
    label: "Caller loan included flags",
    kind: "numberList",
  },
  {
    id: "observedDepositComponentMinor",
    label: "Observed deposit component minor",
    kind: "numberList",
  },
  {
    id: "callerDepositIncludedFlags",
    label: "Caller deposit included flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  for (const [v, f] of [
    [input.observedLoanComponentMinor, input.callerLoanIncludedFlags],
    [input.observedDepositComponentMinor, input.callerDepositIncludedFlags],
  ]) {
    aligned(v, f, "scope");
    binary(f, "inclusion");
    v.forEach((x) => money(x));
  }
  const loans = sumMoney(
      input.observedLoanComponentMinor.filter(
        (_, i) => input.callerLoanIncludedFlags[i],
      ),
    ),
    deposits = sumMoney(
      input.observedDepositComponentMinor.filter(
        (_, i) => input.callerDepositIncludedFlags[i],
      ),
    );
  positive(deposits, "included deposits");
  return {
    callerIncludedLoanMinor: loans,
    callerIncludedDepositMinor: deposits,
    callerLoanDepositRatio: loans / deposits,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedLoanComponentMinor: [100, 200],
  callerLoanIncludedFlags: [1, 0],
  observedDepositComponentMinor: [200, 100],
  callerDepositIncludedFlags: [1, 0],
} satisfies Input;
export const exampleOutput = {
  callerIncludedLoanMinor: 100,
  callerIncludedDepositMinor: 200,
  callerLoanDepositRatio: 0.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/loan-to-deposit-ratio-bank",
  title: "Loan To Deposit Ratio Bank Calculator",
  description:
    "Reconcile explicit caller loan/deposit classification inventories before ratio, not total nominal balances or liquidity/regulatory compliance. Caller independently verifies edition, jurisdiction, applicability and one currency; screening does not establish legal compliance, coverage or bank approval.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerIncludedLoanMinor",
      label: "Caller included loan minor",
      kind: "number",
    },
    {
      id: "callerIncludedDepositMinor",
      label: "Caller included deposit minor",
      kind: "number",
    },
    {
      id: "callerLoanDepositRatio",
      label: "Caller loan deposit ratio",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedLoanComponentMinor:
        value.observedLoanComponentMinor as readonly number[],
      callerLoanIncludedFlags:
        value.callerLoanIncludedFlags as readonly number[],
      observedDepositComponentMinor:
        value.observedDepositComponentMinor as readonly number[],
      callerDepositIncludedFlags:
        value.callerDepositIncludedFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;

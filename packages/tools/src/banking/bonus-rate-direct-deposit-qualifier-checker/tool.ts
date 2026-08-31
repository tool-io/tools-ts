import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  money,
  sumMoney,
  bounded,
  aligned,
  binary,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly observedDepositAmountsMinor: readonly number[];
  readonly callerQualifyingPayrollFlags: readonly number[];
  readonly callerMinimumTotalPayrollMinor: number;
  readonly callerMinimumPayrollEventCount: number;
}>;
export type Output = Readonly<{
  readonly qualifyingPayrollDepositTotalMinor: number;
  readonly qualifyingPayrollEventCount: number;
  readonly callerBonusRateConditionMet: boolean;
}>;
const inputFields = [
  {
    id: "observedDepositAmountsMinor",
    label: "Observed deposit amounts minor",
    kind: "numberList",
  },
  {
    id: "callerQualifyingPayrollFlags",
    label: "Caller qualifying payroll flags",
    kind: "numberList",
  },
  {
    id: "callerMinimumTotalPayrollMinor",
    label: "Caller minimum total payroll minor",
    kind: "number",
  },
  {
    id: "callerMinimumPayrollEventCount",
    label: "Caller minimum payroll event count",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedDepositAmountsMinor.forEach((v) =>
    money(v, "observedDepositAmountsMinor"),
  );
  money(input.callerMinimumTotalPayrollMinor, "callerMinimumTotalPayrollMinor");
  binary(input.callerQualifyingPayrollFlags, "callerQualifyingPayrollFlags");
  aligned(
    input.observedDepositAmountsMinor,
    input.callerQualifyingPayrollFlags,
    "observedDepositAmountsMinor",
  );
  bounded(input.callerMinimumPayrollEventCount, "minimumCount", 1, 10000);
  const values = input.observedDepositAmountsMinor.filter(
      (_, i) => input.callerQualifyingPayrollFlags[i] === 1,
    ),
    total = sumMoney(values);
  return {
    qualifyingPayrollDepositTotalMinor: total,
    qualifyingPayrollEventCount: values.length,
    callerBonusRateConditionMet:
      total >= input.callerMinimumTotalPayrollMinor &&
      values.length >= input.callerMinimumPayrollEventCount,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedDepositAmountsMinor: [100, 200, 500],
  callerQualifyingPayrollFlags: [1, 1, 0],
  callerMinimumTotalPayrollMinor: 300,
  callerMinimumPayrollEventCount: 2,
} satisfies Input;
export const exampleOutput = {
  qualifyingPayrollDepositTotalMinor: 300,
  qualifyingPayrollEventCount: 2,
  callerBonusRateConditionMet: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/bonus-rate-direct-deposit-qualifier-checker",
  title: "Bonus Rate Direct Deposit Qualifier Checker",
  description:
    "Audit actual caller identified payroll deposit amounts/counts against explicit cycle bonus-rate requirements; unlike existing requirement-name tracker, this measures numeric evidence, not bank classification of transfers or promised bonus eligibility.",
  inputs: inputFields,
  outputs: [
    {
      id: "qualifyingPayrollDepositTotalMinor",
      label: "Qualifying payroll deposit total minor",
      kind: "number",
    },
    {
      id: "qualifyingPayrollEventCount",
      label: "Qualifying payroll event count",
      kind: "number",
    },
    {
      id: "callerBonusRateConditionMet",
      label: "Caller bonus rate condition met",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      observedDepositAmountsMinor:
        value.observedDepositAmountsMinor as readonly number[],
      callerQualifyingPayrollFlags:
        value.callerQualifyingPayrollFlags as readonly number[],
      callerMinimumTotalPayrollMinor:
        value.callerMinimumTotalPayrollMinor as number,
      callerMinimumPayrollEventCount:
        value.callerMinimumPayrollEventCount as number,
    }),
});
export const run = tool.execute;
export default tool;

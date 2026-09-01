import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  sumMoney,
  weightedMinor,
  money,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly callerNonMortgageDebtMinor: readonly number[];
  readonly callerAnnualIncomeNeedMinor: number;
  readonly callerIncomeYears: number;
  readonly callerMortgageBalanceMinor: number;
  readonly callerEducationNeedsMinor: readonly number[];
  readonly callerAvailableProtectionAssetsMinor: readonly number[];
}>;
export type Output = Readonly<{
  readonly dimeDebtMinor: number;
  readonly dimeIncomeMinor: number;
  readonly dimeMortgageMinor: number;
  readonly dimeEducationMinor: number;
  readonly grossDimeNeedMinor: number;
  readonly signedNetDimeNeedMinor: number;
}>;
const inputFields = [
  {
    id: "callerNonMortgageDebtMinor",
    label: "Caller non mortgage debt minor",
    kind: "numberList",
  },
  {
    id: "callerAnnualIncomeNeedMinor",
    label: "Caller annual income need minor",
    kind: "number",
  },
  { id: "callerIncomeYears", label: "Caller income years", kind: "number" },
  {
    id: "callerMortgageBalanceMinor",
    label: "Caller mortgage balance minor",
    kind: "number",
  },
  {
    id: "callerEducationNeedsMinor",
    label: "Caller education needs minor",
    kind: "numberList",
  },
  {
    id: "callerAvailableProtectionAssetsMinor",
    label: "Caller available protection assets minor",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  [
    ...input.callerNonMortgageDebtMinor,
    input.callerAnnualIncomeNeedMinor,
    input.callerMortgageBalanceMinor,
    ...input.callerEducationNeedsMinor,
    ...input.callerAvailableProtectionAssetsMinor,
  ].forEach((v) => money(v));
  bounded(input.callerIncomeYears, "years", 0, 100);
  const debt = sumMoney(input.callerNonMortgageDebtMinor),
    income = weightedMinor(
      input.callerAnnualIncomeNeedMinor,
      input.callerIncomeYears,
      1,
    ),
    education = sumMoney(input.callerEducationNeedsMinor),
    gross = sumMoney([
      debt,
      income,
      input.callerMortgageBalanceMinor,
      education,
    ]);
  return {
    dimeDebtMinor: debt,
    dimeIncomeMinor: income,
    dimeMortgageMinor: input.callerMortgageBalanceMinor,
    dimeEducationMinor: education,
    grossDimeNeedMinor: gross,
    signedNetDimeNeedMinor:
      gross - sumMoney(input.callerAvailableProtectionAssetsMinor),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerNonMortgageDebtMinor: [100000, 200000],
  callerAnnualIncomeNeedMinor: 500000,
  callerIncomeYears: 5,
  callerMortgageBalanceMinor: 1000000,
  callerEducationNeedsMinor: [300000, 400000],
  callerAvailableProtectionAssetsMinor: [1000000],
} satisfies Input;
export const exampleOutput = {
  dimeDebtMinor: 300000,
  dimeIncomeMinor: 2500000,
  dimeMortgageMinor: 1000000,
  dimeEducationMinor: 700000,
  grossDimeNeedMinor: 4500000,
  signedNetDimeNeedMinor: 3500000,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/dime-formula-need-components",
  title: "DIME Formula Need Components Calculator",
  description:
    "Reconcile caller mutually exclusive DIME debt/income/mortgage/education ledger and available assets; mortgage excluded from debt by caller, no double-count inference, discounting or coverage recommendation.",
  inputs: inputFields,
  outputs: [
    { id: "dimeDebtMinor", label: "Dime debt minor", kind: "number" },
    { id: "dimeIncomeMinor", label: "Dime income minor", kind: "number" },
    { id: "dimeMortgageMinor", label: "Dime mortgage minor", kind: "number" },
    { id: "dimeEducationMinor", label: "Dime education minor", kind: "number" },
    {
      id: "grossDimeNeedMinor",
      label: "Gross dime need minor",
      kind: "number",
    },
    {
      id: "signedNetDimeNeedMinor",
      label: "Signed net dime need minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerNonMortgageDebtMinor:
        value.callerNonMortgageDebtMinor as readonly number[],
      callerAnnualIncomeNeedMinor: value.callerAnnualIncomeNeedMinor as number,
      callerIncomeYears: value.callerIncomeYears as number,
      callerMortgageBalanceMinor: value.callerMortgageBalanceMinor as number,
      callerEducationNeedsMinor:
        value.callerEducationNeedsMinor as readonly number[],
      callerAvailableProtectionAssetsMinor:
        value.callerAvailableProtectionAssetsMinor as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;

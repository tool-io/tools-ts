import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  bounded,
  integer,
  aligned,
  sumMoney,
  roundMinor,
  money,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedBankNetIncomeMinor: number;
  readonly observedAssetBalanceMinor: readonly number[];
  readonly observedAssetBalanceDays: readonly number[];
  readonly callerAnnualizationDays: number;
}>;
export type Output = Readonly<{
  readonly dayWeightedAverageBankAssetsMinor: number;
  readonly annualizedObservedBankRoa: number;
}>;
const inputFields = [
  {
    id: "observedBankNetIncomeMinor",
    label: "Observed bank net income minor",
    kind: "number",
  },
  {
    id: "observedAssetBalanceMinor",
    label: "Observed asset balance minor",
    kind: "numberList",
  },
  {
    id: "observedAssetBalanceDays",
    label: "Observed asset balance days",
    kind: "numberList",
  },
  {
    id: "callerAnnualizationDays",
    label: "Caller annualization days",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  integer(input.observedBankNetIncomeMinor, "signed income");
  input.observedAssetBalanceMinor.forEach((v) => money(v));
  input.observedAssetBalanceDays.forEach((v) => bounded(v, "days", 1, 36600));
  bounded(input.callerAnnualizationDays, "year days", 1, 36600);
  aligned(
    input.observedAssetBalanceMinor,
    input.observedAssetBalanceDays,
    "assets",
  );
  const days = sumMoney(input.observedAssetBalanceDays),
    average = roundMinor(
      input.observedAssetBalanceMinor.reduce(
        (s, v, i) => s + BigInt(v) * BigInt(input.observedAssetBalanceDays[i]),
        0n,
      ),
      BigInt(days),
    );
  positive(average, "average assets");
  return {
    dayWeightedAverageBankAssetsMinor: average,
    annualizedObservedBankRoa:
      ((input.observedBankNetIncomeMinor / average) *
        input.callerAnnualizationDays) /
      days,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedBankNetIncomeMinor: 100,
  observedAssetBalanceMinor: [1000, 2000],
  observedAssetBalanceDays: [10, 30],
  callerAnnualizationDays: 360,
} satisfies Input;
export const exampleOutput = {
  dayWeightedAverageBankAssetsMinor: 1750,
  annualizedObservedBankRoa: 0.5142857142857142,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/roa-return-assets-bank",
  title: "ROA Return On Assets Bank Calculator",
  description:
    "Audit actual signed bank net income over day-weighted asset balances with caller annualization basis, exact average-minor rounding; not ending-assets generic ROA. Caller independently verifies edition, jurisdiction, applicability and one currency; screening does not establish legal compliance, coverage or bank approval.",
  inputs: inputFields,
  outputs: [
    {
      id: "dayWeightedAverageBankAssetsMinor",
      label: "Day weighted average bank assets minor",
      kind: "number",
    },
    {
      id: "annualizedObservedBankRoa",
      label: "Annualized observed bank roa",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedBankNetIncomeMinor: value.observedBankNetIncomeMinor as number,
      observedAssetBalanceMinor:
        value.observedAssetBalanceMinor as readonly number[],
      observedAssetBalanceDays:
        value.observedAssetBalanceDays as readonly number[],
      callerAnnualizationDays: value.callerAnnualizationDays as number,
    }),
});
export const run = tool.execute;
export default tool;

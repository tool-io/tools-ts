import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  bounded,
  aligned,
  sumMoney,
  roundMinor,
  money,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedEarningAssetBalancesMinor: readonly number[];
  readonly observedBalancePeriodDays: readonly number[];
  readonly observedMatchedInterestIncomeMinor: readonly number[];
  readonly callerAnnualizationDays: number;
}>;
export type Output = Readonly<{
  readonly dayWeightedEarningAssetsMinor: number;
  readonly totalMatchedInterestIncomeMinor: number;
  readonly annualizedObservedEarningAssetYield: number;
}>;
const inputFields = [
  {
    id: "observedEarningAssetBalancesMinor",
    label: "Observed earning asset balances minor",
    kind: "numberList",
  },
  {
    id: "observedBalancePeriodDays",
    label: "Observed balance period days",
    kind: "numberList",
  },
  {
    id: "observedMatchedInterestIncomeMinor",
    label: "Observed matched interest income minor",
    kind: "numberList",
  },
  {
    id: "callerAnnualizationDays",
    label: "Caller annualization days",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  for (const v of [
    input.observedEarningAssetBalancesMinor,
    input.observedMatchedInterestIncomeMinor,
  ])
    v.forEach((x) => money(x));
  input.observedBalancePeriodDays.forEach((v) => bounded(v, "days", 1, 36600));
  bounded(input.callerAnnualizationDays, "annualization", 1, 36600);
  aligned(
    input.observedEarningAssetBalancesMinor,
    input.observedBalancePeriodDays,
    "periods",
  );
  aligned(
    input.observedEarningAssetBalancesMinor,
    input.observedMatchedInterestIncomeMinor,
    "income",
  );
  const days = sumMoney(input.observedBalancePeriodDays),
    average = roundMinor(
      input.observedEarningAssetBalancesMinor.reduce(
        (s, v, i) => s + BigInt(v) * BigInt(input.observedBalancePeriodDays[i]),
        0n,
      ),
      BigInt(days),
    ),
    income = sumMoney(input.observedMatchedInterestIncomeMinor);
  positive(average, "earning assets");
  return {
    dayWeightedEarningAssetsMinor: average,
    totalMatchedInterestIncomeMinor: income,
    annualizedObservedEarningAssetYield:
      ((income / average) * input.callerAnnualizationDays) / days,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedEarningAssetBalancesMinor: [1000, 2000],
  observedBalancePeriodDays: [10, 30],
  observedMatchedInterestIncomeMinor: [10, 30],
  callerAnnualizationDays: 360,
} satisfies Input;
export const exampleOutput = {
  dayWeightedEarningAssetsMinor: 1750,
  totalMatchedInterestIncomeMinor: 40,
  annualizedObservedEarningAssetYield: 0.2057142857142857,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/yield-earning-assets-computed",
  title: "Yield On Earning Assets Computed Calculator",
  description:
    "Audit actual matched interest-income ledger against day-weighted earning-asset inventory and explicit annualization, not generic return/net interest margin. Caller independently verifies edition, jurisdiction, applicability and one currency; screening does not establish legal compliance, coverage or bank approval.",
  inputs: inputFields,
  outputs: [
    {
      id: "dayWeightedEarningAssetsMinor",
      label: "Day weighted earning assets minor",
      kind: "number",
    },
    {
      id: "totalMatchedInterestIncomeMinor",
      label: "Total matched interest income minor",
      kind: "number",
    },
    {
      id: "annualizedObservedEarningAssetYield",
      label: "Annualized observed earning asset yield",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedEarningAssetBalancesMinor:
        value.observedEarningAssetBalancesMinor as readonly number[],
      observedBalancePeriodDays:
        value.observedBalancePeriodDays as readonly number[],
      observedMatchedInterestIncomeMinor:
        value.observedMatchedInterestIncomeMinor as readonly number[],
      callerAnnualizationDays: value.callerAnnualizationDays as number,
    }),
});
export const run = tool.execute;
export default tool;

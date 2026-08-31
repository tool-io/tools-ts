import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  money,
  integer,
  sumMoney,
  positive,
  bounded,
  aligned,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly periodInterestIncomeMinor: number;
  readonly periodInterestExpenseMinor: number;
  readonly earningAssetBalanceBinsMinor: readonly number[];
  readonly earningAssetBinDays: readonly number[];
  readonly callerAnnualDayBasis: number;
}>;
export type Output = Readonly<{
  readonly periodNetInterestIncomeMinor: number;
  readonly observedPeriodDays: number;
  readonly timeWeightedAverageEarningAssetsMinor: number;
  readonly annualizedObservedNimPercent: number;
}>;
const inputFields = [
  {
    id: "periodInterestIncomeMinor",
    label: "Period interest income minor",
    kind: "number",
  },
  {
    id: "periodInterestExpenseMinor",
    label: "Period interest expense minor",
    kind: "number",
  },
  {
    id: "earningAssetBalanceBinsMinor",
    label: "Earning asset balance bins minor",
    kind: "numberList",
  },
  {
    id: "earningAssetBinDays",
    label: "Earning asset bin days",
    kind: "numberList",
  },
  {
    id: "callerAnnualDayBasis",
    label: "Caller annual day basis",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  money(input.periodInterestIncomeMinor, "periodInterestIncomeMinor");
  money(input.periodInterestExpenseMinor, "periodInterestExpenseMinor");
  input.earningAssetBalanceBinsMinor.forEach((v) =>
    money(v, "earningAssetBalanceBinsMinor"),
  );
  aligned(
    input.earningAssetBalanceBinsMinor,
    input.earningAssetBinDays,
    "earningAssetBalanceBinsMinor",
  );
  bounded(input.callerAnnualDayBasis, "basis", 1, 366);
  input.earningAssetBinDays.forEach((v) => bounded(v, "days", 1, 3660));
  const days = sumMoney(input.earningAssetBinDays),
    weighted = input.earningAssetBalanceBinsMinor.reduce(
      (s, v, i) => s + BigInt(v) * BigInt(input.earningAssetBinDays[i]),
      0n,
    ),
    avg = positive(Number(weighted) / days, "earningAssets"),
    net = integer(
      input.periodInterestIncomeMinor - input.periodInterestExpenseMinor,
      "netIncome",
    );
  return {
    periodNetInterestIncomeMinor: net,
    observedPeriodDays: days,
    timeWeightedAverageEarningAssetsMinor: avg,
    annualizedObservedNimPercent:
      100 * (net / avg) * (input.callerAnnualDayBasis / days),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  periodInterestIncomeMinor: 100,
  periodInterestExpenseMinor: 30,
  earningAssetBalanceBinsMinor: [1000, 2000],
  earningAssetBinDays: [30, 60],
  callerAnnualDayBasis: 360,
} satisfies Input;
export const exampleOutput = {
  periodNetInterestIncomeMinor: 70,
  observedPeriodDays: 90,
  timeWeightedAverageEarningAssetsMinor: 1666.6666666666667,
  annualizedObservedNimPercent: 16.8,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/net-interest-margin-nim",
  title: "Net Interest Margin NIM Calculator",
  description:
    "Compute realized annualized NIM from actual income/expense and day-weighted earning-asset balance bins, preserving negative spread; bins must cover caller income period, no end-balance substitution, compounding or profit forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "periodNetInterestIncomeMinor",
      label: "Period net interest income minor",
      kind: "number",
    },
    { id: "observedPeriodDays", label: "Observed period days", kind: "number" },
    {
      id: "timeWeightedAverageEarningAssetsMinor",
      label: "Time weighted average earning assets minor",
      kind: "number",
    },
    {
      id: "annualizedObservedNimPercent",
      label: "Annualized observed nim percent",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      periodInterestIncomeMinor: value.periodInterestIncomeMinor as number,
      periodInterestExpenseMinor: value.periodInterestExpenseMinor as number,
      earningAssetBalanceBinsMinor:
        value.earningAssetBalanceBinsMinor as readonly number[],
      earningAssetBinDays: value.earningAssetBinDays as readonly number[],
      callerAnnualDayBasis: value.callerAnnualDayBasis as number,
    }),
});
export const run = tool.execute;
export default tool;

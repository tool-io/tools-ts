import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  integer,
  aligned,
  unique,
  sumMoney,
  weightedMinor,
  money,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly debtIds: readonly string[];
  readonly openingDebtMinor: readonly number[];
  readonly callerAnnualAprBps: readonly number[];
  readonly callerMonthlyMinimumMinor: readonly number[];
  readonly callerMonthlyBudgetMinor: number;
  readonly callerMaximumMonths: number;
}>;
export type Output = Readonly<{
  readonly snowballRemainingMinor: readonly number[];
  readonly avalancheRemainingMinor: readonly number[];
  readonly snowballInterestMinor: number;
  readonly avalancheInterestMinor: number;
}>;
const inputFields = [
  { id: "debtIds", label: "Debt ids", kind: "stringList" },
  { id: "openingDebtMinor", label: "Opening debt minor", kind: "numberList" },
  {
    id: "callerAnnualAprBps",
    label: "Caller annual apr bps",
    kind: "numberList",
  },
  {
    id: "callerMonthlyMinimumMinor",
    label: "Caller monthly minimum minor",
    kind: "numberList",
  },
  {
    id: "callerMonthlyBudgetMinor",
    label: "Caller monthly budget minor",
    kind: "number",
  },
  { id: "callerMaximumMonths", label: "Caller maximum months", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  unique(input.debtIds, "debts");
  for (const values of [
    input.openingDebtMinor,
    input.callerAnnualAprBps,
    input.callerMonthlyMinimumMinor,
  ])
    aligned(input.debtIds, values, "debts");
  input.openingDebtMinor.forEach((v) => money(v));
  input.callerAnnualAprBps.forEach((v) => bounded(v, "APR", 0, 100000));
  input.callerMonthlyMinimumMinor.forEach((v) => money(v));
  money(input.callerMonthlyBudgetMinor);
  bounded(input.callerMaximumMonths, "months", 1, 600);
  if (input.debtIds.length > 128) simpleError("debts", "At most128 debts.");
  const solve = (avalanche: boolean) => {
    const balances = [...input.openingDebtMinor];
    let interest = 0;
    for (
      let m = 0;
      m < input.callerMaximumMonths && balances.some((v) => v > 0);
      m++
    ) {
      const charges = balances.map((v, i) =>
        weightedMinor(v, input.callerAnnualAprBps[i], 120000),
      );
      interest = integer(interest + sumMoney(charges), "interest");
      charges.forEach((v, i) => {
        balances[i] = sumMoney([balances[i], v]);
      });
      const minimum = balances.map((v, i) =>
        Math.min(v, input.callerMonthlyMinimumMinor[i]),
      );
      let left = input.callerMonthlyBudgetMinor - sumMoney(minimum);
      if (left < 0)
        simpleError("budget", "Budget covers all caller minimums required.");
      minimum.forEach((v, i) => {
        balances[i] -= v;
      });
      const order = balances
        .map((_, i) => i)
        .filter((i) => balances[i] > 0)
        .sort((a, b) =>
          avalanche
            ? input.callerAnnualAprBps[b] - input.callerAnnualAprBps[a] || a - b
            : balances[a] - balances[b] || a - b,
        );
      for (const i of order) {
        const paid = Math.min(left, balances[i]);
        balances[i] -= paid;
        left -= paid;
      }
    }
    return { balances, interest };
  };
  const s = solve(false),
    a = solve(true);
  return {
    snowballRemainingMinor: s.balances,
    avalancheRemainingMinor: a.balances,
    snowballInterestMinor: s.interest,
    avalancheInterestMinor: a.interest,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  debtIds: ["small", "large"],
  openingDebtMinor: [100, 200],
  callerAnnualAprBps: [0, 12000],
  callerMonthlyMinimumMinor: [10, 10],
  callerMonthlyBudgetMinor: 150,
  callerMaximumMonths: 1,
} satisfies Input;
export const exampleOutput = {
  snowballRemainingMinor: [0, 170],
  avalancheRemainingMinor: [90, 80],
  snowballInterestMinor: 20,
  avalancheInterestMinor: 20,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/snowball-vs-avalanche-payoff-compare",
  title: "Snowball vs Avalanche Payoff Compare Tool",
  description:
    "Compare full explicit debt ledgers under smallest remaining balance versus highestAPR extra allocation after rounded interest/minimums, stable original-index ties and same budget. Caller independently verifies edition, jurisdiction, applicability and one currency; screening does not establish legal compliance, coverage or bank approval.",
  inputs: inputFields,
  outputs: [
    {
      id: "snowballRemainingMinor",
      label: "Snowball remaining minor",
      kind: "numberList",
    },
    {
      id: "avalancheRemainingMinor",
      label: "Avalanche remaining minor",
      kind: "numberList",
    },
    {
      id: "snowballInterestMinor",
      label: "Snowball interest minor",
      kind: "number",
    },
    {
      id: "avalancheInterestMinor",
      label: "Avalanche interest minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      debtIds: value.debtIds as readonly string[],
      openingDebtMinor: value.openingDebtMinor as readonly number[],
      callerAnnualAprBps: value.callerAnnualAprBps as readonly number[],
      callerMonthlyMinimumMinor:
        value.callerMonthlyMinimumMinor as readonly number[],
      callerMonthlyBudgetMinor: value.callerMonthlyBudgetMinor as number,
      callerMaximumMonths: value.callerMaximumMonths as number,
    }),
});
export const run = tool.execute;
export default tool;

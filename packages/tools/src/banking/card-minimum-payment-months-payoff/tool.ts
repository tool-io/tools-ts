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
  sumMoney,
  weightedMinor,
  money,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly openingCardBalanceMinor: number;
  readonly callerMonthlyRateBps: number;
  readonly callerMinimumBalanceBps: number;
  readonly callerMinimumFloorMinor: number;
  readonly callerMaximumMonths: number;
}>;
export type Output = Readonly<{
  readonly observedPayoffMonthCount: number;
  readonly totalModeledInterestMinor: number;
  readonly remainingAfterHorizonMinor: number;
  readonly monthlyPaymentMinor: readonly number[];
}>;
const inputFields = [
  {
    id: "openingCardBalanceMinor",
    label: "Opening card balance minor",
    kind: "number",
  },
  {
    id: "callerMonthlyRateBps",
    label: "Caller monthly rate bps",
    kind: "number",
  },
  {
    id: "callerMinimumBalanceBps",
    label: "Caller minimum balance bps",
    kind: "number",
  },
  {
    id: "callerMinimumFloorMinor",
    label: "Caller minimum floor minor",
    kind: "number",
  },
  { id: "callerMaximumMonths", label: "Caller maximum months", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  money(input.openingCardBalanceMinor);
  bounded(input.callerMonthlyRateBps, "bps", 0, 10000);
  bounded(input.callerMinimumBalanceBps, "minimum bps", 0, 10000);
  money(input.callerMinimumFloorMinor);
  bounded(input.callerMaximumMonths, "months", 1, 600);
  let balance = input.openingCardBalanceMinor;
  const payments: number[] = [],
    charges: number[] = [];
  for (let m = 0; m < input.callerMaximumMonths && balance > 0; m++) {
    const charge = weightedMinor(balance, input.callerMonthlyRateBps, 10000),
      due = sumMoney([balance, charge]),
      pay = Math.min(
        due,
        Math.max(
          input.callerMinimumFloorMinor,
          weightedMinor(due, input.callerMinimumBalanceBps, 10000),
        ),
      );
    if (pay <= charge)
      simpleError(
        "minimum",
        "Explicit positive amortization required each period.",
      );
    balance = due - pay;
    payments.push(pay);
    charges.push(charge);
  }
  return {
    observedPayoffMonthCount: balance === 0 ? payments.length : -1,
    totalModeledInterestMinor: sumMoney(charges),
    remainingAfterHorizonMinor: balance,
    monthlyPaymentMinor: payments,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  openingCardBalanceMinor: 1000,
  callerMonthlyRateBps: 0,
  callerMinimumBalanceBps: 5000,
  callerMinimumFloorMinor: 100,
  callerMaximumMonths: 12,
} satisfies Input;
export const exampleOutput = {
  observedPayoffMonthCount: 5,
  totalModeledInterestMinor: 0,
  remainingAfterHorizonMinor: 0,
  monthlyPaymentMinor: [500, 250, 125, 100, 25],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/card-minimum-payment-months-payoff",
  title: "Card Minimum Payment Months Payoff Calculator",
  description:
    "Route exact rounded card monthly balance/interest ledger with explicit minimum percentage of post-interest balance and floor; payoff sentinel−1 beyond 600-month horizon. Caller independently verifies edition, jurisdiction, applicability and one currency; screening does not establish legal compliance, coverage or bank approval.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedPayoffMonthCount",
      label: "Observed payoff month count",
      kind: "number",
    },
    {
      id: "totalModeledInterestMinor",
      label: "Total modeled interest minor",
      kind: "number",
    },
    {
      id: "remainingAfterHorizonMinor",
      label: "Remaining after horizon minor",
      kind: "number",
    },
    {
      id: "monthlyPaymentMinor",
      label: "Monthly payment minor",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      openingCardBalanceMinor: value.openingCardBalanceMinor as number,
      callerMonthlyRateBps: value.callerMonthlyRateBps as number,
      callerMinimumBalanceBps: value.callerMinimumBalanceBps as number,
      callerMinimumFloorMinor: value.callerMinimumFloorMinor as number,
      callerMaximumMonths: value.callerMaximumMonths as number,
    }),
});
export const run = tool.execute;
export default tool;

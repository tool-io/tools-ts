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
  sumMoney,
  weightedMinor,
  money,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly callerLoanPrincipalMinor: number;
  readonly callerDiscountPointsBps: number;
  readonly callerOtherIncrementalClosingMinor: number;
  readonly callerMonthlyBaselinePaymentsMinor: readonly number[];
  readonly callerMonthlyBoughtDownPaymentsMinor: readonly number[];
}>;
export type Output = Readonly<{
  readonly callerIncrementalClosingCostMinor: number;
  readonly cumulativeSignedBuydownSavingsMinor: readonly number[];
  readonly firstObservedBuydownBreakEvenMonth: number;
}>;
const inputFields = [
  {
    id: "callerLoanPrincipalMinor",
    label: "Caller loan principal minor",
    kind: "number",
  },
  {
    id: "callerDiscountPointsBps",
    label: "Caller discount points bps",
    kind: "number",
  },
  {
    id: "callerOtherIncrementalClosingMinor",
    label: "Caller other incremental closing minor",
    kind: "number",
  },
  {
    id: "callerMonthlyBaselinePaymentsMinor",
    label: "Caller monthly baseline payments minor",
    kind: "numberList",
  },
  {
    id: "callerMonthlyBoughtDownPaymentsMinor",
    label: "Caller monthly bought down payments minor",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  money(input.callerLoanPrincipalMinor);
  money(input.callerOtherIncrementalClosingMinor);
  bounded(input.callerDiscountPointsBps, "points bps", 0, 10000);
  aligned(
    input.callerMonthlyBaselinePaymentsMinor,
    input.callerMonthlyBoughtDownPaymentsMinor,
    "months",
  );
  if (input.callerMonthlyBaselinePaymentsMinor.length > 600)
    simpleError("months", "At most600 matched payment periods.");
  const closing = sumMoney([
    weightedMinor(
      input.callerLoanPrincipalMinor,
      input.callerDiscountPointsBps,
      10000,
    ),
    input.callerOtherIncrementalClosingMinor,
  ]);
  let saved = -closing;
  const cumulative = input.callerMonthlyBaselinePaymentsMinor.map((v, i) => {
    money(v);
    money(input.callerMonthlyBoughtDownPaymentsMinor[i]);
    saved = integer(
      saved + v - input.callerMonthlyBoughtDownPaymentsMinor[i],
      "savings",
    );
    return saved;
  });
  return {
    callerIncrementalClosingCostMinor: closing,
    cumulativeSignedBuydownSavingsMinor: cumulative,
    firstObservedBuydownBreakEvenMonth:
      cumulative.findIndex((v) => v >= 0) + 1 || -1,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerLoanPrincipalMinor: 10000,
  callerDiscountPointsBps: 100,
  callerOtherIncrementalClosingMinor: 50,
  callerMonthlyBaselinePaymentsMinor: [100, 100, 100],
  callerMonthlyBoughtDownPaymentsMinor: [50, 50, 50],
} satisfies Input;
export const exampleOutput = {
  callerIncrementalClosingCostMinor: 150,
  cumulativeSignedBuydownSavingsMinor: [-100, -50, 0],
  firstObservedBuydownBreakEvenMonth: 3,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/discount-points-buydown-breakeven-months",
  title: "Discount Points Buydown Breakeven Months Calculator",
  description:
    "Route actual caller matched baseline/buydown payment ledgers against exact points+incremental closing cost, reversals/horizon retained; no constant savings, financing/holding-period or tax assumptions. Caller independently verifies edition, jurisdiction, applicability and one currency; screening does not establish legal compliance, coverage or bank approval.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerIncrementalClosingCostMinor",
      label: "Caller incremental closing cost minor",
      kind: "number",
    },
    {
      id: "cumulativeSignedBuydownSavingsMinor",
      label: "Cumulative signed buydown savings minor",
      kind: "numberList",
    },
    {
      id: "firstObservedBuydownBreakEvenMonth",
      label: "First observed buydown break even month",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerLoanPrincipalMinor: value.callerLoanPrincipalMinor as number,
      callerDiscountPointsBps: value.callerDiscountPointsBps as number,
      callerOtherIncrementalClosingMinor:
        value.callerOtherIncrementalClosingMinor as number,
      callerMonthlyBaselinePaymentsMinor:
        value.callerMonthlyBaselinePaymentsMinor as readonly number[],
      callerMonthlyBoughtDownPaymentsMinor:
        value.callerMonthlyBoughtDownPaymentsMinor as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;

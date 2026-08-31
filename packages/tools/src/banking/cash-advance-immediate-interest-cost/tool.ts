import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  money,
  sumMoney,
  bounded,
  roundMinor,
  weightedMinor,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly cashAdvancedMinor: number;
  readonly callerAdvanceFeeBasisPoints: number;
  readonly callerMinimumAdvanceFeeMinor: number;
  readonly callerAnnualRateBasisPoints: number;
  readonly elapsedCivilDays: number;
  readonly callerAnnualDayBasis: number;
  readonly callerFeeFinancedAndInterestBearing: boolean;
}>;
export type Output = Readonly<{
  readonly appliedCashAdvanceFeeMinor: number;
  readonly modeledImmediateInterestMinor: number;
  readonly totalModeledAdvanceCostMinor: number;
  readonly modeledRepaymentMinor: number;
}>;
const inputFields = [
  { id: "cashAdvancedMinor", label: "Cash advanced minor", kind: "number" },
  {
    id: "callerAdvanceFeeBasisPoints",
    label: "Caller advance fee basis points",
    kind: "number",
  },
  {
    id: "callerMinimumAdvanceFeeMinor",
    label: "Caller minimum advance fee minor",
    kind: "number",
  },
  {
    id: "callerAnnualRateBasisPoints",
    label: "Caller annual rate basis points",
    kind: "number",
  },
  { id: "elapsedCivilDays", label: "Elapsed civil days", kind: "number" },
  {
    id: "callerAnnualDayBasis",
    label: "Caller annual day basis",
    kind: "number",
  },
  {
    id: "callerFeeFinancedAndInterestBearing",
    label: "Caller fee financed and interest bearing",
    kind: "boolean",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  money(input.cashAdvancedMinor, "cashAdvancedMinor");
  money(input.callerMinimumAdvanceFeeMinor, "callerMinimumAdvanceFeeMinor");
  bounded(input.callerAdvanceFeeBasisPoints, "fee", 0, 10000);
  bounded(input.callerAnnualRateBasisPoints, "rate", 0, 100000);
  bounded(input.elapsedCivilDays, "days", 0, 3660);
  bounded(input.callerAnnualDayBasis, "basis", 1, 366);
  const fee =
      input.cashAdvancedMinor === 0
        ? 0
        : Math.max(
            input.callerMinimumAdvanceFeeMinor,
            weightedMinor(
              input.cashAdvancedMinor,
              input.callerAdvanceFeeBasisPoints,
              10000,
            ),
          ),
    base = sumMoney([
      input.cashAdvancedMinor,
      input.callerFeeFinancedAndInterestBearing ? fee : 0,
    ]),
    interest = roundMinor(
      BigInt(base) *
        BigInt(input.callerAnnualRateBasisPoints) *
        BigInt(input.elapsedCivilDays),
      BigInt(input.callerAnnualDayBasis) * 10000n,
    ),
    cost = sumMoney([fee, interest]);
  return {
    appliedCashAdvanceFeeMinor: fee,
    modeledImmediateInterestMinor: interest,
    totalModeledAdvanceCostMinor: cost,
    modeledRepaymentMinor: sumMoney([input.cashAdvancedMinor, cost]),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  cashAdvancedMinor: 10000,
  callerAdvanceFeeBasisPoints: 300,
  callerMinimumAdvanceFeeMinor: 500,
  callerAnnualRateBasisPoints: 3650,
  elapsedCivilDays: 10,
  callerAnnualDayBasis: 365,
  callerFeeFinancedAndInterestBearing: true,
} satisfies Input;
export const exampleOutput = {
  appliedCashAdvanceFeeMinor: 500,
  modeledImmediateInterestMinor: 105,
  totalModeledAdvanceCostMinor: 605,
  modeledRepaymentMinor: 10605,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/cash-advance-immediate-interest-cost",
  title: "Cash Advance Immediate Interest Cost Calculator",
  description:
    "Model caller cash-advance percentage/minimum fee and simple immediate daily interest with explicit fee-financing treatment; no grace, payment allocation or daily compounding assumed, zero advance carries zero minimum fee.",
  inputs: inputFields,
  outputs: [
    {
      id: "appliedCashAdvanceFeeMinor",
      label: "Applied cash advance fee minor",
      kind: "number",
    },
    {
      id: "modeledImmediateInterestMinor",
      label: "Modeled immediate interest minor",
      kind: "number",
    },
    {
      id: "totalModeledAdvanceCostMinor",
      label: "Total modeled advance cost minor",
      kind: "number",
    },
    {
      id: "modeledRepaymentMinor",
      label: "Modeled repayment minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      cashAdvancedMinor: value.cashAdvancedMinor as number,
      callerAdvanceFeeBasisPoints: value.callerAdvanceFeeBasisPoints as number,
      callerMinimumAdvanceFeeMinor:
        value.callerMinimumAdvanceFeeMinor as number,
      callerAnnualRateBasisPoints: value.callerAnnualRateBasisPoints as number,
      elapsedCivilDays: value.elapsedCivilDays as number,
      callerAnnualDayBasis: value.callerAnnualDayBasis as number,
      callerFeeFinancedAndInterestBearing:
        value.callerFeeFinancedAndInterestBearing as boolean,
    }),
});
export const run = tool.execute;
export default tool;

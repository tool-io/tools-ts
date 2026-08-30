import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  money,
  integer,
  bounded,
  weightedMinor,
  signedSum,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly openingLeaseLiabilityMinor: number;
  readonly openingRouCarryingMinor: number;
  readonly callerPeriodInterestBasisPoints: number;
  readonly periodCashPaymentMinor: number;
  readonly callerStraightLineLeaseCostMinor: number;
}>;
export type Output = Readonly<{
  readonly periodLiabilityInterestMinor: number;
  readonly closingLeaseLiabilityMinor: number;
  readonly impliedRouAmortizationMinor: number;
  readonly closingRouCarryingMinor: number;
}>;
const inputFields = [
  {
    id: "openingLeaseLiabilityMinor",
    label: "Opening lease liability minor",
    kind: "number",
  },
  {
    id: "openingRouCarryingMinor",
    label: "Opening rou carrying minor",
    kind: "number",
  },
  {
    id: "callerPeriodInterestBasisPoints",
    label: "Caller period interest basis points",
    kind: "number",
  },
  {
    id: "periodCashPaymentMinor",
    label: "Period cash payment minor",
    kind: "number",
  },
  {
    id: "callerStraightLineLeaseCostMinor",
    label: "Caller straight line lease cost minor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  money(input.openingLeaseLiabilityMinor, "openingLeaseLiabilityMinor");
  money(input.openingRouCarryingMinor, "openingRouCarryingMinor");
  money(input.periodCashPaymentMinor, "periodCashPaymentMinor");
  money(
    input.callerStraightLineLeaseCostMinor,
    "callerStraightLineLeaseCostMinor",
  );
  bounded(input.callerPeriodInterestBasisPoints, "rate", 0, 10000);
  const interest = weightedMinor(
      input.openingLeaseLiabilityMinor,
      input.callerPeriodInterestBasisPoints,
      10000,
    ),
    liability = signedSum([
      input.openingLeaseLiabilityMinor,
      interest,
      -input.periodCashPaymentMinor,
    ]),
    amort = integer(
      input.callerStraightLineLeaseCostMinor - interest,
      "amortization",
    ),
    rou = integer(input.openingRouCarryingMinor - amort, "rou");
  if (liability < 0 || rou < 0)
    simpleError(
      "balances",
      "Nonnegative closing liability/ROU required; payoff overpayments or writeoffs need another model.",
    );
  return {
    periodLiabilityInterestMinor: interest,
    closingLeaseLiabilityMinor: liability,
    impliedRouAmortizationMinor: amort,
    closingRouCarryingMinor: rou,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  openingLeaseLiabilityMinor: 1000,
  openingRouCarryingMinor: 1200,
  callerPeriodInterestBasisPoints: 100,
  periodCashPaymentMinor: 100,
  callerStraightLineLeaseCostMinor: 120,
} satisfies Input;
export const exampleOutput = {
  periodLiabilityInterestMinor: 10,
  closingLeaseLiabilityMinor: 910,
  impliedRouAmortizationMinor: 110,
  closingRouCarryingMinor: 1090,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "accounting/operating-lease-single-lease-cost-straight-line-checker",
  title: "Operating Lease Single Lease Cost Straight Line Checker",
  description:
    "Bridge operating-lease single cost into explicit period liability interest and implied ROU amortization, including negative amortization when caller cost is below interest; no lease classification or impairment/remeasurement model.",
  inputs: inputFields,
  outputs: [
    {
      id: "periodLiabilityInterestMinor",
      label: "Period liability interest minor",
      kind: "number",
    },
    {
      id: "closingLeaseLiabilityMinor",
      label: "Closing lease liability minor",
      kind: "number",
    },
    {
      id: "impliedRouAmortizationMinor",
      label: "Implied rou amortization minor",
      kind: "number",
    },
    {
      id: "closingRouCarryingMinor",
      label: "Closing rou carrying minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      openingLeaseLiabilityMinor: value.openingLeaseLiabilityMinor as number,
      openingRouCarryingMinor: value.openingRouCarryingMinor as number,
      callerPeriodInterestBasisPoints:
        value.callerPeriodInterestBasisPoints as number,
      periodCashPaymentMinor: value.periodCashPaymentMinor as number,
      callerStraightLineLeaseCostMinor:
        value.callerStraightLineLeaseCostMinor as number,
    }),
});
export const run = tool.execute;
export default tool;

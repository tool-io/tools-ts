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
  money,
  share,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedOpeningLoanPrincipalMinor: number;
  readonly callerPeriodInterestBasisPoints: readonly number[];
  readonly observedEndPeriodInterestPaymentsMinor: readonly number[];
}>;
export type Output = Readonly<{
  readonly roundedPeriodInterestAccrualMinor: readonly number[];
  readonly closingCapitalizedLoanMinor: number;
}>;
const inputFields = [
  {
    id: "observedOpeningLoanPrincipalMinor",
    label: "Observed opening loan principal minor",
    kind: "number",
  },
  {
    id: "callerPeriodInterestBasisPoints",
    label: "Caller period interest basis points",
    kind: "numberList",
  },
  {
    id: "observedEndPeriodInterestPaymentsMinor",
    label: "Observed end period interest payments minor",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  money(input.observedOpeningLoanPrincipalMinor);
  aligned(
    input.callerPeriodInterestBasisPoints,
    input.observedEndPeriodInterestPaymentsMinor,
    "periods",
  );
  input.callerPeriodInterestBasisPoints.forEach((v) =>
    bounded(v, "interest", 0, 10000),
  );
  input.observedEndPeriodInterestPaymentsMinor.forEach((v) => money(v));
  let balance = input.observedOpeningLoanPrincipalMinor;
  const interest = input.callerPeriodInterestBasisPoints.map((v, i) => {
    const charge = share(balance, v);
    if (input.observedEndPeriodInterestPaymentsMinor[i] > charge)
      simpleError(
        "interestPayment",
        "End-period interest payment may not exceed current interest in this interest-only ledger.",
      );
    balance = integer(
      balance + charge - input.observedEndPeriodInterestPaymentsMinor[i],
      "loan",
    );
    return charge;
  });
  return {
    roundedPeriodInterestAccrualMinor: interest,
    closingCapitalizedLoanMinor: balance,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedOpeningLoanPrincipalMinor: 10000,
  callerPeriodInterestBasisPoints: [1000, 1000],
  observedEndPeriodInterestPaymentsMinor: [500, 0],
} satisfies Input;
export const exampleOutput = {
  roundedPeriodInterestAccrualMinor: [1000, 1050],
  closingCapitalizedLoanMinor: 11550,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/policy-loan-interest-unpaid-accrual",
  title: "Policy Loan Interest Unpaid Accrual Calculator",
  description:
    "Route actual loan interest-only payments against caller period rates with unpaid interest capitalized each period, exact rounding; no inferred APR/day-count, principal repayment or tax rules.",
  inputs: inputFields,
  outputs: [
    {
      id: "roundedPeriodInterestAccrualMinor",
      label: "Rounded period interest accrual minor",
      kind: "numberList",
    },
    {
      id: "closingCapitalizedLoanMinor",
      label: "Closing capitalized loan minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedOpeningLoanPrincipalMinor:
        value.observedOpeningLoanPrincipalMinor as number,
      callerPeriodInterestBasisPoints:
        value.callerPeriodInterestBasisPoints as readonly number[],
      observedEndPeriodInterestPaymentsMinor:
        value.observedEndPeriodInterestPaymentsMinor as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;

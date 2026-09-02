import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, amortize } from "../batch36-shared.js";
export type Input = Readonly<{
  readonly openingPrincipalMinor: number;
  readonly callerAnnualAprBps: number;
  readonly callerScheduledPaymentMinor: number;
  readonly callerExtraPrincipalPerMonthMinor: number;
}>;
export type Output = Readonly<{
  readonly baselinePayoffMonths: number;
  readonly extraPayoffMonths: number;
  readonly baselineInterestMinor: number;
  readonly extraInterestMinor: number;
  readonly signedInterestSavedMinor: number;
  readonly baselineRemainingMinor: number;
  readonly extraRemainingMinor: number;
}>;
const inputFields = [
  {
    id: "openingPrincipalMinor",
    label: "Opening principal minor",
    kind: "number",
  },
  { id: "callerAnnualAprBps", label: "Caller annual apr bps", kind: "number" },
  {
    id: "callerScheduledPaymentMinor",
    label: "Caller scheduled payment minor",
    kind: "number",
  },
  {
    id: "callerExtraPrincipalPerMonthMinor",
    label: "Caller extra principal per month minor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const baseline = amortize(
      input.openingPrincipalMinor,
      input.callerAnnualAprBps,
      input.callerScheduledPaymentMinor,
      0,
    ),
    extra = amortize(
      input.openingPrincipalMinor,
      input.callerAnnualAprBps,
      input.callerScheduledPaymentMinor,
      input.callerExtraPrincipalPerMonthMinor,
    );
  return {
    baselinePayoffMonths: baseline.remaining ? -1 : baseline.months,
    extraPayoffMonths: extra.remaining ? -1 : extra.months,
    baselineInterestMinor: baseline.interest,
    extraInterestMinor: extra.interest,
    signedInterestSavedMinor: baseline.interest - extra.interest,
    baselineRemainingMinor: baseline.remaining,
    extraRemainingMinor: extra.remaining,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  openingPrincipalMinor: 1000,
  callerAnnualAprBps: 0,
  callerScheduledPaymentMinor: 100,
  callerExtraPrincipalPerMonthMinor: 100,
} satisfies Input;
export const exampleOutput = {
  baselinePayoffMonths: 10,
  extraPayoffMonths: 5,
  baselineInterestMinor: 0,
  extraInterestMinor: 0,
  signedInterestSavedMinor: 0,
  baselineRemainingMinor: 0,
  extraRemainingMinor: 0,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/extra-principal-interest-saved",
  title: "Extra Principal Interest Saved Calculator",
  description:
    "Compare exact rounded monthly amortization ledgers with/without independently permitted extra principal, separate600-month censoring; no prepayment eligibility assumption. Caller independently verifies edition, jurisdiction, applicability and one currency; screening does not establish legal compliance, coverage or bank approval.",
  inputs: inputFields,
  outputs: [
    {
      id: "baselinePayoffMonths",
      label: "Baseline payoff months",
      kind: "number",
    },
    { id: "extraPayoffMonths", label: "Extra payoff months", kind: "number" },
    {
      id: "baselineInterestMinor",
      label: "Baseline interest minor",
      kind: "number",
    },
    { id: "extraInterestMinor", label: "Extra interest minor", kind: "number" },
    {
      id: "signedInterestSavedMinor",
      label: "Signed interest saved minor",
      kind: "number",
    },
    {
      id: "baselineRemainingMinor",
      label: "Baseline remaining minor",
      kind: "number",
    },
    {
      id: "extraRemainingMinor",
      label: "Extra remaining minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      openingPrincipalMinor: value.openingPrincipalMinor as number,
      callerAnnualAprBps: value.callerAnnualAprBps as number,
      callerScheduledPaymentMinor: value.callerScheduledPaymentMinor as number,
      callerExtraPrincipalPerMonthMinor:
        value.callerExtraPrincipalPerMonthMinor as number,
    }),
});
export const run = tool.execute;
export default tool;

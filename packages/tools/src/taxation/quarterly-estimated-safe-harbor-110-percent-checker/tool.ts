import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  money,
  signedSum,
  rateMinor,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly priorYearEligibleTaxMinor: number;
  readonly callerApplicablePriorYearBasisPoints: number;
  readonly currentYearEligibleTaxMinor: number;
  readonly callerApplicableCurrentYearBasisPoints: number;
  readonly qualifyingPrepaymentsMinor: number;
}>;
export type Output = Readonly<{
  readonly conditionalAnnualSafeHarborTargetMinor: number;
  readonly signedRemainingTargetMinor: number;
}>;
const inputFields = [
  {
    id: "priorYearEligibleTaxMinor",
    label: "Prior year eligible tax minor",
    kind: "number",
  },
  {
    id: "callerApplicablePriorYearBasisPoints",
    label: "Caller applicable prior year basis points",
    kind: "number",
  },
  {
    id: "currentYearEligibleTaxMinor",
    label: "Current year eligible tax minor",
    kind: "number",
  },
  {
    id: "callerApplicableCurrentYearBasisPoints",
    label: "Caller applicable current year basis points",
    kind: "number",
  },
  {
    id: "qualifyingPrepaymentsMinor",
    label: "Qualifying prepayments minor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  money(input.priorYearEligibleTaxMinor, "priorYearEligibleTaxMinor");
  money(input.currentYearEligibleTaxMinor, "currentYearEligibleTaxMinor");
  money(input.qualifyingPrepaymentsMinor, "qualifyingPrepaymentsMinor");
  const t = Math.min(
    rateMinor(
      input.priorYearEligibleTaxMinor,
      input.callerApplicablePriorYearBasisPoints,
    ),
    rateMinor(
      input.currentYearEligibleTaxMinor,
      input.callerApplicableCurrentYearBasisPoints,
    ),
  );
  return {
    conditionalAnnualSafeHarborTargetMinor: t,
    signedRemainingTargetMinor: signedSum([
      t,
      -input.qualifyingPrepaymentsMinor,
    ]),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  priorYearEligibleTaxMinor: 100,
  callerApplicablePriorYearBasisPoints: 11000,
  currentYearEligibleTaxMinor: 150,
  callerApplicableCurrentYearBasisPoints: 9000,
  qualifyingPrepaymentsMinor: 105,
} satisfies Input;
export const exampleOutput = {
  conditionalAnnualSafeHarborTargetMinor: 110,
  signedRemainingTargetMinor: 5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "taxation/quarterly-estimated-safe-harbor-110-percent-checker",
  title: "Quarterly Estimated Safe Harbor 110 Percent Checker",
  description:
    "Explicit applicable110%prior-year/other current-year rates and qualifying payments, annual screen only; no timely quarterly installment or penalty waiver inferred. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "conditionalAnnualSafeHarborTargetMinor",
      label: "Conditional annual safe harbor target minor",
      kind: "number",
    },
    {
      id: "signedRemainingTargetMinor",
      label: "Signed remaining target minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      priorYearEligibleTaxMinor: value.priorYearEligibleTaxMinor as number,
      callerApplicablePriorYearBasisPoints:
        value.callerApplicablePriorYearBasisPoints as number,
      currentYearEligibleTaxMinor: value.currentYearEligibleTaxMinor as number,
      callerApplicableCurrentYearBasisPoints:
        value.callerApplicableCurrentYearBasisPoints as number,
      qualifyingPrepaymentsMinor: value.qualifyingPrepaymentsMinor as number,
    }),
});
export const run = tool.execute;
export default tool;

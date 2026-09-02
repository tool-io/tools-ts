import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  aligned,
  binary,
  sumMoney,
  money,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedProvisionComponentsMinor: readonly number[];
  readonly observedNonperformingLoanBalancesMinor: readonly number[];
  readonly callerProvisionQualifiesFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly qualifiedProvisionMinor: number;
  readonly nonperformingLoansMinor: number;
  readonly observedProvisionCoverageRatio: number;
}>;
const inputFields = [
  {
    id: "observedProvisionComponentsMinor",
    label: "Observed provision components minor",
    kind: "numberList",
  },
  {
    id: "observedNonperformingLoanBalancesMinor",
    label: "Observed nonperforming loan balances minor",
    kind: "numberList",
  },
  {
    id: "callerProvisionQualifiesFlags",
    label: "Caller provision qualifies flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.observedProvisionComponentsMinor,
    input.callerProvisionQualifiesFlags,
    "provision",
  );
  binary(input.callerProvisionQualifiesFlags, "qualifies");
  input.observedProvisionComponentsMinor.forEach((v) => money(v));
  const qualified = sumMoney(
      input.observedProvisionComponentsMinor.filter(
        (_, i) => input.callerProvisionQualifiesFlags[i],
      ),
    ),
    npl = sumMoney(input.observedNonperformingLoanBalancesMinor);
  positive(npl, "NPL");
  return {
    qualifiedProvisionMinor: qualified,
    nonperformingLoansMinor: npl,
    observedProvisionCoverageRatio: qualified / npl,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedProvisionComponentsMinor: [100, 50],
  observedNonperformingLoanBalancesMinor: [200, 100],
  callerProvisionQualifiesFlags: [1, 0],
} satisfies Input;
export const exampleOutput = {
  qualifiedProvisionMinor: 100,
  nonperformingLoansMinor: 300,
  observedProvisionCoverageRatio: 0.3333333333333333,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/provision-coverage-ratio",
  title: "Provision Coverage Ratio Calculator",
  description:
    "Reconcile provision qualification inventory against independently classified nonperforming-loan ledger, not one scalar allowance/total-loan ratio. Caller independently verifies edition, jurisdiction, applicability and one currency; screening does not establish legal compliance, coverage or bank approval.",
  inputs: inputFields,
  outputs: [
    {
      id: "qualifiedProvisionMinor",
      label: "Qualified provision minor",
      kind: "number",
    },
    {
      id: "nonperformingLoansMinor",
      label: "Nonperforming loans minor",
      kind: "number",
    },
    {
      id: "observedProvisionCoverageRatio",
      label: "Observed provision coverage ratio",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedProvisionComponentsMinor:
        value.observedProvisionComponentsMinor as readonly number[],
      observedNonperformingLoanBalancesMinor:
        value.observedNonperformingLoanBalancesMinor as readonly number[],
      callerProvisionQualifiesFlags:
        value.callerProvisionQualifiesFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;

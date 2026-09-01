import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  sumMoney,
  catalog,
  money,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedHsaYearTypeIds: readonly string[];
  readonly callerVerifiedAnnualLimitMinor: readonly number[];
  readonly queryHsaYearTypeId: string;
  readonly callerIndependentlyEligibleCatchUpMinor: number;
  readonly observedEmployeeAndEmployerContributionsMinor: readonly number[];
}>;
export type Output = Readonly<{
  readonly callerApplicableHsaContributionLimitMinor: number;
  readonly totalObservedHsaContributionsMinor: number;
  readonly signedRemainingHsaLimitMinor: number;
}>;
const inputFields = [
  {
    id: "callerVerifiedHsaYearTypeIds",
    label: "Caller verified hsa year type ids",
    kind: "stringList",
  },
  {
    id: "callerVerifiedAnnualLimitMinor",
    label: "Caller verified annual limit minor",
    kind: "numberList",
  },
  { id: "queryHsaYearTypeId", label: "Query hsa year type id", kind: "string" },
  {
    id: "callerIndependentlyEligibleCatchUpMinor",
    label: "Caller independently eligible catch up minor",
    kind: "number",
  },
  {
    id: "observedEmployeeAndEmployerContributionsMinor",
    label: "Observed employee and employer contributions minor",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  [
    ...input.callerVerifiedAnnualLimitMinor,
    input.callerIndependentlyEligibleCatchUpMinor,
    ...input.observedEmployeeAndEmployerContributionsMinor,
  ].forEach((v) => money(v));
  const limit = sumMoney([
      catalog(
        input.callerVerifiedHsaYearTypeIds,
        input.callerVerifiedAnnualLimitMinor,
        input.queryHsaYearTypeId,
      ),
      input.callerIndependentlyEligibleCatchUpMinor,
    ]),
    used = sumMoney(input.observedEmployeeAndEmployerContributionsMinor);
  return {
    callerApplicableHsaContributionLimitMinor: limit,
    totalObservedHsaContributionsMinor: used,
    signedRemainingHsaLimitMinor: limit - used,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedHsaYearTypeIds: ["2026:self", "2026:family"],
  callerVerifiedAnnualLimitMinor: [400000, 800000],
  queryHsaYearTypeId: "2026:self",
  callerIndependentlyEligibleCatchUpMinor: 100000,
  observedEmployeeAndEmployerContributionsMinor: [100000, 200000],
} satisfies Input;
export const exampleOutput = {
  callerApplicableHsaContributionLimitMinor: 500000,
  totalObservedHsaContributionsMinor: 300000,
  signedRemainingHsaLimitMinor: 200000,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/hsa-contribution-limit-year-type-lookup",
  title: "HSA Contribution Limit Year Type Lookup",
  description:
    "Read caller verified HSA year/type limit and independently established catch-up plus actual employee/employer contribution ledger; no tax-law constants, eligibility/pro-rata inference or tax advice.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerApplicableHsaContributionLimitMinor",
      label: "Caller applicable hsa contribution limit minor",
      kind: "number",
    },
    {
      id: "totalObservedHsaContributionsMinor",
      label: "Total observed hsa contributions minor",
      kind: "number",
    },
    {
      id: "signedRemainingHsaLimitMinor",
      label: "Signed remaining hsa limit minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerVerifiedHsaYearTypeIds:
        value.callerVerifiedHsaYearTypeIds as readonly string[],
      callerVerifiedAnnualLimitMinor:
        value.callerVerifiedAnnualLimitMinor as readonly number[],
      queryHsaYearTypeId: value.queryHsaYearTypeId as string,
      callerIndependentlyEligibleCatchUpMinor:
        value.callerIndependentlyEligibleCatchUpMinor as number,
      observedEmployeeAndEmployerContributionsMinor:
        value.observedEmployeeAndEmployerContributionsMinor as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, sumMoney, money } from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedWholeLifeCashValueMinor: number;
  readonly observedOutstandingPolicyLoanMinor: number;
  readonly observedAccruedLoanInterestMinor: number;
  readonly callerVerifiedSurrenderFeesMinor: readonly number[];
}>;
export type Output = Readonly<{
  readonly totalPolicySurrenderDeductionsMinor: number;
  readonly signedWholeLifeNetSurrenderMinor: number;
}>;
const inputFields = [
  {
    id: "observedWholeLifeCashValueMinor",
    label: "Observed whole life cash value minor",
    kind: "number",
  },
  {
    id: "observedOutstandingPolicyLoanMinor",
    label: "Observed outstanding policy loan minor",
    kind: "number",
  },
  {
    id: "observedAccruedLoanInterestMinor",
    label: "Observed accrued loan interest minor",
    kind: "number",
  },
  {
    id: "callerVerifiedSurrenderFeesMinor",
    label: "Caller verified surrender fees minor",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  [
    input.observedWholeLifeCashValueMinor,
    input.observedOutstandingPolicyLoanMinor,
    input.observedAccruedLoanInterestMinor,
    ...input.callerVerifiedSurrenderFeesMinor,
  ].forEach((v) => money(v));
  const deductions = sumMoney([
    input.observedOutstandingPolicyLoanMinor,
    input.observedAccruedLoanInterestMinor,
    ...input.callerVerifiedSurrenderFeesMinor,
  ]);
  return {
    totalPolicySurrenderDeductionsMinor: deductions,
    signedWholeLifeNetSurrenderMinor:
      input.observedWholeLifeCashValueMinor - deductions,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedWholeLifeCashValueMinor: 10000,
  observedOutstandingPolicyLoanMinor: 3000,
  observedAccruedLoanInterestMinor: 500,
  callerVerifiedSurrenderFeesMinor: [1000, 200],
} satisfies Input;
export const exampleOutput = {
  totalPolicySurrenderDeductionsMinor: 4700,
  signedWholeLifeNetSurrenderMinor: 5300,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/whole-life-cash-value-surrender-after-fees",
  title: "Whole Life Cash Value Surrender After Fees Calculator",
  description:
    "Reconcile actual whole-life cash value, loan/interest and explicit fees; signed shortfall retained, distinct from annuity free-withdrawal surrender-charge percentage, no tax/net entitlement.",
  inputs: inputFields,
  outputs: [
    {
      id: "totalPolicySurrenderDeductionsMinor",
      label: "Total policy surrender deductions minor",
      kind: "number",
    },
    {
      id: "signedWholeLifeNetSurrenderMinor",
      label: "Signed whole life net surrender minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedWholeLifeCashValueMinor:
        value.observedWholeLifeCashValueMinor as number,
      observedOutstandingPolicyLoanMinor:
        value.observedOutstandingPolicyLoanMinor as number,
      observedAccruedLoanInterestMinor:
        value.observedAccruedLoanInterestMinor as number,
      callerVerifiedSurrenderFeesMinor:
        value.callerVerifiedSurrenderFeesMinor as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, money } from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedFsaUnspentBalanceMinor: number;
  readonly callerIndependentlyEligibleRemainingClaimsMinor: number;
  readonly callerVerifiedCarryoverMaximumMinor: number;
  readonly callerCarryoverAvailable: boolean;
}>;
export type Output = Readonly<{
  readonly callerModeledEndYearUnusedMinor: number;
  readonly callerModeledCarryoverMinor: number;
  readonly callerModeledForfeitMinor: number;
}>;
const inputFields = [
  {
    id: "observedFsaUnspentBalanceMinor",
    label: "Observed fsa unspent balance minor",
    kind: "number",
  },
  {
    id: "callerIndependentlyEligibleRemainingClaimsMinor",
    label: "Caller independently eligible remaining claims minor",
    kind: "number",
  },
  {
    id: "callerVerifiedCarryoverMaximumMinor",
    label: "Caller verified carryover maximum minor",
    kind: "number",
  },
  {
    id: "callerCarryoverAvailable",
    label: "Caller carryover available",
    kind: "boolean",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  [
    input.observedFsaUnspentBalanceMinor,
    input.callerIndependentlyEligibleRemainingClaimsMinor,
    input.callerVerifiedCarryoverMaximumMinor,
  ].forEach((v) => money(v));
  const unused = Math.max(
      0,
      input.observedFsaUnspentBalanceMinor -
        input.callerIndependentlyEligibleRemainingClaimsMinor,
    ),
    carry = input.callerCarryoverAvailable
      ? Math.min(unused, input.callerVerifiedCarryoverMaximumMinor)
      : 0;
  return {
    callerModeledEndYearUnusedMinor: unused,
    callerModeledCarryoverMinor: carry,
    callerModeledForfeitMinor: unused - carry,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedFsaUnspentBalanceMinor: 10000,
  callerIndependentlyEligibleRemainingClaimsMinor: 3000,
  callerVerifiedCarryoverMaximumMinor: 2000,
  callerCarryoverAvailable: true,
} satisfies Input;
export const exampleOutput = {
  callerModeledEndYearUnusedMinor: 7000,
  callerModeledCarryoverMinor: 2000,
  callerModeledForfeitMinor: 5000,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/fsa-forfeit-use-it-or-lose-it-estimate",
  title: "FSA Forfeit Use It Or Lose It Estimate Calculator",
  description:
    "Budget actual unspent FSA with caller independently eligible remaining claims/carryover policy; no grace-period default, dual FSA election cap duplication or tax entitlement.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerModeledEndYearUnusedMinor",
      label: "Caller modeled end year unused minor",
      kind: "number",
    },
    {
      id: "callerModeledCarryoverMinor",
      label: "Caller modeled carryover minor",
      kind: "number",
    },
    {
      id: "callerModeledForfeitMinor",
      label: "Caller modeled forfeit minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedFsaUnspentBalanceMinor:
        value.observedFsaUnspentBalanceMinor as number,
      callerIndependentlyEligibleRemainingClaimsMinor:
        value.callerIndependentlyEligibleRemainingClaimsMinor as number,
      callerVerifiedCarryoverMaximumMinor:
        value.callerVerifiedCarryoverMaximumMinor as number,
      callerCarryoverAvailable: value.callerCarryoverAvailable as boolean,
    }),
});
export const run = tool.execute;
export default tool;

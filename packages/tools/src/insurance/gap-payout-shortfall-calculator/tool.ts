import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, sumMoney, money } from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedLoanPayoffMinor: number;
  readonly observedPrimarySettlementMinor: number;
  readonly callerExcludedLoanAmountsMinor: readonly number[];
  readonly callerGapLimitMinor: number;
}>;
export type Output = Readonly<{
  readonly grossLoanSettlementShortfallMinor: number;
  readonly callerEligibleGapShortfallMinor: number;
  readonly callerCappedGapPayoutMinor: number;
  readonly remainingLoanShortfallMinor: number;
}>;
const inputFields = [
  {
    id: "observedLoanPayoffMinor",
    label: "Observed loan payoff minor",
    kind: "number",
  },
  {
    id: "observedPrimarySettlementMinor",
    label: "Observed primary settlement minor",
    kind: "number",
  },
  {
    id: "callerExcludedLoanAmountsMinor",
    label: "Caller excluded loan amounts minor",
    kind: "numberList",
  },
  {
    id: "callerGapLimitMinor",
    label: "Caller gap limit minor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  [
    input.observedLoanPayoffMinor,
    input.observedPrimarySettlementMinor,
    input.callerGapLimitMinor,
    ...input.callerExcludedLoanAmountsMinor,
  ].forEach((v) => money(v));
  const gross = Math.max(
      0,
      input.observedLoanPayoffMinor - input.observedPrimarySettlementMinor,
    ),
    eligible = Math.max(
      0,
      gross - sumMoney(input.callerExcludedLoanAmountsMinor),
    ),
    payout = Math.min(eligible, input.callerGapLimitMinor);
  return {
    grossLoanSettlementShortfallMinor: gross,
    callerEligibleGapShortfallMinor: eligible,
    callerCappedGapPayoutMinor: payout,
    remainingLoanShortfallMinor: gross - payout,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedLoanPayoffMinor: 15000,
  observedPrimarySettlementMinor: 10000,
  callerExcludedLoanAmountsMinor: [500, 1000],
  callerGapLimitMinor: 10000,
} satisfies Input;
export const exampleOutput = {
  grossLoanSettlementShortfallMinor: 5000,
  callerEligibleGapShortfallMinor: 3500,
  callerCappedGapPayoutMinor: 3500,
  remainingLoanShortfallMinor: 1500,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/gap-payout-shortfall-calculator",
  title: "Gap Payout Shortfall Calculator",
  description:
    "Reconcile actual loan payoff/primary settlement and explicit excluded loan components/gap cap; no inferred deductible financing policy, debt coverage entitlement or settlement valuation.",
  inputs: inputFields,
  outputs: [
    {
      id: "grossLoanSettlementShortfallMinor",
      label: "Gross loan settlement shortfall minor",
      kind: "number",
    },
    {
      id: "callerEligibleGapShortfallMinor",
      label: "Caller eligible gap shortfall minor",
      kind: "number",
    },
    {
      id: "callerCappedGapPayoutMinor",
      label: "Caller capped gap payout minor",
      kind: "number",
    },
    {
      id: "remainingLoanShortfallMinor",
      label: "Remaining loan shortfall minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedLoanPayoffMinor: value.observedLoanPayoffMinor as number,
      observedPrimarySettlementMinor:
        value.observedPrimarySettlementMinor as number,
      callerExcludedLoanAmountsMinor:
        value.callerExcludedLoanAmountsMinor as readonly number[],
      callerGapLimitMinor: value.callerGapLimitMinor as number,
    }),
});
export const run = tool.execute;
export default tool;

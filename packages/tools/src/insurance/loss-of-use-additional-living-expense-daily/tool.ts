import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  binary,
  sumMoney,
  money,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedDisplacedDailySpendMinor: readonly number[];
  readonly callerNormalDailySpendMinor: readonly number[];
  readonly callerIndependentlyEligibleDayFlags: readonly number[];
  readonly callerRemainingAleLimitMinor: number;
}>;
export type Output = Readonly<{
  readonly eligibleAdditionalLivingCostMinorByDay: readonly number[];
  readonly callerModeledAlePaymentMinor: number;
}>;
const inputFields = [
  {
    id: "observedDisplacedDailySpendMinor",
    label: "Observed displaced daily spend minor",
    kind: "numberList",
  },
  {
    id: "callerNormalDailySpendMinor",
    label: "Caller normal daily spend minor",
    kind: "numberList",
  },
  {
    id: "callerIndependentlyEligibleDayFlags",
    label: "Caller independently eligible day flags",
    kind: "numberList",
  },
  {
    id: "callerRemainingAleLimitMinor",
    label: "Caller remaining ale limit minor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.observedDisplacedDailySpendMinor,
    input.callerNormalDailySpendMinor,
    "days",
  );
  aligned(
    input.observedDisplacedDailySpendMinor,
    input.callerIndependentlyEligibleDayFlags,
    "days",
  );
  binary(input.callerIndependentlyEligibleDayFlags, "eligible");
  [
    ...input.observedDisplacedDailySpendMinor,
    ...input.callerNormalDailySpendMinor,
    input.callerRemainingAleLimitMinor,
  ].forEach((v) => money(v));
  const costs = input.observedDisplacedDailySpendMinor.map((v, i) =>
    input.callerIndependentlyEligibleDayFlags[i]
      ? Math.max(0, v - input.callerNormalDailySpendMinor[i])
      : 0,
  );
  return {
    eligibleAdditionalLivingCostMinorByDay: costs,
    callerModeledAlePaymentMinor: Math.min(
      input.callerRemainingAleLimitMinor,
      sumMoney(costs),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedDisplacedDailySpendMinor: [2000, 3000],
  callerNormalDailySpendMinor: [1000, 1000],
  callerIndependentlyEligibleDayFlags: [1, 0],
  callerRemainingAleLimitMinor: 5000,
} satisfies Input;
export const exampleOutput = {
  eligibleAdditionalLivingCostMinorByDay: [1000, 0],
  callerModeledAlePaymentMinor: 1000,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/loss-of-use-additional-living-expense-daily",
  title: "Loss Of Use Additional Living Expense Daily Calculator",
  description:
    "Reconcile actual displacement spending less ordinary spending only for caller independently eligible days, capped by remaining ALE; not total hotel spending or universal coverage duration.",
  inputs: inputFields,
  outputs: [
    {
      id: "eligibleAdditionalLivingCostMinorByDay",
      label: "Eligible additional living cost minor by day",
      kind: "numberList",
    },
    {
      id: "callerModeledAlePaymentMinor",
      label: "Caller modeled ale payment minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedDisplacedDailySpendMinor:
        value.observedDisplacedDailySpendMinor as readonly number[],
      callerNormalDailySpendMinor:
        value.callerNormalDailySpendMinor as readonly number[],
      callerIndependentlyEligibleDayFlags:
        value.callerIndependentlyEligibleDayFlags as readonly number[],
      callerRemainingAleLimitMinor:
        value.callerRemainingAleLimitMinor as number,
    }),
});
export const run = tool.execute;
export default tool;

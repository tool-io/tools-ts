import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  ordered,
  money,
  payment,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly remainingArmPrincipalMinor: number;
  readonly remainingArmMonths: number;
  readonly observedPriorPaymentMinor: number;
  readonly callerIndexBps: number;
  readonly callerMarginBps: number;
  readonly callerPreviousRateBps: number;
  readonly callerPeriodicIncreaseCapBps: number;
  readonly callerLifetimeRateFloorBps: number;
  readonly callerLifetimeRateCapBps: number;
}>;
export type Output = Readonly<{
  readonly callerUncappedResetRateBps: number;
  readonly callerCappedResetRateBps: number;
  readonly callerModeledResetPaymentMinor: number;
  readonly signedResetPaymentChangeMinor: number;
}>;
const inputFields = [
  {
    id: "remainingArmPrincipalMinor",
    label: "Remaining arm principal minor",
    kind: "number",
  },
  { id: "remainingArmMonths", label: "Remaining arm months", kind: "number" },
  {
    id: "observedPriorPaymentMinor",
    label: "Observed prior payment minor",
    kind: "number",
  },
  { id: "callerIndexBps", label: "Caller index bps", kind: "number" },
  { id: "callerMarginBps", label: "Caller margin bps", kind: "number" },
  {
    id: "callerPreviousRateBps",
    label: "Caller previous rate bps",
    kind: "number",
  },
  {
    id: "callerPeriodicIncreaseCapBps",
    label: "Caller periodic increase cap bps",
    kind: "number",
  },
  {
    id: "callerLifetimeRateFloorBps",
    label: "Caller lifetime rate floor bps",
    kind: "number",
  },
  {
    id: "callerLifetimeRateCapBps",
    label: "Caller lifetime rate cap bps",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  money(input.remainingArmPrincipalMinor);
  money(input.observedPriorPaymentMinor);
  for (const v of [
    input.callerIndexBps,
    input.callerMarginBps,
    input.callerPreviousRateBps,
    input.callerLifetimeRateFloorBps,
    input.callerLifetimeRateCapBps,
  ])
    bounded(v, "rate", 0, 100000);
  bounded(input.callerPeriodicIncreaseCapBps, "increase", 0, 100000);
  ordered(input.callerLifetimeRateFloorBps, input.callerLifetimeRateCapBps);
  const uncapped = input.callerIndexBps + input.callerMarginBps,
    capped = Math.max(
      input.callerLifetimeRateFloorBps,
      Math.min(
        uncapped,
        input.callerPreviousRateBps + input.callerPeriodicIncreaseCapBps,
        input.callerLifetimeRateCapBps,
      ),
    ),
    p = payment(
      input.remainingArmPrincipalMinor,
      capped,
      input.remainingArmMonths,
    );
  return {
    callerUncappedResetRateBps: uncapped,
    callerCappedResetRateBps: capped,
    callerModeledResetPaymentMinor: p,
    signedResetPaymentChangeMinor: p - input.observedPriorPaymentMinor,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  remainingArmPrincipalMinor: 1200,
  remainingArmMonths: 12,
  observedPriorPaymentMinor: 100,
  callerIndexBps: 300,
  callerMarginBps: 200,
  callerPreviousRateBps: 400,
  callerPeriodicIncreaseCapBps: 50,
  callerLifetimeRateFloorBps: 0,
  callerLifetimeRateCapBps: 1000,
} satisfies Input;
export const exampleOutput = {
  callerUncappedResetRateBps: 500,
  callerCappedResetRateBps: 450,
  callerModeledResetPaymentMinor: 103,
  signedResetPaymentChangeMinor: 3,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/arm-reset-payment-change-calculator",
  title: "ARM Reset Payment Change Calculator",
  description:
    "Route caller ARM index/margin, upward periodic cap and lifetime floor/cap into fully amortizing ceiling-minor reset payment; no down-reset cap assumed or contract interpretation. Caller independently verifies edition, jurisdiction, applicability and one currency; screening does not establish legal compliance, coverage or bank approval.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerUncappedResetRateBps",
      label: "Caller uncapped reset rate bps",
      kind: "number",
    },
    {
      id: "callerCappedResetRateBps",
      label: "Caller capped reset rate bps",
      kind: "number",
    },
    {
      id: "callerModeledResetPaymentMinor",
      label: "Caller modeled reset payment minor",
      kind: "number",
    },
    {
      id: "signedResetPaymentChangeMinor",
      label: "Signed reset payment change minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      remainingArmPrincipalMinor: value.remainingArmPrincipalMinor as number,
      remainingArmMonths: value.remainingArmMonths as number,
      observedPriorPaymentMinor: value.observedPriorPaymentMinor as number,
      callerIndexBps: value.callerIndexBps as number,
      callerMarginBps: value.callerMarginBps as number,
      callerPreviousRateBps: value.callerPreviousRateBps as number,
      callerPeriodicIncreaseCapBps:
        value.callerPeriodicIncreaseCapBps as number,
      callerLifetimeRateFloorBps: value.callerLifetimeRateFloorBps as number,
      callerLifetimeRateCapBps: value.callerLifetimeRateCapBps as number,
    }),
});
export const run = tool.execute;
export default tool;

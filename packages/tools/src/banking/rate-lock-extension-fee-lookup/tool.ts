import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  sumMoney,
  roundMinor,
  money,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly callerLoanPrincipalMinor: number;
  readonly callerLockExtensionDays: number;
  readonly callerPerDayExtensionBps: number;
  readonly callerFlatExtensionMinor: number;
  readonly callerFeeCapMinor: number;
  readonly observedQuotedExtensionMinor: number;
}>;
export type Output = Readonly<{
  readonly callerUncappedExtensionFeeMinor: number;
  readonly callerCappedExtensionFeeMinor: number;
  readonly signedQuoteMinusCallerFeeMinor: number;
}>;
const inputFields = [
  {
    id: "callerLoanPrincipalMinor",
    label: "Caller loan principal minor",
    kind: "number",
  },
  {
    id: "callerLockExtensionDays",
    label: "Caller lock extension days",
    kind: "number",
  },
  {
    id: "callerPerDayExtensionBps",
    label: "Caller per day extension bps",
    kind: "number",
  },
  {
    id: "callerFlatExtensionMinor",
    label: "Caller flat extension minor",
    kind: "number",
  },
  { id: "callerFeeCapMinor", label: "Caller fee cap minor", kind: "number" },
  {
    id: "observedQuotedExtensionMinor",
    label: "Observed quoted extension minor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  [
    input.callerLoanPrincipalMinor,
    input.callerFlatExtensionMinor,
    input.callerFeeCapMinor,
    input.observedQuotedExtensionMinor,
  ].forEach((v) => money(v));
  bounded(input.callerLockExtensionDays, "days", 0, 3660);
  bounded(input.callerPerDayExtensionBps, "bps", 0, 10000);
  const fee = sumMoney([
      input.callerFlatExtensionMinor,
      roundMinor(
        BigInt(input.callerLoanPrincipalMinor) *
          BigInt(input.callerLockExtensionDays) *
          BigInt(input.callerPerDayExtensionBps),
        10000n,
      ),
    ]),
    cap = Math.min(fee, input.callerFeeCapMinor);
  return {
    callerUncappedExtensionFeeMinor: fee,
    callerCappedExtensionFeeMinor: cap,
    signedQuoteMinusCallerFeeMinor: input.observedQuotedExtensionMinor - cap,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerLoanPrincipalMinor: 10000,
  callerLockExtensionDays: 3,
  callerPerDayExtensionBps: 5,
  callerFlatExtensionMinor: 100,
  callerFeeCapMinor: 110,
  observedQuotedExtensionMinor: 120,
} satisfies Input;
export const exampleOutput = {
  callerUncappedExtensionFeeMinor: 115,
  callerCappedExtensionFeeMinor: 110,
  signedQuoteMinusCallerFeeMinor: 10,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/rate-lock-extension-fee-lookup",
  title: "Rate Lock Extension Fee Lookup",
  description:
    "Audit actual rate-lock extension quote under explicit principal×per-day basis points plus flat fee/cap, single exact rounding of aggregate extension, no bank fee schedule assumed. Caller independently verifies edition, jurisdiction, applicability and one currency; screening does not establish legal compliance, coverage or bank approval.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerUncappedExtensionFeeMinor",
      label: "Caller uncapped extension fee minor",
      kind: "number",
    },
    {
      id: "callerCappedExtensionFeeMinor",
      label: "Caller capped extension fee minor",
      kind: "number",
    },
    {
      id: "signedQuoteMinusCallerFeeMinor",
      label: "Signed quote minus caller fee minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerLoanPrincipalMinor: value.callerLoanPrincipalMinor as number,
      callerLockExtensionDays: value.callerLockExtensionDays as number,
      callerPerDayExtensionBps: value.callerPerDayExtensionBps as number,
      callerFlatExtensionMinor: value.callerFlatExtensionMinor as number,
      callerFeeCapMinor: value.callerFeeCapMinor as number,
      observedQuotedExtensionMinor:
        value.observedQuotedExtensionMinor as number,
    }),
});
export const run = tool.execute;
export default tool;

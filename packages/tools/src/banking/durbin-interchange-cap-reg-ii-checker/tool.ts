import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  sumMoney,
  weightedMinor,
  money,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly transactionMinor: number;
  readonly callerVerifiedCoveredIssuer: boolean;
  readonly callerFixedCapMinor: number;
  readonly callerAdValoremCapBps: number;
  readonly callerEligibleFraudAdjustmentMinor: number;
  readonly observedInterchangeMinor: number;
}>;
export type Output = Readonly<{
  readonly callerModeledCoveredCapMinor: number;
  readonly signedObservedMinusCapMinor: number;
  readonly callerCoveredCapExceeded: boolean;
}>;
const inputFields = [
  { id: "transactionMinor", label: "Transaction minor", kind: "number" },
  {
    id: "callerVerifiedCoveredIssuer",
    label: "Caller verified covered issuer",
    kind: "boolean",
  },
  {
    id: "callerFixedCapMinor",
    label: "Caller fixed cap minor",
    kind: "number",
  },
  {
    id: "callerAdValoremCapBps",
    label: "Caller ad valorem cap bps",
    kind: "number",
  },
  {
    id: "callerEligibleFraudAdjustmentMinor",
    label: "Caller eligible fraud adjustment minor",
    kind: "number",
  },
  {
    id: "observedInterchangeMinor",
    label: "Observed interchange minor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  [
    input.transactionMinor,
    input.callerFixedCapMinor,
    input.callerEligibleFraudAdjustmentMinor,
    input.observedInterchangeMinor,
  ].forEach((v) => money(v));
  bounded(input.callerAdValoremCapBps, "bps", 0, 10000);
  if (!input.callerVerifiedCoveredIssuer)
    simpleError(
      "applicability",
      "Independent covered-issuer applicability required for this RegII cap scenario.",
    );
  const cap = sumMoney([
    input.callerFixedCapMinor,
    weightedMinor(input.transactionMinor, input.callerAdValoremCapBps, 10000),
    input.callerEligibleFraudAdjustmentMinor,
  ]);
  return {
    callerModeledCoveredCapMinor: cap,
    signedObservedMinusCapMinor: input.observedInterchangeMinor - cap,
    callerCoveredCapExceeded: input.observedInterchangeMinor > cap,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  transactionMinor: 10000,
  callerVerifiedCoveredIssuer: true,
  callerFixedCapMinor: 21,
  callerAdValoremCapBps: 5,
  callerEligibleFraudAdjustmentMinor: 1,
  observedInterchangeMinor: 30,
} satisfies Input;
export const exampleOutput = {
  callerModeledCoveredCapMinor: 27,
  signedObservedMinusCapMinor: 3,
  callerCoveredCapExceeded: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/durbin-interchange-cap-reg-ii-checker",
  title: "Durbin Interchange Cap Reg II Checker",
  description:
    "Audit explicit caller RegII covered issuer fixed/advalorem/eligible fraud-adjustment cap under exact minor rounding, no legal threshold default. Caller independently verifies edition, jurisdiction, applicability and one currency; screening does not establish legal compliance, coverage or bank approval.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerModeledCoveredCapMinor",
      label: "Caller modeled covered cap minor",
      kind: "number",
    },
    {
      id: "signedObservedMinusCapMinor",
      label: "Signed observed minus cap minor",
      kind: "number",
    },
    {
      id: "callerCoveredCapExceeded",
      label: "Caller covered cap exceeded",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      transactionMinor: value.transactionMinor as number,
      callerVerifiedCoveredIssuer: value.callerVerifiedCoveredIssuer as boolean,
      callerFixedCapMinor: value.callerFixedCapMinor as number,
      callerAdValoremCapBps: value.callerAdValoremCapBps as number,
      callerEligibleFraudAdjustmentMinor:
        value.callerEligibleFraudAdjustmentMinor as number,
      observedInterchangeMinor: value.observedInterchangeMinor as number,
    }),
});
export const run = tool.execute;
export default tool;

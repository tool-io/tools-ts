import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  integer,
  sumMoney,
  bounded,
  aligned,
  signedSum,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly signedSuspenseLineAmountsMinor: readonly number[];
  readonly observedUnclearedAgesDays: readonly number[];
  readonly callerAgingThresholdDays: number;
}>;
export type Output = Readonly<{
  readonly netSuspenseBalanceMinor: number;
  readonly grossUnclearedExposureMinor: number;
  readonly agedUnclearedLineIndices: readonly number[];
  readonly grossAgedExposureMinor: number;
}>;
const inputFields = [
  {
    id: "signedSuspenseLineAmountsMinor",
    label: "Signed suspense line amounts minor",
    kind: "numberList",
  },
  {
    id: "observedUnclearedAgesDays",
    label: "Observed uncleared ages days",
    kind: "numberList",
  },
  {
    id: "callerAgingThresholdDays",
    label: "Caller aging threshold days",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.signedSuspenseLineAmountsMinor.forEach((v) =>
    integer(v, "signedSuspenseLineAmountsMinor"),
  );
  aligned(
    input.signedSuspenseLineAmountsMinor,
    input.observedUnclearedAgesDays,
    "signedSuspenseLineAmountsMinor",
  );
  bounded(input.callerAgingThresholdDays, "threshold", 0, 36600);
  input.observedUnclearedAgesDays.forEach((v) => bounded(v, "age", 0, 36600));
  const indices = input.observedUnclearedAgesDays.flatMap((v, i) =>
    v >= input.callerAgingThresholdDays ? [i] : [],
  );
  return {
    netSuspenseBalanceMinor: signedSum(input.signedSuspenseLineAmountsMinor),
    grossUnclearedExposureMinor: sumMoney(
      input.signedSuspenseLineAmountsMinor.map(Math.abs),
    ),
    agedUnclearedLineIndices: indices,
    grossAgedExposureMinor: sumMoney(
      indices.map((i) => Math.abs(input.signedSuspenseLineAmountsMinor[i])),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  signedSuspenseLineAmountsMinor: [100, -100],
  observedUnclearedAgesDays: [90, 100],
  callerAgingThresholdDays: 90,
} satisfies Input;
export const exampleOutput = {
  netSuspenseBalanceMinor: 0,
  grossUnclearedExposureMinor: 200,
  agedUnclearedLineIndices: [0, 1],
  grossAgedExposureMinor: 200,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "accounting/suspense-account-clearance-aging-checker",
  title: "Suspense Account Clearance Aging Checker",
  description:
    "Audit signed uncleared suspense rows against explicit inclusive aging threshold, exposing gross aged exposure even when debit/credit balances cancel; no automatic writeoff or cleared status from net zero.",
  inputs: inputFields,
  outputs: [
    {
      id: "netSuspenseBalanceMinor",
      label: "Net suspense balance minor",
      kind: "number",
    },
    {
      id: "grossUnclearedExposureMinor",
      label: "Gross uncleared exposure minor",
      kind: "number",
    },
    {
      id: "agedUnclearedLineIndices",
      label: "Aged uncleared line indices",
      kind: "numberList",
    },
    {
      id: "grossAgedExposureMinor",
      label: "Gross aged exposure minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      signedSuspenseLineAmountsMinor:
        value.signedSuspenseLineAmountsMinor as readonly number[],
      observedUnclearedAgesDays:
        value.observedUnclearedAgesDays as readonly number[],
      callerAgingThresholdDays: value.callerAgingThresholdDays as number,
    }),
});
export const run = tool.execute;
export default tool;

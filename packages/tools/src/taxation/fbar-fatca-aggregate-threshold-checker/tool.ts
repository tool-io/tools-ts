import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  shape,
  money,
  sumMoney,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly observedSameDateForeignAccountBalancesMinor: readonly (readonly number[])[];
  readonly callerFbarThresholdMinor: number;
  readonly callerFatcaThresholdMinor: number;
}>;
export type Output = Readonly<{
  readonly observedMaximumSameDateAggregateMinor: number;
  readonly callerFbarThresholdExceeded: boolean;
  readonly callerFatcaThresholdExceeded: boolean;
}>;
const inputFields = [
  {
    id: "observedSameDateForeignAccountBalancesMinor",
    label: "Observed same date foreign account balances minor",
    kind: "matrix",
  },
  {
    id: "callerFbarThresholdMinor",
    label: "Caller fbar threshold minor",
    kind: "number",
  },
  {
    id: "callerFatcaThresholdMinor",
    label: "Caller fatca threshold minor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  money(input.callerFbarThresholdMinor, "callerFbarThresholdMinor");
  money(input.callerFatcaThresholdMinor, "callerFatcaThresholdMinor");
  shape(input.observedSameDateForeignAccountBalancesMinor, "account dates");
  const totals = input.observedSameDateForeignAccountBalancesMinor.map((r) =>
      sumMoney(r),
    ),
    max = Math.max(...totals);
  return {
    observedMaximumSameDateAggregateMinor: max,
    callerFbarThresholdExceeded: max > input.callerFbarThresholdMinor,
    callerFatcaThresholdExceeded: max > input.callerFatcaThresholdMinor,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedSameDateForeignAccountBalancesMinor: [
    [30, 50],
    [80, 10],
  ],
  callerFbarThresholdMinor: 70,
  callerFatcaThresholdMinor: 100,
} satisfies Input;
export const exampleOutput = {
  observedMaximumSameDateAggregateMinor: 90,
  callerFbarThresholdExceeded: true,
  callerFatcaThresholdExceeded: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "taxation/fbar-fatca-aggregate-threshold-checker",
  title: "FBAR FATCA Aggregate Threshold Checker",
  description:
    "Aggregate matched-date foreign account balances then max, not sum of noncontemporaneous per-account maxima; currency conversion, FATCA asset universe, status and full-year completeness external. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedMaximumSameDateAggregateMinor",
      label: "Observed maximum same date aggregate minor",
      kind: "number",
    },
    {
      id: "callerFbarThresholdExceeded",
      label: "Caller fbar threshold exceeded",
      kind: "boolean",
    },
    {
      id: "callerFatcaThresholdExceeded",
      label: "Caller fatca threshold exceeded",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      observedSameDateForeignAccountBalancesMinor:
        value.observedSameDateForeignAccountBalancesMinor as readonly (readonly number[])[],
      callerFbarThresholdMinor: value.callerFbarThresholdMinor as number,
      callerFatcaThresholdMinor: value.callerFatcaThresholdMinor as number,
    }),
});
export const run = tool.execute;
export default tool;

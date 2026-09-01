import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  sumMoney,
  money,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly callerIndividualDeductibleMinor: number;
  readonly observedDeductibleAppliedPaymentsMinor: readonly number[];
  readonly observedPendingUnadjudicatedMinor: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedAdjudicatedDeductibleProgressPercent: number;
  readonly remainingAdjudicatedDeductibleMinor: number;
  readonly pendingUncountedMinor: number;
}>;
const inputFields = [
  {
    id: "callerIndividualDeductibleMinor",
    label: "Caller individual deductible minor",
    kind: "number",
  },
  {
    id: "observedDeductibleAppliedPaymentsMinor",
    label: "Observed deductible applied payments minor",
    kind: "numberList",
  },
  {
    id: "observedPendingUnadjudicatedMinor",
    label: "Observed pending unadjudicated minor",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  money(input.callerIndividualDeductibleMinor);
  positive(input.callerIndividualDeductibleMinor, "deductible");
  [
    ...input.observedDeductibleAppliedPaymentsMinor,
    ...input.observedPendingUnadjudicatedMinor,
  ].forEach((v) => money(v));
  const applied = sumMoney(input.observedDeductibleAppliedPaymentsMinor);
  return {
    observedAdjudicatedDeductibleProgressPercent:
      (100 * Math.min(applied, input.callerIndividualDeductibleMinor)) /
      input.callerIndividualDeductibleMinor,
    remainingAdjudicatedDeductibleMinor: Math.max(
      0,
      input.callerIndividualDeductibleMinor - applied,
    ),
    pendingUncountedMinor: sumMoney(input.observedPendingUnadjudicatedMinor),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerIndividualDeductibleMinor: 10000,
  observedDeductibleAppliedPaymentsMinor: [2000, 3000],
  observedPendingUnadjudicatedMinor: [1000],
} satisfies Input;
export const exampleOutput = {
  observedAdjudicatedDeductibleProgressPercent: 50,
  remainingAdjudicatedDeductibleMinor: 5000,
  pendingUncountedMinor: 1000,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/deductible-progress-percent-today",
  title: "Deductible Progress Percent Today Calculator",
  description:
    "Audit actual individual adjudicated deductible ledger, preserving pending expenses separately rather than counting them toward family/individual cap; no claims adjudication or estimate counted as fact.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedAdjudicatedDeductibleProgressPercent",
      label: "Observed adjudicated deductible progress percent",
      kind: "number",
    },
    {
      id: "remainingAdjudicatedDeductibleMinor",
      label: "Remaining adjudicated deductible minor",
      kind: "number",
    },
    {
      id: "pendingUncountedMinor",
      label: "Pending uncounted minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerIndividualDeductibleMinor:
        value.callerIndividualDeductibleMinor as number,
      observedDeductibleAppliedPaymentsMinor:
        value.observedDeductibleAppliedPaymentsMinor as readonly number[],
      observedPendingUnadjudicatedMinor:
        value.observedPendingUnadjudicatedMinor as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;

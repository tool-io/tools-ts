import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  fraction,
  aligned,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedRecoverableGreywaterLitersDay: readonly number[];
  readonly callerCompatibleReuseDemandLitersDay: readonly number[];
  readonly callerTreatmentRecoveryFraction: number;
}>;
export type Output = Readonly<{
  readonly modeledRecoverableGreywaterLitersDay: readonly number[];
  readonly modeledUnmetReuseDemandLitersDay: readonly number[];
  readonly modeledUnusedGreywaterLitersDay: readonly number[];
}>;
const inputFields = [
  {
    id: "observedRecoverableGreywaterLitersDay",
    label: "Observed recoverable greywater liters day",
    kind: "numberList",
  },
  {
    id: "callerCompatibleReuseDemandLitersDay",
    label: "Caller compatible reuse demand liters day",
    kind: "numberList",
  },
  {
    id: "callerTreatmentRecoveryFraction",
    label: "Caller treatment recovery fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedRecoverableGreywaterLitersDay.forEach((v) =>
    nonnegative(v, "observedRecoverableGreywaterLitersDay"),
  );
  input.callerCompatibleReuseDemandLitersDay.forEach((v) =>
    nonnegative(v, "callerCompatibleReuseDemandLitersDay"),
  );
  fraction(
    input.callerTreatmentRecoveryFraction,
    "callerTreatmentRecoveryFraction",
  );
  aligned(
    input.observedRecoverableGreywaterLitersDay,
    input.callerCompatibleReuseDemandLitersDay,
    "observedRecoverableGreywaterLitersDay",
  );
  const supplied = input.observedRecoverableGreywaterLitersDay.map(
    (v) => v * input.callerTreatmentRecoveryFraction,
  );
  return {
    modeledRecoverableGreywaterLitersDay: supplied,
    modeledUnmetReuseDemandLitersDay: supplied.map((v, i) =>
      Math.max(0, input.callerCompatibleReuseDemandLitersDay[i] - v),
    ),
    modeledUnusedGreywaterLitersDay: supplied.map((v, i) =>
      Math.max(0, v - input.callerCompatibleReuseDemandLitersDay[i]),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedRecoverableGreywaterLitersDay: [100, 150],
  callerCompatibleReuseDemandLitersDay: [80, 200],
  callerTreatmentRecoveryFraction: 0.8,
} satisfies Input;
export const exampleOutput = {
  modeledRecoverableGreywaterLitersDay: [80, 120],
  modeledUnmetReuseDemandLitersDay: [0, 80],
  modeledUnusedGreywaterLitersDay: [0, 0],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/greywater-system-size",
  title: "Plumbing Greywater System Size Calculator",
  description:
    "Reconcile actual independent recoverable greywater and compatible reuse daily budgets under caller recovery, no carryover; no wastewater quality, cross-connection or safe reuse approval.",
  inputs: inputFields,
  outputs: [
    {
      id: "modeledRecoverableGreywaterLitersDay",
      label: "Modeled recoverable greywater liters day",
      kind: "numberList",
    },
    {
      id: "modeledUnmetReuseDemandLitersDay",
      label: "Modeled unmet reuse demand liters day",
      kind: "numberList",
    },
    {
      id: "modeledUnusedGreywaterLitersDay",
      label: "Modeled unused greywater liters day",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedRecoverableGreywaterLitersDay:
        value.observedRecoverableGreywaterLitersDay as readonly number[],
      callerCompatibleReuseDemandLitersDay:
        value.callerCompatibleReuseDemandLitersDay as readonly number[],
      callerTreatmentRecoveryFraction:
        value.callerTreatmentRecoveryFraction as number,
    }),
});
export const run = tool.execute;
export default tool;

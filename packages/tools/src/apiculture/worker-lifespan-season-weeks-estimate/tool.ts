import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  binary,
  mean,
} from "../batch40-shared.js";
export type Input = Readonly<{
  readonly observedWorkerAgeWeeks: readonly number[];
  readonly independentlyConfirmedDeathFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly completedObservedLifespansWeeks: readonly number[];
  readonly rightCensoredMinimumAgesWeeks: readonly number[];
  readonly meanCompletedObservedWeeks: number;
  readonly hasCompletedLifespanObservations: boolean;
}>;
const inputFields = [
  {
    id: "observedWorkerAgeWeeks",
    label: "Observed worker age weeks",
    kind: "numberList",
  },
  {
    id: "independentlyConfirmedDeathFlags",
    label: "Independently confirmed death flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedWorkerAgeWeeks.forEach((v) =>
    nonnegative(v, "observedWorkerAgeWeeks"),
  );
  binary(
    input.independentlyConfirmedDeathFlags,
    "independentlyConfirmedDeathFlags",
  );
  aligned(
    input.observedWorkerAgeWeeks,
    input.independentlyConfirmedDeathFlags,
    "observedWorkerAgeWeeks",
  );
  const dead = input.observedWorkerAgeWeeks.filter(
      (_, i) => input.independentlyConfirmedDeathFlags[i],
    ),
    alive = input.observedWorkerAgeWeeks.filter(
      (_, i) => !input.independentlyConfirmedDeathFlags[i],
    );
  return {
    completedObservedLifespansWeeks: dead,
    rightCensoredMinimumAgesWeeks: alive,
    meanCompletedObservedWeeks: dead.length ? mean(dead) : 0,
    hasCompletedLifespanObservations: dead.length > 0,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedWorkerAgeWeeks: [2, 4, 6],
  independentlyConfirmedDeathFlags: [1, 1, 0],
} satisfies Input;
export const exampleOutput = {
  completedObservedLifespansWeeks: [2, 4],
  rightCensoredMinimumAgesWeeks: [6],
  meanCompletedObservedWeeks: 3,
  hasCompletedLifespanObservations: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "apiculture/worker-lifespan-season-weeks-estimate",
  title: "Worker Lifespan Season Weeks Estimate Calculator",
  description:
    "Observed independently age-marked seasonal worker cohort with completed lifespan and right-censored minimum ages retained; completed mean is not unbiased full-cohort survival. With no completed lifespan, the explicit false evidence flag distinguishes the zero mean placeholder. Caller independently verifies strain, site, protocol and evidence; not colony-health or biological lifespan prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "hasCompletedLifespanObservations",
      label: "Has completed lifespan observations",
      kind: "boolean",
    },
    {
      id: "completedObservedLifespansWeeks",
      label: "Completed observed lifespans weeks",
      kind: "numberList",
    },
    {
      id: "rightCensoredMinimumAgesWeeks",
      label: "Right censored minimum ages weeks",
      kind: "numberList",
    },
    {
      id: "meanCompletedObservedWeeks",
      label: "Mean completed observed weeks",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedWorkerAgeWeeks: value.observedWorkerAgeWeeks as readonly number[],
      independentlyConfirmedDeathFlags:
        value.independentlyConfirmedDeathFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;

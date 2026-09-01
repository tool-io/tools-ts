import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  strictlyIncreasing,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly callerObservedSaltMassKgKnots: readonly number[];
  readonly callerIndependentlyMeasuredRecoveredCapacityGramsKnots: readonly number[];
  readonly callerRequiredRecoveredCapacityGrams: number;
}>;
export type Output = Readonly<{
  readonly minimumObservedSaltSettingKg: number;
  readonly observedCapacityAtSelectedSettingGrams: number;
  readonly callerCapacityReachableInObservedSettings: boolean;
}>;
const inputFields = [
  {
    id: "callerObservedSaltMassKgKnots",
    label: "Caller observed salt mass kg knots",
    kind: "numberList",
  },
  {
    id: "callerIndependentlyMeasuredRecoveredCapacityGramsKnots",
    label: "Caller independently measured recovered capacity grams knots",
    kind: "numberList",
  },
  {
    id: "callerRequiredRecoveredCapacityGrams",
    label: "Caller required recovered capacity grams",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerObservedSaltMassKgKnots.forEach((v) =>
    positive(v, "callerObservedSaltMassKgKnots"),
  );
  input.callerIndependentlyMeasuredRecoveredCapacityGramsKnots.forEach((v) =>
    nonnegative(v, "callerIndependentlyMeasuredRecoveredCapacityGramsKnots"),
  );
  nonnegative(
    input.callerRequiredRecoveredCapacityGrams,
    "callerRequiredRecoveredCapacityGrams",
  );
  aligned(
    input.callerObservedSaltMassKgKnots,
    input.callerIndependentlyMeasuredRecoveredCapacityGramsKnots,
    "callerObservedSaltMassKgKnots",
  );
  strictlyIncreasing(input.callerObservedSaltMassKgKnots, "settings", 1);
  const i =
    input.callerIndependentlyMeasuredRecoveredCapacityGramsKnots.findIndex(
      (v) => v >= input.callerRequiredRecoveredCapacityGrams,
    );
  return {
    minimumObservedSaltSettingKg:
      i < 0 ? -1 : input.callerObservedSaltMassKgKnots[i],
    observedCapacityAtSelectedSettingGrams:
      i < 0
        ? -1
        : input.callerIndependentlyMeasuredRecoveredCapacityGramsKnots[i],
    callerCapacityReachableInObservedSettings: i >= 0,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerObservedSaltMassKgKnots: [1, 2, 3],
  callerIndependentlyMeasuredRecoveredCapacityGramsKnots: [10, 25, 30],
  callerRequiredRecoveredCapacityGrams: 20,
} satisfies Input;
export const exampleOutput = {
  minimumObservedSaltSettingKg: 2,
  observedCapacityAtSelectedSettingGrams: 25,
  callerCapacityReachableInObservedSettings: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/water-softener-salt-dose",
  title: "Plumbing Water Softener Salt Dose Calculator",
  description:
    "Read independently observed softener salt-setting/capacity trial catalog without extrapolation; caller settings not chemical application instructions, universal salt dose or recovery guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "minimumObservedSaltSettingKg",
      label: "Minimum observed salt setting kg",
      kind: "number",
    },
    {
      id: "observedCapacityAtSelectedSettingGrams",
      label: "Observed capacity at selected setting grams",
      kind: "number",
    },
    {
      id: "callerCapacityReachableInObservedSettings",
      label: "Caller capacity reachable in observed settings",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      callerObservedSaltMassKgKnots:
        value.callerObservedSaltMassKgKnots as readonly number[],
      callerIndependentlyMeasuredRecoveredCapacityGramsKnots:
        value.callerIndependentlyMeasuredRecoveredCapacityGramsKnots as readonly number[],
      callerRequiredRecoveredCapacityGrams:
        value.callerRequiredRecoveredCapacityGrams as number,
    }),
});
export const run = tool.execute;
export default tool;

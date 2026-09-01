import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  sum,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedTributaryPipeLengthsM: readonly number[];
  readonly measuredFilledPipeMassKgM: readonly number[];
  readonly independentlyObservedAttachedMassKg: readonly number[];
  readonly callerGravityMetersSecondSquared: number;
}>;
export type Output = Readonly<{
  readonly modeledHangerGravityLoadsN: readonly number[];
  readonly combinedModeledHangerGravityLoadN: number;
}>;
const inputFields = [
  {
    id: "observedTributaryPipeLengthsM",
    label: "Observed tributary pipe lengths m",
    kind: "numberList",
  },
  {
    id: "measuredFilledPipeMassKgM",
    label: "Measured filled pipe mass kg m",
    kind: "numberList",
  },
  {
    id: "independentlyObservedAttachedMassKg",
    label: "Independently observed attached mass kg",
    kind: "numberList",
  },
  {
    id: "callerGravityMetersSecondSquared",
    label: "Caller gravity meters second squared",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.callerGravityMetersSecondSquared,
    "callerGravityMetersSecondSquared",
  );
  input.observedTributaryPipeLengthsM.forEach((v) =>
    nonnegative(v, "observedTributaryPipeLengthsM"),
  );
  input.measuredFilledPipeMassKgM.forEach((v) =>
    nonnegative(v, "measuredFilledPipeMassKgM"),
  );
  input.independentlyObservedAttachedMassKg.forEach((v) =>
    nonnegative(v, "independentlyObservedAttachedMassKg"),
  );
  aligned(
    input.observedTributaryPipeLengthsM,
    input.measuredFilledPipeMassKgM,
    "observedTributaryPipeLengthsM",
  );
  aligned(
    input.observedTributaryPipeLengthsM,
    input.independentlyObservedAttachedMassKg,
    "observedTributaryPipeLengthsM",
  );
  const loads = input.observedTributaryPipeLengthsM.map(
    (v, i) =>
      (v * input.measuredFilledPipeMassKgM[i] +
        input.independentlyObservedAttachedMassKg[i]) *
      input.callerGravityMetersSecondSquared,
  );
  return {
    modeledHangerGravityLoadsN: loads,
    combinedModeledHangerGravityLoadN: sum(loads),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedTributaryPipeLengthsM: [2, 3],
  measuredFilledPipeMassKgM: [5, 4],
  independentlyObservedAttachedMassKg: [1, 2],
  callerGravityMetersSecondSquared: 10,
} satisfies Input;
export const exampleOutput = {
  modeledHangerGravityLoadsN: [110, 140],
  combinedModeledHangerGravityLoadN: 250,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/hanger-load",
  title: "Plumbing Hanger Load Calculator",
  description:
    "Inventory actual independent hanger tributary lengths and filled/attached mass gravity loads; not equal support allocation, anchor force, seismic certification or rod selection.",
  inputs: inputFields,
  outputs: [
    {
      id: "modeledHangerGravityLoadsN",
      label: "Modeled hanger gravity loads n",
      kind: "numberList",
    },
    {
      id: "combinedModeledHangerGravityLoadN",
      label: "Combined modeled hanger gravity load n",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedTributaryPipeLengthsM:
        value.observedTributaryPipeLengthsM as readonly number[],
      measuredFilledPipeMassKgM:
        value.measuredFilledPipeMassKgM as readonly number[],
      independentlyObservedAttachedMassKg:
        value.independentlyObservedAttachedMassKg as readonly number[],
      callerGravityMetersSecondSquared:
        value.callerGravityMetersSecondSquared as number,
    }),
});
export const run = tool.execute;
export default tool;

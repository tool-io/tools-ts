import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  linearFit,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedAddedNemsMassKg: readonly number[];
  readonly observedNemsFrequenciesHz: readonly number[];
  readonly observedFrequencyNoiseHz: number;
}>;
export type Output = Readonly<{
  readonly signedMeasuredMassSensitivityHzKg: number;
  readonly inputReferredNemsMassNoiseKg: number;
}>;
const inputFields = [
  {
    id: "observedAddedNemsMassKg",
    label: "Observed added nems mass kg",
    kind: "numberList",
  },
  {
    id: "observedNemsFrequenciesHz",
    label: "Observed nems frequencies hz",
    kind: "numberList",
  },
  {
    id: "observedFrequencyNoiseHz",
    label: "Observed frequency noise hz",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedNemsFrequenciesHz.forEach((v) =>
    positive(v, "observedNemsFrequenciesHz"),
  );
  input.observedAddedNemsMassKg.forEach((v) =>
    nonnegative(v, "observedAddedNemsMassKg"),
  );
  nonnegative(input.observedFrequencyNoiseHz, "observedFrequencyNoiseHz");
  const fit = linearFit(
    input.observedAddedNemsMassKg,
    input.observedNemsFrequenciesHz,
  );
  if (fit.slope === 0)
    simpleError(
      "sensitivity",
      "Nonzero measured frequency/mass sensitivity required.",
    );
  return {
    signedMeasuredMassSensitivityHzKg: fit.slope,
    inputReferredNemsMassNoiseKg:
      input.observedFrequencyNoiseHz / Math.abs(fit.slope),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedAddedNemsMassKg: [0, 1, 2],
  observedNemsFrequenciesHz: [10, 9, 8],
  observedFrequencyNoiseHz: 0.1,
} satisfies Input;
export const exampleOutput = {
  signedMeasuredMassSensitivityHzKg: -1,
  inputReferredNemsMassNoiseKg: 0.1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/nems-mass-sensitivity",
  title: "Semiconductor Nems Mass Sensitivity Calculator",
  description:
    "Extract actual NEMS mass-loading frequency slope and independently observed noise-equivalent mass, not forward ideal frequency or a detection guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedMeasuredMassSensitivityHzKg",
      label: "Signed measured mass sensitivity hz kg",
      kind: "number",
    },
    {
      id: "inputReferredNemsMassNoiseKg",
      label: "Input referred nems mass noise kg",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedAddedNemsMassKg:
        value.observedAddedNemsMassKg as readonly number[],
      observedNemsFrequenciesHz:
        value.observedNemsFrequenciesHz as readonly number[],
      observedFrequencyNoiseHz: value.observedFrequencyNoiseHz as number,
    }),
});
export const run = tool.execute;
export default tool;

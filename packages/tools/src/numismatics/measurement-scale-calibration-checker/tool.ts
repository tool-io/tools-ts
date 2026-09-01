import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  strictlyIncreasing,
  interpolate,
} from "../batch34-shared.js";
export type Input = Readonly<{
  readonly callerReferenceMassesGrams: readonly number[];
  readonly observedScaleReadingsAtReferencesGrams: readonly number[];
  readonly queryCoinScaleReadingsGrams: readonly number[];
}>;
export type Output = Readonly<{
  readonly calibrationCorrectedCoinMassesGrams: readonly number[];
  readonly observedReferenceReadingErrorsGrams: readonly number[];
}>;
const inputFields = [
  {
    id: "callerReferenceMassesGrams",
    label: "Caller reference masses grams",
    kind: "numberList",
  },
  {
    id: "observedScaleReadingsAtReferencesGrams",
    label: "Observed scale readings at references grams",
    kind: "numberList",
  },
  {
    id: "queryCoinScaleReadingsGrams",
    label: "Query coin scale readings grams",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerReferenceMassesGrams.forEach((v) =>
    nonnegative(v, "callerReferenceMassesGrams"),
  );
  input.observedScaleReadingsAtReferencesGrams.forEach((v) =>
    nonnegative(v, "observedScaleReadingsAtReferencesGrams"),
  );
  input.queryCoinScaleReadingsGrams.forEach((v) =>
    nonnegative(v, "queryCoinScaleReadingsGrams"),
  );
  aligned(
    input.callerReferenceMassesGrams,
    input.observedScaleReadingsAtReferencesGrams,
    "callerReferenceMassesGrams",
  );
  strictlyIncreasing(input.callerReferenceMassesGrams, "reference");
  return {
    calibrationCorrectedCoinMassesGrams: input.queryCoinScaleReadingsGrams.map(
      (v) =>
        interpolate(
          input.observedScaleReadingsAtReferencesGrams,
          input.callerReferenceMassesGrams,
          v,
        ),
    ),
    observedReferenceReadingErrorsGrams:
      input.observedScaleReadingsAtReferencesGrams.map(
        (v, i) => v - input.callerReferenceMassesGrams[i],
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerReferenceMassesGrams: [0, 10, 20],
  observedScaleReadingsAtReferencesGrams: [1, 11, 21],
  queryCoinScaleReadingsGrams: [6, 16],
} satisfies Input;
export const exampleOutput = {
  calibrationCorrectedCoinMassesGrams: [5, 15],
  observedReferenceReadingErrorsGrams: [1, 1, 1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "numismatics/measurement-scale-calibration-checker",
  title: "Measurement Scale Calibration Checker",
  description:
    "Invert actual independently verified reference-mass/scale-reading calibration within observed monotone branch and retain reference errors; not simple mass deviation or universal correction/measurement traceability certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "calibrationCorrectedCoinMassesGrams",
      label: "Calibration corrected coin masses grams",
      kind: "numberList",
    },
    {
      id: "observedReferenceReadingErrorsGrams",
      label: "Observed reference reading errors grams",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerReferenceMassesGrams:
        value.callerReferenceMassesGrams as readonly number[],
      observedScaleReadingsAtReferencesGrams:
        value.observedScaleReadingsAtReferencesGrams as readonly number[],
      queryCoinScaleReadingsGrams:
        value.queryCoinScaleReadingsGrams as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;

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
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly measuredCaneDryMassesGrams: readonly number[];
  readonly measuredCaneLengthsCm: readonly number[];
  readonly callerMinimumMassPerLengthGramsPerCm: number;
  readonly callerMaximumMassPerLengthGramsPerCm: number;
}>;
export type Output = Readonly<{
  readonly observedCaneMassPerLengthGramsPerCm: readonly number[];
  readonly withinCallerSelectionBandFlags: readonly number[];
}>;
const inputFields = [
  {
    id: "measuredCaneDryMassesGrams",
    label: "Measured cane dry masses grams",
    kind: "numberList",
  },
  {
    id: "measuredCaneLengthsCm",
    label: "Measured cane lengths cm",
    kind: "numberList",
  },
  {
    id: "callerMinimumMassPerLengthGramsPerCm",
    label: "Caller minimum mass per length grams per cm",
    kind: "number",
  },
  {
    id: "callerMaximumMassPerLengthGramsPerCm",
    label: "Caller maximum mass per length grams per cm",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.measuredCaneLengthsCm.forEach((v) =>
    positive(v, "measuredCaneLengthsCm"),
  );
  input.measuredCaneDryMassesGrams.forEach((v) =>
    nonnegative(v, "measuredCaneDryMassesGrams"),
  );
  nonnegative(
    input.callerMinimumMassPerLengthGramsPerCm,
    "callerMinimumMassPerLengthGramsPerCm",
  );
  nonnegative(
    input.callerMaximumMassPerLengthGramsPerCm,
    "callerMaximumMassPerLengthGramsPerCm",
  );
  aligned(
    input.measuredCaneDryMassesGrams,
    input.measuredCaneLengthsCm,
    "measuredCaneDryMassesGrams",
  );
  if (
    input.callerMaximumMassPerLengthGramsPerCm <
    input.callerMinimumMassPerLengthGramsPerCm
  )
    simpleError("band", "Ordered caller cane-mass-per-length band required.");
  const observedCaneMassPerLengthGramsPerCm =
    input.measuredCaneDryMassesGrams.map(
      (v, i) => v / input.measuredCaneLengthsCm[i],
    );
  return {
    observedCaneMassPerLengthGramsPerCm,
    withinCallerSelectionBandFlags: observedCaneMassPerLengthGramsPerCm.map(
      (v) =>
        v >= input.callerMinimumMassPerLengthGramsPerCm &&
        v <= input.callerMaximumMassPerLengthGramsPerCm
          ? 1
          : 0,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  measuredCaneDryMassesGrams: [10, 20],
  measuredCaneLengthsCm: [100, 100],
  callerMinimumMassPerLengthGramsPerCm: 0.15,
  callerMaximumMassPerLengthGramsPerCm: 0.25,
} satisfies Input;
export const exampleOutput = {
  observedCaneMassPerLengthGramsPerCm: [0.1, 0.2],
  withinCallerSelectionBandFlags: [0, 1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "viticulture/cane-weight-selection-threshold",
  title: "Cane Weight Selection Threshold Checker",
  description:
    "Compare measured dry cane mass per actual length against caller selection calibration; raw cane weight alone is length-confounded and this band does not establish viable/suitable fruiting wood.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedCaneMassPerLengthGramsPerCm",
      label: "Observed cane mass per length grams per cm",
      kind: "numberList",
    },
    {
      id: "withinCallerSelectionBandFlags",
      label: "Within caller selection band flags",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      measuredCaneDryMassesGrams:
        value.measuredCaneDryMassesGrams as readonly number[],
      measuredCaneLengthsCm: value.measuredCaneLengthsCm as readonly number[],
      callerMinimumMassPerLengthGramsPerCm:
        value.callerMinimumMassPerLengthGramsPerCm as number,
      callerMaximumMassPerLengthGramsPerCm:
        value.callerMaximumMassPerLengthGramsPerCm as number,
    }),
});
export const run = tool.execute;
export default tool;

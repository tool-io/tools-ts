import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  ordered,
  regression,
} from "../shared.js";
export type Input = Readonly<{
  readonly referenceSpotReadings: readonly number[];
  readonly referenceIndices: readonly number[];
  readonly sampleSpotReading: number;
  readonly spotReadingHalfUncertainty: number;
}>;
export type Output = Readonly<{
  readonly calibratedSampleRi: number;
  readonly calibratedSampleRiBounds: readonly number[];
  readonly sampleOutsideSpotCalibration: boolean;
}>;
const inputFields = [
  {
    id: "referenceSpotReadings",
    label: "Reference spot readings",
    kind: "numberList",
  },
  { id: "referenceIndices", label: "Reference indices", kind: "numberList" },
  { id: "sampleSpotReading", label: "Sample spot reading", kind: "number" },
  {
    id: "spotReadingHalfUncertainty",
    label: "Spot reading half uncertainty",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.referenceIndices.forEach((v) => positive(v, "referenceIndices"));
  nonnegative(input.spotReadingHalfUncertainty, "spotReadingHalfUncertainty");
  ordered(input.referenceSpotReadings, "referenceSpotReadings");
  const fit = regression(input.referenceSpotReadings, input.referenceIndices);
  positive(fit.slope, "calibrationSlope");
  const at = (v: number) =>
    positive(fit.intercept + fit.slope * v, "sampleIndex");
  return {
    calibratedSampleRi: at(input.sampleSpotReading),
    calibratedSampleRiBounds: [
      at(input.sampleSpotReading - input.spotReadingHalfUncertainty),
      at(input.sampleSpotReading + input.spotReadingHalfUncertainty),
    ],
    sampleOutsideSpotCalibration:
      input.sampleSpotReading - input.spotReadingHalfUncertainty <
        input.referenceSpotReadings[0] ||
      input.sampleSpotReading + input.spotReadingHalfUncertainty >
        input.referenceSpotReadings.at(-1)!,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  referenceSpotReadings: [1, 2],
  referenceIndices: [1.5, 2],
  sampleSpotReading: 1.5,
  spotReadingHalfUncertainty: 0.1,
} satisfies Input;
export const exampleOutput = {
  calibratedSampleRi: 1.75,
  calibratedSampleRiBounds: [1.7, 1.8],
  sampleOutsideSpotCalibration: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "gemology/refractor-single-reading",
  title: "Single Reading Refractometer Estimate",
  description:
    "Calibrate a single curved-surface spot reading against caller instrument references with propagated reading bounds/extrapolation flag; not a definitive RI, full principal indices or identity lookup.",
  inputs: inputFields,
  outputs: [
    { id: "calibratedSampleRi", label: "Calibrated sample ri", kind: "number" },
    {
      id: "calibratedSampleRiBounds",
      label: "Calibrated sample ri bounds",
      kind: "numberList",
    },
    {
      id: "sampleOutsideSpotCalibration",
      label: "Sample outside spot calibration",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      referenceSpotReadings: value.referenceSpotReadings as readonly number[],
      referenceIndices: value.referenceIndices as readonly number[],
      sampleSpotReading: value.sampleSpotReading as number,
      spotReadingHalfUncertainty: value.spotReadingHalfUncertainty as number,
    }),
});
export const run = tool.execute;
export default tool;

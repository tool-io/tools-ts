import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  strictlyIncreasing,
} from "../batch46-shared.js";
export type Input = Readonly<{
  readonly independentlyMeasuredCandidateWavelengthsNm: readonly number[];
  readonly independentlyMeasuredAnalogResponses: readonly number[];
  readonly callerVerifiedReferencePeakNm: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyMeasuredCandidateWavelengthsNm",
    label: "Independently measured candidate wavelengths nm",
    kind: "numberList",
  },
  {
    id: "independentlyMeasuredAnalogResponses",
    label: "Independently measured analog responses",
    kind: "numberList",
  },
  {
    id: "callerVerifiedReferencePeakNm",
    label: "Caller verified reference peak nm",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  aligned(
    input.independentlyMeasuredCandidateWavelengthsNm,
    input.independentlyMeasuredAnalogResponses,
    "spectrum",
  );
  strictlyIncreasing(
    input.independentlyMeasuredCandidateWavelengthsNm,
    "wavelength",
    2,
  );
  input.independentlyMeasuredCandidateWavelengthsNm.forEach((v) =>
    positive(v, "wavelength"),
  );
  input.independentlyMeasuredAnalogResponses.forEach((v) =>
    nonnegative(v, "response"),
  );
  positive(input.callerVerifiedReferencePeakNm, "reference");
  const max = Math.max(...input.independentlyMeasuredAnalogResponses),
    peaks = input.independentlyMeasuredCandidateWavelengthsNm.filter(
      (_, i) => input.independentlyMeasuredAnalogResponses[i] === max,
    );
  return {
    observedMaximumResponseWavelengthsNm: peaks,
    signedReferencePeakShiftsNm: peaks.map(
      (v) => v - input.callerVerifiedReferencePeakNm,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyMeasuredCandidateWavelengthsNm: [600, 700, 800],
    independentlyMeasuredAnalogResponses: [1, 2, 2],
    callerVerifiedReferencePeakNm: 680,
  },
  output: {
    result: {
      observedMaximumResponseWavelengthsNm: [700, 800],
      signedReferencePeakShiftsNm: [20, 120],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrobiology/chlorophyll-analog-peak-shift-estimator",
  title: "Chlorophyll Analog Wavelength Peak Shift Estimator Calculator",
  description:
    "Actual measured chlorophyll-analog response peak inventory and signed shift from independently verified same-protocol reference. All sampled ties retained, no interpolation, universal stellar wavelength adaptation or life inference.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;

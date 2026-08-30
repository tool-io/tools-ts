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
  fraction,
} from "../shared.js";
export type Input = Readonly<{
  readonly referenceWindSpeedMPerSecond: number;
  readonly gravityMPerSecondSquared: number;
  readonly pmAlpha: number;
  readonly pmBeta: number;
  readonly frequencyBandHz: readonly number[];
  readonly frequencyWindCoefficient: number;
}>;
export type Output = Readonly<{
  readonly fullSpectrumSignificantHeightM: number;
  readonly bandSignificantHeightM: number;
  readonly peakPeriodSeconds: number;
}>;
const inputFields = [
  {
    id: "referenceWindSpeedMPerSecond",
    label: "Reference wind speed m per second",
    kind: "number",
  },
  {
    id: "gravityMPerSecondSquared",
    label: "Gravity m per second squared",
    kind: "number",
  },
  { id: "pmAlpha", label: "Pm alpha", kind: "number" },
  { id: "pmBeta", label: "Pm beta", kind: "number" },
  { id: "frequencyBandHz", label: "Frequency band hz", kind: "numberList" },
  {
    id: "frequencyWindCoefficient",
    label: "Frequency wind coefficient",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.referenceWindSpeedMPerSecond, "referenceWindSpeedMPerSecond");
  positive(input.gravityMPerSecondSquared, "gravityMPerSecondSquared");
  positive(input.pmAlpha, "pmAlpha");
  positive(input.pmBeta, "pmBeta");
  positive(input.frequencyWindCoefficient, "frequencyWindCoefficient");
  input.frequencyBandHz.forEach((v) => nonnegative(v, "frequencyBandHz"));
  if (
    input.frequencyBandHz.length !== 2 ||
    input.frequencyBandHz[1] <= input.frequencyBandHz[0]
  )
    simpleError(
      "frequencyBandHz",
      "Increasing nonnegative two-bound frequency band required.",
    );
  const wp =
      (input.frequencyWindCoefficient * input.gravityMPerSecondSquared) /
      input.referenceWindSpeedMPerSecond,
    m0 =
      (input.pmAlpha * input.gravityMPerSecondSquared ** 2) /
      (4 * input.pmBeta * wp ** 4),
    cdf = (f: number) =>
      f === 0 ? 0 : Math.exp(-input.pmBeta * (wp / (2 * Math.PI * f)) ** 4),
    band = fraction(
      cdf(input.frequencyBandHz[1]) - cdf(input.frequencyBandHz[0]),
      "band",
    );
  return {
    fullSpectrumSignificantHeightM: 4 * Math.sqrt(m0),
    bandSignificantHeightM: 4 * Math.sqrt(m0 * band),
    peakPeriodSeconds: (2 * Math.PI) / (wp * ((4 * input.pmBeta) / 5) ** 0.25),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  referenceWindSpeedMPerSecond: 10,
  gravityMPerSecondSquared: 1,
  pmAlpha: 0.01,
  pmBeta: 1,
  frequencyBandHz: [0, 0.015915494309189534],
  frequencyWindCoefficient: 1,
} satisfies Input;
export const exampleOutput = {
  fullSpectrumSignificantHeightM: 20,
  bandSignificantHeightM: 12.130613194252668,
  peakPeriodSeconds: 66.43659586683668,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "oceanography/pierson-moskowitz-significant-height",
  title: "Pierson Moskowitz Significant Height",
  description:
    "Integrate a caller-parameter Pierson–Moskowitz omega^-5 spectrum analytically over full and finite frequency bands; reference wind-height convention is caller calibrated, not a measured buoy-spectrum alias.",
  inputs: inputFields,
  outputs: [
    {
      id: "fullSpectrumSignificantHeightM",
      label: "Full spectrum significant height m",
      kind: "number",
    },
    {
      id: "bandSignificantHeightM",
      label: "Band significant height m",
      kind: "number",
    },
    { id: "peakPeriodSeconds", label: "Peak period seconds", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      referenceWindSpeedMPerSecond:
        value.referenceWindSpeedMPerSecond as number,
      gravityMPerSecondSquared: value.gravityMPerSecondSquared as number,
      pmAlpha: value.pmAlpha as number,
      pmBeta: value.pmBeta as number,
      frequencyBandHz: value.frequencyBandHz as readonly number[],
      frequencyWindCoefficient: value.frequencyWindCoefficient as number,
    }),
});
export const run = tool.execute;
export default tool;

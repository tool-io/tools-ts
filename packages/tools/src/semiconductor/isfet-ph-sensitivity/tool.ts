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
  linearFit,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedIsfetPh: readonly number[];
  readonly observedIsfetGateResponsesV: readonly number[];
  readonly observedMatchedTemperatureKelvin: number;
  readonly callerBoltzmannVoltsKelvin: number;
}>;
export type Output = Readonly<{
  readonly signedMeasuredIsfetVoltsPh: number;
  readonly idealNernstMagnitudeVoltsPh: number;
  readonly measuredMagnitudeToNernstRatio: number;
}>;
const inputFields = [
  { id: "observedIsfetPh", label: "Observed isfet ph", kind: "numberList" },
  {
    id: "observedIsfetGateResponsesV",
    label: "Observed isfet gate responses v",
    kind: "numberList",
  },
  {
    id: "observedMatchedTemperatureKelvin",
    label: "Observed matched temperature kelvin",
    kind: "number",
  },
  {
    id: "callerBoltzmannVoltsKelvin",
    label: "Caller boltzmann volts kelvin",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.observedMatchedTemperatureKelvin,
    "observedMatchedTemperatureKelvin",
  );
  positive(input.callerBoltzmannVoltsKelvin, "callerBoltzmannVoltsKelvin");
  input.observedIsfetPh.forEach((v) => {
    if (v < 0 || v > 14) simpleError("pH", "Measured pH [0,14] required.");
  });
  const fit = linearFit(
      input.observedIsfetPh,
      input.observedIsfetGateResponsesV,
    ),
    nernst =
      Math.LN10 *
      input.callerBoltzmannVoltsKelvin *
      input.observedMatchedTemperatureKelvin;
  return {
    signedMeasuredIsfetVoltsPh: fit.slope,
    idealNernstMagnitudeVoltsPh: nernst,
    measuredMagnitudeToNernstRatio: Math.abs(fit.slope) / nernst,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedIsfetPh: [4, 7, 10],
  observedIsfetGateResponsesV: [0.3, 0.15, 0],
  observedMatchedTemperatureKelvin: 300,
  callerBoltzmannVoltsKelvin: 0.0001,
} satisfies Input;
export const exampleOutput = {
  signedMeasuredIsfetVoltsPh: -0.05,
  idealNernstMagnitudeVoltsPh: 0.06907755278982138,
  measuredMagnitudeToNernstRatio: 0.7238241365054197,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/isfet-ph-sensitivity",
  title: "Semiconductor Isfet Ph Sensitivity Calculator",
  description:
    "Fit actual ISFET pH-response and compare explicit temperature-dependent Nernst magnitude, not bare Nernst default or BioFET log-concentration response; no water-quality certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedMeasuredIsfetVoltsPh",
      label: "Signed measured isfet volts ph",
      kind: "number",
    },
    {
      id: "idealNernstMagnitudeVoltsPh",
      label: "Ideal nernst magnitude volts ph",
      kind: "number",
    },
    {
      id: "measuredMagnitudeToNernstRatio",
      label: "Measured magnitude to nernst ratio",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedIsfetPh: value.observedIsfetPh as readonly number[],
      observedIsfetGateResponsesV:
        value.observedIsfetGateResponsesV as readonly number[],
      observedMatchedTemperatureKelvin:
        value.observedMatchedTemperatureKelvin as number,
      callerBoltzmannVoltsKelvin: value.callerBoltzmannVoltsKelvin as number,
    }),
});
export const run = tool.execute;
export default tool;

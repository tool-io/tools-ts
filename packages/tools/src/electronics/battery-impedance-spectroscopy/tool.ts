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
  aligned,
  strictlyIncreasing,
} from "../batch32-shared.js";
export type Input = Readonly<{
  readonly frequenciesHz: readonly number[];
  readonly voltageAmplitudeV: readonly number[];
  readonly currentAmplitudeA: readonly number[];
  readonly voltageMinusCurrentPhasesDegrees: readonly number[];
}>;
export type Output = Readonly<{
  readonly impedanceRealOhms: readonly number[];
  readonly impedanceImaginaryOhms: readonly number[];
  readonly nyquistNegativeImaginaryOhms: readonly number[];
  readonly impedanceMagnitudesOhms: readonly number[];
}>;
const inputFields = [
  { id: "frequenciesHz", label: "Frequencies hz", kind: "numberList" },
  { id: "voltageAmplitudeV", label: "Voltage amplitude v", kind: "numberList" },
  { id: "currentAmplitudeA", label: "Current amplitude a", kind: "numberList" },
  {
    id: "voltageMinusCurrentPhasesDegrees",
    label: "Voltage minus current phases degrees",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.frequenciesHz.forEach((v) => positive(v, "frequenciesHz"));
  input.voltageAmplitudeV.forEach((v) => positive(v, "voltageAmplitudeV"));
  input.currentAmplitudeA.forEach((v) => positive(v, "currentAmplitudeA"));
  aligned(input.frequenciesHz, input.voltageAmplitudeV, "frequenciesHz");
  aligned(input.frequenciesHz, input.currentAmplitudeA, "frequenciesHz");
  aligned(
    input.frequenciesHz,
    input.voltageMinusCurrentPhasesDegrees,
    "frequenciesHz",
  );
  strictlyIncreasing(input.frequenciesHz, "frequencies");
  if (input.voltageMinusCurrentPhasesDegrees.some((v) => Math.abs(v) > 180))
    simpleError(
      "phase",
      "Explicit signed voltage-minus-current phase in ±180 degrees required.",
    );
  const mags = input.voltageAmplitudeV.map(
      (v, i) => v / input.currentAmplitudeA[i],
    ),
    real = mags.map(
      (v, i) =>
        v *
        Math.cos((input.voltageMinusCurrentPhasesDegrees[i] * Math.PI) / 180),
    ),
    imag = mags.map(
      (v, i) =>
        v *
        Math.sin((input.voltageMinusCurrentPhasesDegrees[i] * Math.PI) / 180),
    );
  return {
    impedanceRealOhms: real,
    impedanceImaginaryOhms: imag,
    nyquistNegativeImaginaryOhms: imag.map((v) => -v),
    impedanceMagnitudesOhms: mags,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  frequenciesHz: [1, 2],
  voltageAmplitudeV: [1, 1],
  currentAmplitudeA: [0.1, 0.2],
  voltageMinusCurrentPhasesDegrees: [0, -90],
} satisfies Input;
export const exampleOutput = {
  impedanceRealOhms: [10, 0],
  impedanceImaginaryOhms: [0, -5],
  nyquistNegativeImaginaryOhms: [0, 5],
  impedanceMagnitudesOhms: [10, 5],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "electronics/battery-impedance-spectroscopy",
  title: "Battery Impedance Spectroscopy Calculator",
  description:
    "Reduce matched measured battery AC voltage/current spectra to signed complex Z and Nyquist −Im(Z), not equivalent-circuit fitting or SOH inference; same amplitude convention and linear stationary perturbation applicability caller supplied.",
  inputs: inputFields,
  outputs: [
    {
      id: "impedanceRealOhms",
      label: "Impedance real ohms",
      kind: "numberList",
    },
    {
      id: "impedanceImaginaryOhms",
      label: "Impedance imaginary ohms",
      kind: "numberList",
    },
    {
      id: "nyquistNegativeImaginaryOhms",
      label: "Nyquist negative imaginary ohms",
      kind: "numberList",
    },
    {
      id: "impedanceMagnitudesOhms",
      label: "Impedance magnitudes ohms",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      frequenciesHz: value.frequenciesHz as readonly number[],
      voltageAmplitudeV: value.voltageAmplitudeV as readonly number[],
      currentAmplitudeA: value.currentAmplitudeA as readonly number[],
      voltageMinusCurrentPhasesDegrees:
        value.voltageMinusCurrentPhasesDegrees as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;

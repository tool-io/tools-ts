import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly dopplerFrequenciesHertz: readonly number[];
  readonly powerSpectrum: readonly number[];
}>;
export type Output = Readonly<{
  readonly totalDopplerPower: number;
  readonly meanAbsoluteFrequencyHertz: number;
  readonly perfusionIndex: number;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.dopplerFrequenciesHertz.length === 0 ||
    input.dopplerFrequenciesHertz.length !== input.powerSpectrum.length ||
    input.powerSpectrum.some((value) => value < 0)
  )
    simpleError(
      "dopplerFrequenciesHertz",
      "Frequency and nonnegative power lists must be aligned and nonempty.",
      "invalid_spectrum",
    );
  const totalDopplerPower = input.powerSpectrum.reduce((a, b) => a + b, 0);
  if (totalDopplerPower === 0)
    simpleError(
      "powerSpectrum",
      "Total Doppler power must be positive.",
      "zero_power",
    );
  const perfusionIndex = input.dopplerFrequenciesHertz.reduce(
    (sum, value, index) => sum + Math.abs(value) * input.powerSpectrum[index],
    0,
  );
  return {
    totalDopplerPower,
    meanAbsoluteFrequencyHertz: perfusionIndex / totalDopplerPower,
    perfusionIndex,
  };
};

export const exampleInput = {
  dopplerFrequenciesHertz: [-2, 0, 2],
  powerSpectrum: [1, 2, 1],
} satisfies Input;
export const exampleOutput = {
  totalDopplerPower: 4,
  meanAbsoluteFrequencyHertz: 1,
  perfusionIndex: 4,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      dopplerFrequenciesHertz:
        input.dopplerFrequenciesHertz as readonly number[],
      powerSpectrum: input.powerSpectrum as readonly number[],
    }),
  description:
    "Calculate a first-moment laser-Doppler perfusion index from a supplied spectrum.",
  id: "laser/doppler-flow-perfusion-index",
  inputs: [
    {
      id: "dopplerFrequenciesHertz",
      label: "Doppler frequency bins",
      kind: "numberList",
      unit: "Hz",
    },
    {
      id: "powerSpectrum",
      label: "Doppler power spectrum",
      kind: "numberList",
    },
  ],
  outputs: [
    {
      id: "totalDopplerPower",
      label: "Total Doppler power",
      kind: "number",
      minimum: 0,
    },
    {
      id: "meanAbsoluteFrequencyHertz",
      label: "Power-weighted mean absolute frequency",
      kind: "number",
      minimum: 0,
      unit: "Hz",
    },
    {
      id: "perfusionIndex",
      label: "First-moment perfusion index",
      kind: "number",
      minimum: 0,
      unit: "Hz·power",
    },
  ],
  title: "Doppler-Flow Perfusion Index",
});

export const run = tool.execute;
export default tool;

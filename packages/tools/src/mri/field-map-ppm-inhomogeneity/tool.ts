import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, mean } from "../shared.js";
export type Input = Readonly<{
  readonly offResonanceHz: readonly number[];
  readonly referenceFrequencyMHz: number;
}>;
export type Output = Readonly<{
  readonly offsetsPpm: readonly number[];
  readonly peakToPeakPpm: number;
  readonly rmsPpm: number;
}>;
const inputFields = [
  {
    id: "offResonanceHz",
    label: "Off resonance hz",
    kind: "numberList",
    unit: "Hz",
  },
  {
    id: "referenceFrequencyMHz",
    label: "Reference frequency m hz",
    kind: "number",
    unit: "Hz",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (!input.offResonanceHz.length)
    simpleError(
      "offResonanceHz",
      "Nonempty measured field-map offsets required.",
    );
  positive(input.referenceFrequencyMHz, "referenceFrequencyMHz");
  const offsetsPpm = input.offResonanceHz.map(
    (v) => v / input.referenceFrequencyMHz,
  );
  return {
    offsetsPpm,
    peakToPeakPpm: Math.max(...offsetsPpm) - Math.min(...offsetsPpm),
    rmsPpm: Math.sqrt(mean(offsetsPpm.map((v) => v * v))),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  offResonanceHz: [-100, 0, 100],
  referenceFrequencyMHz: 100,
} satisfies Input;
export const exampleOutput = {
  offsetsPpm: [-1, 0, 1],
  peakToPeakPpm: 2,
  rmsPpm: 0.816496580927726,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mri/field-map-ppm-inhomogeneity",
  title: "B0 Inhomogeneity PPM",
  description:
    "Summarize a measured B0 offset map in ppm with peak-to-peak and RMS about the frequency reference, not a fitted shim solution.",
  inputs: inputFields,
  outputs: [
    { id: "offsetsPpm", label: "Offsets ppm", kind: "numberList", unit: "ppm" },
    {
      id: "peakToPeakPpm",
      label: "Peak to peak ppm",
      kind: "number",
      unit: "ppm",
    },
    { id: "rmsPpm", label: "Rms ppm", kind: "number", unit: "ppm" },
  ],
  calculate: (value) =>
    calculate({
      offResonanceHz: value.offResonanceHz as readonly number[],
      referenceFrequencyMHz: value.referenceFrequencyMHz as number,
    }),
});
export const run = tool.execute;
export default tool;

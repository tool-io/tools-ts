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
  ordered,
} from "../shared.js";
export type Input = Readonly<{
  readonly frequenciesHz: readonly number[];
  readonly impedanceMagnitudesMohm: readonly number[];
}>;
export type Output = Readonly<{
  readonly resonanceFrequencyHz: number;
  readonly peakImpedanceMohm: number;
  readonly peakToLowestFrequencyRatio: number;
  readonly interiorPeakObserved: boolean;
}>;
const inputFields = [
  { id: "frequenciesHz", label: "Frequencies hz", kind: "numberList" },
  {
    id: "impedanceMagnitudesMohm",
    label: "Impedance magnitudes mohm",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(input.frequenciesHz, input.impedanceMagnitudesMohm, "frequenciesHz");
  ordered(input.frequenciesHz, "frequenciesHz");
  input.frequenciesHz.forEach((v) => positive(v, "frequenciesHz"));
  input.impedanceMagnitudesMohm.forEach((v) =>
    positive(v, "impedanceMagnitudesMohm"),
  );
  const peakImpedanceMohm = Math.max(...input.impedanceMagnitudesMohm),
    index = input.impedanceMagnitudesMohm.indexOf(peakImpedanceMohm);
  if (
    input.impedanceMagnitudesMohm.filter((v) => v === peakImpedanceMohm)
      .length > 1
  )
    simpleError(
      "impedanceMagnitudesMohm",
      "Peak is tied; a unique sampled resonance cannot be assigned.",
    );
  return {
    resonanceFrequencyHz: input.frequenciesHz[index],
    peakImpedanceMohm,
    peakToLowestFrequencyRatio:
      peakImpedanceMohm / input.impedanceMagnitudesMohm[0],
    interiorPeakObserved: index > 0 && index < input.frequenciesHz.length - 1,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  frequenciesHz: [1, 5, 10],
  impedanceMagnitudesMohm: [2, 6, 3],
} satisfies Input;
export const exampleOutput = {
  resonanceFrequencyHz: 5,
  peakImpedanceMohm: 6,
  peakToLowestFrequencyRatio: 3,
  interiorPeakObserved: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/sampled-neuronal-resonance",
  title: "Resonance Frequency",
  description:
    "Find the unique sampled impedance maximum and distinguish an interior resonance candidate from an edge maximum; ratio references the lowest measured frequency, not extrapolated DC.",
  inputs: inputFields,
  outputs: [
    {
      id: "resonanceFrequencyHz",
      label: "Resonance frequency hz",
      kind: "number",
    },
    { id: "peakImpedanceMohm", label: "Peak impedance mohm", kind: "number" },
    {
      id: "peakToLowestFrequencyRatio",
      label: "Peak to lowest frequency ratio",
      kind: "number",
    },
    {
      id: "interiorPeakObserved",
      label: "Interior peak observed",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      frequenciesHz: value.frequenciesHz as readonly number[],
      impedanceMagnitudesMohm:
        value.impedanceMagnitudesMohm as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;

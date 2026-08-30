import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly fieldSamples: readonly number[];
  readonly sampleIntervalPicoseconds: number;
}>;
export type Output = Readonly<{
  readonly frequenciesTerahertz: readonly number[];
  readonly magnitudeSpectrum: readonly number[];
}>;

export const calculate = (input: Input): Output => {
  const n = input.fieldSamples.length;
  if (n === 0 || input.sampleIntervalPicoseconds <= 0)
    simpleError(
      "fieldSamples",
      "Samples must be nonempty and interval positive.",
      "invalid_samples",
    );
  const magnitudeSpectrum = Array.from({ length: n }, (_, k) => {
    let re = 0,
      im = 0;
    for (let j = 0; j < n; j += 1) {
      const angle = (-2 * Math.PI * j * k) / n;
      re += input.fieldSamples[j] * Math.cos(angle);
      im += input.fieldSamples[j] * Math.sin(angle);
    }
    return Math.hypot(re, im);
  });
  const frequenciesTerahertz = Array.from(
    { length: n },
    (_, k) => k / (n * input.sampleIntervalPicoseconds),
  );
  return { frequenciesTerahertz, magnitudeSpectrum };
};

export const exampleInput = {
  fieldSamples: [1, 0, -1, 0],
  sampleIntervalPicoseconds: 1,
} satisfies Input;
export const exampleOutput = {
  frequenciesTerahertz: [0, 0.25, 0.5, 0.75],
  magnitudeSpectrum: [0, 2, 2.4492935982947064e-16, 2],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      fieldSamples: input.fieldSamples as readonly number[],
      sampleIntervalPicoseconds: input.sampleIntervalPicoseconds as number,
    }),
  description:
    "Compute a direct discrete magnitude spectrum from a THz time-domain waveform.",
  id: "laser/thz-waveform-spectrum",
  inputs: [
    {
      id: "fieldSamples",
      label: "Time-domain field samples",
      kind: "numberList",
    },
    {
      id: "sampleIntervalPicoseconds",
      label: "Sample interval",
      kind: "number",
      minimum: 0,
      unit: "ps",
    },
  ],
  outputs: [
    {
      id: "frequenciesTerahertz",
      label: "DFT frequencies",
      kind: "numberList",
      unit: "THz",
    },
    { id: "magnitudeSpectrum", label: "DFT magnitudes", kind: "numberList" },
  ],
  title: "THz Waveform Spectrum",
});

export const run = tool.execute;
export default tool;

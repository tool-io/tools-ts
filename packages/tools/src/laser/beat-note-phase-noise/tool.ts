import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly phaseSamplesRadians: readonly number[];
  readonly beatFrequencyHertz: number;
}>;
export type Output = Readonly<{
  readonly meanPhaseRadians: number;
  readonly rmsPhaseNoiseRadians: number;
  readonly timingJitterSeconds: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.phaseSamplesRadians.length === 0 || input.beatFrequencyHertz <= 0)
    simpleError(
      "phaseSamplesRadians",
      "Samples must be nonempty and beat frequency positive.",
      "invalid_samples",
    );
  const meanPhaseRadians =
    input.phaseSamplesRadians.reduce((a, b) => a + b, 0) /
    input.phaseSamplesRadians.length;
  const rmsPhaseNoiseRadians = Math.sqrt(
    input.phaseSamplesRadians.reduce(
      (sum, value) => sum + (value - meanPhaseRadians) ** 2,
      0,
    ) / input.phaseSamplesRadians.length,
  );
  return {
    meanPhaseRadians,
    rmsPhaseNoiseRadians,
    timingJitterSeconds:
      rmsPhaseNoiseRadians / (2 * Math.PI * input.beatFrequencyHertz),
  };
};

export const exampleInput = {
  phaseSamplesRadians: [-1, 1],
  beatFrequencyHertz: 0.15915494309189535,
} satisfies Input;
export const exampleOutput = {
  meanPhaseRadians: 0,
  rmsPhaseNoiseRadians: 1,
  timingJitterSeconds: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      phaseSamplesRadians: input.phaseSamplesRadians as readonly number[],
      beatFrequencyHertz: input.beatFrequencyHertz as number,
    }),
  description:
    "Calculate beat-note RMS phase noise and equivalent timing jitter.",
  id: "laser/beat-note-phase-noise",
  inputs: [
    {
      id: "phaseSamplesRadians",
      label: "Beat-note phase samples",
      kind: "numberList",
      unit: "rad",
    },
    {
      id: "beatFrequencyHertz",
      label: "Beat frequency",
      kind: "number",
      minimum: 0,
      unit: "Hz",
    },
  ],
  outputs: [
    {
      id: "meanPhaseRadians",
      label: "Mean phase",
      kind: "number",
      unit: "rad",
    },
    {
      id: "rmsPhaseNoiseRadians",
      label: "RMS phase noise",
      kind: "number",
      minimum: 0,
      unit: "rad",
    },
    {
      id: "timingJitterSeconds",
      label: "Equivalent timing jitter",
      kind: "number",
      minimum: 0,
      unit: "s",
    },
  ],
  title: "Beat-Note Phase Noise",
});

export const run = tool.execute;
export default tool;

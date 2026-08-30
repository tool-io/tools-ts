import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly baselineDisplacementNoise: number;
  readonly cantileverDisplacementNoise: number;
  readonly baselineSignal: number;
  readonly cantileverSignal: number;
}>;
export type Output = Readonly<{
  readonly signalGain: number;
  readonly snrGain: number;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.baselineSignal <= 0 ||
    input.baselineDisplacementNoise <= 0 ||
    input.cantileverDisplacementNoise <= 0
  )
    simpleError(
      "baselineSignal",
      "Signals and noise references must be positive.",
      "invalid_baseline",
    );
  const signalGain = input.cantileverSignal / input.baselineSignal;
  return {
    signalGain,
    snrGain:
      input.cantileverSignal /
      input.cantileverDisplacementNoise /
      (input.baselineSignal / input.baselineDisplacementNoise),
  };
};

export const exampleInput = {
  baselineDisplacementNoise: 2,
  cantileverDisplacementNoise: 1,
  baselineSignal: 10,
  cantileverSignal: 20,
} satisfies Input;
export const exampleOutput = { signalGain: 2, snrGain: 4 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      baselineDisplacementNoise: input.baselineDisplacementNoise as number,
      cantileverDisplacementNoise: input.cantileverDisplacementNoise as number,
      baselineSignal: input.baselineSignal as number,
      cantileverSignal: input.cantileverSignal as number,
    }),
  description: "Compare cantilever and baseline photoacoustic signal and SNR.",
  id: "laser/cantilever-photoacoustic-gain",
  inputs: [
    {
      id: "baselineDisplacementNoise",
      label: "Baseline displacement noise",
      kind: "number",
      minimum: 0,
    },
    {
      id: "cantileverDisplacementNoise",
      label: "Cantilever displacement noise",
      kind: "number",
      minimum: 0,
    },
    {
      id: "baselineSignal",
      label: "Baseline photoacoustic signal",
      kind: "number",
      minimum: 0,
    },
    {
      id: "cantileverSignal",
      label: "Cantilever photoacoustic signal",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "signalGain",
      label: "Cantilever-to-baseline signal gain",
      kind: "number",
      minimum: 0,
    },
    {
      id: "snrGain",
      label: "Cantilever-to-baseline SNR gain",
      kind: "number",
      minimum: 0,
    },
  ],
  title: "Cantilever Photoacoustic Gain",
});

export const run = tool.execute;
export default tool;

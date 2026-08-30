import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly cavityFrequencyHertz: number;
  readonly combOffsetHertz: number;
  readonly combRepetitionHertz: number;
  readonly cavityLinewidthHertz: number;
}>;
export type Output = Readonly<{
  readonly nearestToothIndex: number;
  readonly nearestToothFrequencyHertz: number;
  readonly detuningHertz: number;
  readonly withinHalfLinewidth: boolean;
}>;

export const calculate = (input: Input): Output => {
  if (input.combRepetitionHertz <= 0)
    simpleError(
      "combRepetitionHertz",
      "Comb repetition rate must be positive.",
      "invalid_rate",
    );
  const nearestToothIndex = Math.round(
    (input.cavityFrequencyHertz - input.combOffsetHertz) /
      input.combRepetitionHertz,
  );
  const nearestToothFrequencyHertz =
    input.combOffsetHertz + nearestToothIndex * input.combRepetitionHertz;
  const detuningHertz = nearestToothFrequencyHertz - input.cavityFrequencyHertz;
  return {
    nearestToothIndex,
    nearestToothFrequencyHertz,
    detuningHertz,
    withinHalfLinewidth:
      Math.abs(detuningHertz) <= input.cavityLinewidthHertz / 2,
  };
};

export const exampleInput = {
  cavityFrequencyHertz: 1010,
  combOffsetHertz: 10,
  combRepetitionHertz: 100,
  cavityLinewidthHertz: 20,
} satisfies Input;
export const exampleOutput = {
  nearestToothIndex: 10,
  nearestToothFrequencyHertz: 1010,
  detuningHertz: 0,
  withinHalfLinewidth: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      cavityFrequencyHertz: input.cavityFrequencyHertz as number,
      combOffsetHertz: input.combOffsetHertz as number,
      combRepetitionHertz: input.combRepetitionHertz as number,
      cavityLinewidthHertz: input.cavityLinewidthHertz as number,
    }),
  description: "Match a cavity resonance to the nearest frequency-comb tooth.",
  id: "laser/comb-cavity-tooth-match",
  inputs: [
    {
      id: "cavityFrequencyHertz",
      label: "Cavity resonance frequency",
      kind: "number",
      minimum: 0,
      unit: "Hz",
    },
    {
      id: "combOffsetHertz",
      label: "Comb offset frequency",
      kind: "number",
      minimum: 0,
      unit: "Hz",
    },
    {
      id: "combRepetitionHertz",
      label: "Comb repetition rate",
      kind: "number",
      minimum: 0,
      unit: "Hz",
    },
    {
      id: "cavityLinewidthHertz",
      label: "Cavity linewidth",
      kind: "number",
      minimum: 0,
      unit: "Hz",
    },
  ],
  outputs: [
    {
      id: "nearestToothIndex",
      label: "Nearest comb-tooth index",
      kind: "integer",
    },
    {
      id: "nearestToothFrequencyHertz",
      label: "Nearest tooth frequency",
      kind: "number",
      minimum: 0,
      unit: "Hz",
    },
    {
      id: "detuningHertz",
      label: "Signed tooth detuning",
      kind: "number",
      unit: "Hz",
    },
    {
      id: "withinHalfLinewidth",
      label: "Within half-linewidth",
      kind: "boolean",
    },
  ],
  title: "Comb\u2013Cavity Tooth Match",
});

export const run = tool.execute;
export default tool;

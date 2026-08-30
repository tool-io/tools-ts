import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly pumpWavevectorPerMeter: number;
  readonly signalWavevectorPerMeter: number;
  readonly idlerWavevectorPerMeter: number;
  readonly crystalLengthMeters: number;
}>;
export type Output = Readonly<{
  readonly phaseMismatchPerMeter: number;
  readonly coherenceLengthMeters: number;
  readonly normalizedEfficiency: number;
}>;

export const calculate = (input: Input): Output => {
  const phaseMismatchPerMeter =
    input.signalWavevectorPerMeter +
    input.idlerWavevectorPerMeter -
    input.pumpWavevectorPerMeter;
  const halfArgument = (phaseMismatchPerMeter * input.crystalLengthMeters) / 2;
  const sinc = halfArgument === 0 ? 1 : Math.sin(halfArgument) / halfArgument;
  return {
    phaseMismatchPerMeter,
    coherenceLengthMeters:
      phaseMismatchPerMeter === 0
        ? 0
        : Math.PI / Math.abs(phaseMismatchPerMeter),
    normalizedEfficiency: sinc * sinc,
  };
};

export const exampleInput = {
  pumpWavevectorPerMeter: 2,
  signalWavevectorPerMeter: 1,
  idlerWavevectorPerMeter: 1,
  crystalLengthMeters: 1,
} satisfies Input;
export const exampleOutput = {
  phaseMismatchPerMeter: 0,
  coherenceLengthMeters: 0,
  normalizedEfficiency: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      pumpWavevectorPerMeter: input.pumpWavevectorPerMeter as number,
      signalWavevectorPerMeter: input.signalWavevectorPerMeter as number,
      idlerWavevectorPerMeter: input.idlerWavevectorPerMeter as number,
      crystalLengthMeters: input.crystalLengthMeters as number,
    }),
  description:
    "Calculate SHG-style phase mismatch, coherence length, and normalized conversion efficiency.",
  id: "laser/shg-phase-match",
  inputs: [
    {
      id: "pumpWavevectorPerMeter",
      label: "Pump wavevector",
      kind: "number",
      unit: "1/m",
    },
    {
      id: "signalWavevectorPerMeter",
      label: "Signal wavevector",
      kind: "number",
      unit: "1/m",
    },
    {
      id: "idlerWavevectorPerMeter",
      label: "Idler wavevector",
      kind: "number",
      unit: "1/m",
    },
    {
      id: "crystalLengthMeters",
      label: "Crystal length",
      kind: "number",
      minimum: 0,
      unit: "m",
    },
  ],
  outputs: [
    {
      id: "phaseMismatchPerMeter",
      label: "Phase mismatch",
      kind: "number",
      unit: "1/m",
    },
    {
      id: "coherenceLengthMeters",
      label: "Coherence length",
      kind: "number",
      minimum: 0,
      unit: "m",
    },
    {
      id: "normalizedEfficiency",
      label: "Sinc-squared efficiency",
      kind: "number",
      minimum: 0,
      maximum: 1,
    },
  ],
  title: "SHG Phase Match",
});

export const run = tool.execute;
export default tool;

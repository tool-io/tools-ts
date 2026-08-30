import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly referenceSpikeInReads: number;
  readonly sampleSpikeInReads: number;
  readonly sampleSignals: readonly number[];
}>;
export type Output = Readonly<{
  readonly scalingFactor: number;
  readonly scaledSignals: readonly number[];
  readonly scaledSignalTotal: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.sampleSpikeInReads <= 0)
    simpleError(
      "sampleSpikeInReads",
      "Sample spike-in reads must be positive.",
      "invalid_spikein",
    );
  const scalingFactor = input.referenceSpikeInReads / input.sampleSpikeInReads,
    scaledSignals = input.sampleSignals.map((value) => value * scalingFactor);
  return {
    scalingFactor,
    scaledSignals,
    scaledSignalTotal: scaledSignals.reduce((a, b) => a + b, 0),
  };
};

export const exampleInput = {
  referenceSpikeInReads: 1000,
  sampleSpikeInReads: 500,
  sampleSignals: [10, 20],
} satisfies Input;
export const exampleOutput = {
  scalingFactor: 2,
  scaledSignals: [20, 40],
  scaledSignalTotal: 60,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      referenceSpikeInReads: input.referenceSpikeInReads as number,
      sampleSpikeInReads: input.sampleSpikeInReads as number,
      sampleSignals: input.sampleSignals as readonly number[],
    }),
  description: "Apply a spike-in normalization factor to sample signals.",
  id: "epigenetics/spike-in-scaling",
  inputs: [
    {
      id: "referenceSpikeInReads",
      label: "Reference spike-in reads",
      kind: "number",
      minimum: 0,
    },
    {
      id: "sampleSpikeInReads",
      label: "Sample spike-in reads",
      kind: "number",
      minimum: 0,
    },
    { id: "sampleSignals", label: "Sample signals", kind: "numberList" },
  ],
  outputs: [
    {
      id: "scalingFactor",
      label: "Spike-in scaling factor",
      kind: "number",
      minimum: 0,
    },
    { id: "scaledSignals", label: "Scaled sample signals", kind: "numberList" },
    { id: "scaledSignalTotal", label: "Scaled signal total", kind: "number" },
  ],
  title: "Spike-In Scaling",
});

export const run = tool.execute;
export default tool;

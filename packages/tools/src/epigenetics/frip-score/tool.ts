import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly readsInPeaks: number;
  readonly totalMappedReads: number;
}>;
export type Output = Readonly<{
  readonly fripFraction: number;
  readonly fripPercent: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.readsInPeaks > input.totalMappedReads)
    simpleError(
      "readsInPeaks",
      "Reads in peaks cannot exceed mapped reads.",
      "invalid_counts",
    );
  const fripFraction = input.readsInPeaks / input.totalMappedReads;
  return { fripFraction, fripPercent: fripFraction * 100 };
};

export const exampleInput = {
  readsInPeaks: 250,
  totalMappedReads: 1000,
} satisfies Input;
export const exampleOutput = {
  fripFraction: 0.25,
  fripPercent: 25,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      readsInPeaks: input.readsInPeaks as number,
      totalMappedReads: input.totalMappedReads as number,
    }),
  description: "Calculate fraction of mapped reads in peaks.",
  id: "epigenetics/frip-score",
  inputs: [
    {
      id: "readsInPeaks",
      label: "Reads in peaks",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "totalMappedReads",
      label: "Total mapped reads",
      kind: "integer",
      minimum: 1,
    },
  ],
  outputs: [
    {
      id: "fripFraction",
      label: "FRiP fraction",
      kind: "number",
      minimum: 0,
      maximum: 1,
    },
    {
      id: "fripPercent",
      label: "FRiP percentage",
      kind: "number",
      minimum: 0,
      maximum: 100,
    },
  ],
  title: "FRiP Score",
});

export const run = tool.execute;
export default tool;

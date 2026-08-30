import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly readsInPeaks: number;
  readonly mappedReads: number;
  readonly minimumFripPercent: number;
}>;
export type Output = Readonly<{
  readonly fripPercent: number;
  readonly passesGate: boolean;
}>;

export const calculate = (input: Input): Output => {
  if (input.readsInPeaks > input.mappedReads)
    simpleError(
      "readsInPeaks",
      "Reads in peaks cannot exceed mapped reads.",
      "invalid_counts",
    );
  const fripPercent = (input.readsInPeaks / input.mappedReads) * 100;
  return { fripPercent, passesGate: fripPercent >= input.minimumFripPercent };
};

export const exampleInput = {
  readsInPeaks: 300,
  mappedReads: 1000,
  minimumFripPercent: 20,
} satisfies Input;
export const exampleOutput = {
  fripPercent: 30,
  passesGate: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      readsInPeaks: input.readsInPeaks as number,
      mappedReads: input.mappedReads as number,
      minimumFripPercent: input.minimumFripPercent as number,
    }),
  description: "Gate ATAC quality by fraction of reads in peaks.",
  id: "epigenetics/atac-frip-gate",
  inputs: [
    {
      id: "readsInPeaks",
      label: "Reads in peaks",
      kind: "integer",
      minimum: 0,
    },
    { id: "mappedReads", label: "Mapped reads", kind: "integer", minimum: 1 },
    {
      id: "minimumFripPercent",
      label: "Minimum FRiP",
      kind: "number",
      minimum: 0,
      maximum: 100,
    },
  ],
  outputs: [
    {
      id: "fripPercent",
      label: "FRiP",
      kind: "number",
      minimum: 0,
      maximum: 100,
    },
    { id: "passesGate", label: "Passes FRiP gate", kind: "boolean" },
  ],
  title: "ATAC FRiP Gate",
});

export const run = tool.execute;
export default tool;

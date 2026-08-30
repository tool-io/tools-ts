import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly rawCounts: readonly number[];
  readonly libraryMappedReads: number;
}>;
export type Output = Readonly<{
  readonly cpm: readonly number[];
  readonly cpmSum: number;
}>;
export const calculate = (input: Input): Output => {
  if (
    input.libraryMappedReads <= 0 ||
    input.rawCounts.length === 0 ||
    input.rawCounts.some((v) => v < 0)
  )
    simpleError(
      "rawCounts",
      "Nonnegative counts and positive mapped library size required.",
    );
  const cpm = input.rawCounts.map((v) => (v / input.libraryMappedReads) * 1e6);
  return { cpm, cpmSum: cpm.reduce((a, b) => a + b, 0) };
};
export const exampleInput = {
  rawCounts: [10, 20],
  libraryMappedReads: 1000000,
} satisfies Input;
export const exampleOutput = { cpm: [10, 20], cpmSum: 30 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "transcriptomics/counts-per-million",
  title: "Counts Per Million",
  description:
    "Convert raw feature counts into counts per million mapped reads.",
  inputs: [
    { id: "rawCounts", kind: "numberList", label: "Raw counts" },
    { id: "libraryMappedReads", kind: "number", label: "Library mapped reads" },
  ],
  outputs: [
    { id: "cpm", kind: "numberList", label: "Cpm" },
    { id: "cpmSum", kind: "number", label: "Cpm sum" },
  ],
  calculate: (value) =>
    calculate({
      rawCounts: value.rawCounts as readonly number[],
      libraryMappedReads: value.libraryMappedReads as number,
    }),
});
export const run = tool.execute;
export default tool;

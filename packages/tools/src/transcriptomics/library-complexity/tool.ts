import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly totalMappedReads: number;
  readonly distinctFragments: number;
}>;
export type Output = Readonly<{
  readonly duplicatePercent: number;
  readonly uniquePercent: number;
  readonly readsPerFragment: number;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.totalMappedReads <= 0 ||
    input.distinctFragments <= 0 ||
    input.distinctFragments > input.totalMappedReads
  )
    simpleError(
      "distinctFragments",
      "Distinct fragments must be positive and at most total reads.",
    );
  return {
    duplicatePercent:
      ((input.totalMappedReads - input.distinctFragments) /
        input.totalMappedReads) *
      100,
    uniquePercent: (input.distinctFragments / input.totalMappedReads) * 100,
    readsPerFragment: input.totalMappedReads / input.distinctFragments,
  };
};

export const exampleInput = {
  totalMappedReads: 100,
  distinctFragments: 80,
} satisfies Input;
export const exampleOutput = {
  duplicatePercent: 20,
  uniquePercent: 80,
  readsPerFragment: 1.25,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  id: "transcriptomics/library-complexity",
  title: "Library Complexity",
  description:
    "Measure duplicate fraction and library complexity from distinct fragments.",
  inputs: [
    { id: "totalMappedReads", kind: "number", label: "Total mapped reads" },
    { id: "distinctFragments", kind: "number", label: "Distinct fragments" },
  ],
  outputs: [
    { id: "duplicatePercent", kind: "number", label: "Duplicate percent" },
    { id: "uniquePercent", kind: "number", label: "Unique percent" },
    { id: "readsPerFragment", kind: "number", label: "Reads per fragment" },
  ],
  calculate: (value) =>
    calculate({
      totalMappedReads: value.totalMappedReads as number,
      distinctFragments: value.distinctFragments as number,
    }),
});
export const run = tool.execute;
export default tool;

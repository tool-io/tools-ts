import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly cellIds: readonly string[];
  readonly detectedGeneCounts: readonly number[];
  readonly minimumGenes: number;
}>;
export type Output = Readonly<{
  readonly retainedCellIds: readonly string[];
  readonly rejectedCellIds: readonly string[];
  readonly retainedPercent: number;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.cellIds.length === 0 ||
    input.cellIds.length !== input.detectedGeneCounts.length ||
    input.detectedGeneCounts.some((v) => v < 0)
  )
    simpleError(
      "detectedGeneCounts",
      "Aligned nonnegative counts are required.",
    );
  const retainedCellIds = input.cellIds.filter(
      (_, i) => input.detectedGeneCounts[i] >= input.minimumGenes,
    ),
    rejectedCellIds = input.cellIds.filter(
      (_, i) => input.detectedGeneCounts[i] < input.minimumGenes,
    );
  return {
    retainedCellIds,
    rejectedCellIds,
    retainedPercent: (retainedCellIds.length / input.cellIds.length) * 100,
  };
};

export const exampleInput = {
  cellIds: ["a", "b", "c"],
  detectedGeneCounts: [100, 500, 200],
  minimumGenes: 200,
} satisfies Input;
export const exampleOutput = {
  retainedCellIds: ["b", "c"],
  rejectedCellIds: ["a"],
  retainedPercent: 66.66666666666666,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  id: "transcriptomics/cell-gene-count-filter",
  title: "Cell Gene Count Filter",
  description: "Filter single cells by detected gene-count threshold.",
  inputs: [
    { id: "cellIds", kind: "stringList", label: "Cell ids" },
    {
      id: "detectedGeneCounts",
      kind: "numberList",
      label: "Detected gene counts",
    },
    { id: "minimumGenes", kind: "number", label: "Minimum genes" },
  ],
  outputs: [
    { id: "retainedCellIds", kind: "stringList", label: "Retained cell ids" },
    { id: "rejectedCellIds", kind: "stringList", label: "Rejected cell ids" },
    { id: "retainedPercent", kind: "number", label: "Retained percent" },
  ],
  calculate: (value) =>
    calculate({
      cellIds: value.cellIds as readonly string[],
      detectedGeneCounts: value.detectedGeneCounts as readonly number[],
      minimumGenes: value.minimumGenes as number,
    }),
});
export const run = tool.execute;
export default tool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly cellIds: readonly string[];
  readonly mitochondrialCounts: readonly number[];
  readonly totalCounts: readonly number[];
  readonly maximumMitoPercent: number;
}>;
export type Output = Readonly<{
  readonly mitoPercents: readonly number[];
  readonly retainedCellIds: readonly string[];
  readonly failedCellIds: readonly string[];
}>;

export const calculate = (input: Input): Output => {
  const n = input.cellIds.length;
  if (
    n === 0 ||
    n !== input.mitochondrialCounts.length ||
    n !== input.totalCounts.length ||
    input.totalCounts.some(
      (v, i) =>
        v <= 0 ||
        input.mitochondrialCounts[i] < 0 ||
        input.mitochondrialCounts[i] > v,
    )
  )
    simpleError(
      "totalCounts",
      "Aligned positive per-cell totals are required.",
    );
  const mitoPercents = input.totalCounts.map(
    (v, i) => (input.mitochondrialCounts[i] / v) * 100,
  );
  return {
    mitoPercents,
    retainedCellIds: input.cellIds.filter(
      (_, i) => mitoPercents[i] <= input.maximumMitoPercent,
    ),
    failedCellIds: input.cellIds.filter(
      (_, i) => mitoPercents[i] > input.maximumMitoPercent,
    ),
  };
};

export const exampleInput = {
  cellIds: ["a", "b", "c"],
  mitochondrialCounts: [10, 30, 5],
  totalCounts: [100, 100, 100],
  maximumMitoPercent: 20,
} satisfies Input;
export const exampleOutput = {
  mitoPercents: [10, 30, 5],
  retainedCellIds: ["a", "c"],
  failedCellIds: ["b"],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  id: "transcriptomics/cell-mito-percent-filter",
  title: "Cell Mito Percent Filter",
  description: "Gate each single cell by its mitochondrial UMI share.",
  inputs: [
    { id: "cellIds", kind: "stringList", label: "Cell ids" },
    {
      id: "mitochondrialCounts",
      kind: "numberList",
      label: "Mitochondrial counts",
    },
    { id: "totalCounts", kind: "numberList", label: "Total counts" },
    {
      id: "maximumMitoPercent",
      kind: "number",
      label: "Maximum mito percent",
    },
  ],
  outputs: [
    { id: "mitoPercents", kind: "numberList", label: "Mito percents" },
    { id: "retainedCellIds", kind: "stringList", label: "Retained cell ids" },
    { id: "failedCellIds", kind: "stringList", label: "Failed cell ids" },
  ],
  calculate: (value) =>
    calculate({
      cellIds: value.cellIds as readonly string[],
      mitochondrialCounts: value.mitochondrialCounts as readonly number[],
      totalCounts: value.totalCounts as readonly number[],
      maximumMitoPercent: value.maximumMitoPercent as number,
    }),
});
export const run = tool.execute;
export default tool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly cellGeneCounts: readonly (readonly number[])[];
}>;
export type Output = Readonly<{
  readonly nonzeroCount: number;
  readonly totalEntries: number;
  readonly sparsityPercent: number;
}>;

export const calculate = (input: Input): Output => {
  const m = input.cellGeneCounts,
    w = m[0]?.length;
  if (
    m.length === 0 ||
    !w ||
    m.some((r) => r.length !== w || r.some((v) => v < 0))
  )
    simpleError(
      "cellGeneCounts",
      "A rectangular nonnegative count matrix is required.",
    );
  const nonzeroCount = m.reduce(
      (s, r) => s + r.filter((v) => v !== 0).length,
      0,
    ),
    totalEntries = m.length * w;
  return {
    nonzeroCount,
    totalEntries,
    sparsityPercent: ((totalEntries - nonzeroCount) / totalEntries) * 100,
  };
};

export const exampleInput = {
  cellGeneCounts: [
    [1, 0],
    [0, 2],
  ],
} satisfies Input;
export const exampleOutput = {
  nonzeroCount: 2,
  totalEntries: 4,
  sparsityPercent: 50,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  id: "transcriptomics/umi-matrix-sparsity",
  title: "UMI Matrix Sparsity",
  description: "Measure sparsity of a cell-by-gene UMI count matrix.",
  inputs: [{ id: "cellGeneCounts", kind: "matrix", label: "Cell gene counts" }],
  outputs: [
    { id: "nonzeroCount", kind: "number", label: "Nonzero count" },
    { id: "totalEntries", kind: "number", label: "Total entries" },
    { id: "sparsityPercent", kind: "number", label: "Sparsity percent" },
  ],
  calculate: (value) =>
    calculate({
      cellGeneCounts: value.cellGeneCounts as readonly (readonly number[])[],
    }),
});
export const run = tool.execute;
export default tool;

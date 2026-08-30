import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly cellCounts: readonly number[];
  readonly suppressionThreshold: number;
}>;
export type Output = Readonly<{
  readonly suppressedCellIndexes: readonly number[];
  readonly suppressedCellCount: number;
  readonly suppressedSharePercent: number;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.cellCounts.length === 0 ||
    input.cellCounts.some((value) => !Number.isSafeInteger(value) || value < 0)
  )
    simpleError(
      "cellCounts",
      "Cell counts must be nonnegative safe integers.",
      "invalid_counts",
    );
  const suppressedCellIndexes = input.cellCounts
    .map((value, index) => (value < input.suppressionThreshold ? index : -1))
    .filter((index) => index >= 0);
  return {
    suppressedCellIndexes,
    suppressedCellCount: suppressedCellIndexes.length,
    suppressedSharePercent:
      (suppressedCellIndexes.length / input.cellCounts.length) * 100,
  };
};

export const exampleInput = {
  cellCounts: [3, 10, 4, 20],
  suppressionThreshold: 5,
} satisfies Input;
export const exampleOutput = {
  suppressedCellIndexes: [0, 2],
  suppressedCellCount: 2,
  suppressedSharePercent: 50,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      cellCounts: input.cellCounts as readonly number[],
      suppressionThreshold: input.suppressionThreshold as number,
    }),
  description:
    "Identify crosstab cells below a caller-supplied suppression threshold.",
  id: "journalism/crosstab-suppression",
  inputs: [
    { id: "cellCounts", label: "Crosstab cell counts", kind: "numberList" },
    {
      id: "suppressionThreshold",
      label: "Suppress counts below",
      kind: "integer",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "suppressedCellIndexes",
      label: "Zero-based suppressed-cell indexes",
      kind: "numberList",
    },
    {
      id: "suppressedCellCount",
      label: "Suppressed cell count",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "suppressedSharePercent",
      label: "Suppressed-cell share",
      kind: "number",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
  ],
  title: "Crosstab Suppression",
});

export const run = tool.execute;
export default tool;

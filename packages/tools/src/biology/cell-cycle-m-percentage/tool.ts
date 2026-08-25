import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const cellCycleMPercentageExample = {
  input: { mPhaseCells: 45, totalCells: 900 },
} satisfies ToolExample<{
  readonly mPhaseCells: number;
  readonly totalCells: number;
}>;

export const cellCycleMPercentageTool = createSimpleTool({
  id: "biology/cell-cycle-m-percentage",
  title: "M Phase Percentage",
  description:
    "Compute the mitotic fraction of a cell population as a percentage of cells in M phase.",
  inputs: [
    { id: "mPhaseCells", label: "M phase cells", kind: "integer", minimum: 0 },
    { id: "totalCells", label: "Total cells", kind: "integer", minimum: 0 },
  ],
  outputs: [
    { id: "mPhasePercentage", label: "M phase", kind: "number", unit: "%" },
  ],
  calculate: (input) => {
    const mPhaseCells = input.mPhaseCells as number;
    const totalCells = input.totalCells as number;
    if (totalCells <= 0 || mPhaseCells > totalCells)
      simpleError(
        "totalCells",
        "Total must be positive and M phase cells must not exceed it.",
        "invalid_counts",
      );
    return { mPhasePercentage: (mPhaseCells / totalCells) * 100 };
  },
});
export const runCellCycleMPercentage = cellCycleMPercentageTool.execute;
export default cellCycleMPercentageTool;

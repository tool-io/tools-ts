import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const cellCycleG2PercentageExample = {
  input: { g2Cells: 160, totalCells: 800 },
} satisfies ToolExample<{
  readonly g2Cells: number;
  readonly totalCells: number;
}>;

export const cellCycleG2PercentageTool = createSimpleTool({
  id: "biology/cell-cycle-g2-percentage",
  title: "G2 Percentage",
  description:
    "Compute the percentage of cells in G2 phase from flow cytometry cell cycle counts.",
  inputs: [
    { id: "g2Cells", label: "G2 cells", kind: "integer", minimum: 0 },
    { id: "totalCells", label: "Total cells", kind: "integer", minimum: 0 },
  ],
  outputs: [{ id: "g2Percentage", label: "G2", kind: "number", unit: "%" }],
  calculate: (input) => {
    const g2Cells = input.g2Cells as number;
    const totalCells = input.totalCells as number;
    if (totalCells <= 0 || g2Cells > totalCells)
      simpleError(
        "totalCells",
        "Total must be positive and G2 cells must not exceed it.",
        "invalid_counts",
      );
    return { g2Percentage: (g2Cells / totalCells) * 100 };
  },
});
export const runCellCycleG2Percentage = cellCycleG2PercentageTool.execute;
export default cellCycleG2PercentageTool;

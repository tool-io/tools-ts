import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CellCycleG1PercentageInput = {
  readonly g1Cells: number;
  readonly totalCells: number;
};

export type CellCycleG1PercentageOutput = {
  readonly g1Percentage: number;
};

export const cellCycleG1PercentageExample = {
  input: { g1Cells: 400, totalCells: 1000 },
  output: { g1Percentage: 40 },
} satisfies ToolExample<
  CellCycleG1PercentageInput,
  CellCycleG1PercentageOutput
>;

export const cellCycleG1PercentageTool = createSimpleTool({
  id: "biology/cell-cycle-g1-percentage",
  title: "G1 Percentage",
  description:
    "Compute the percentage of cells in G1 phase relative to the total counted cell population.",
  inputs: [
    { id: "g1Cells", label: "G1 cells", kind: "integer", minimum: 0 },
    { id: "totalCells", label: "Total cells", kind: "integer", minimum: 0 },
  ],
  outputs: [
    { id: "g1Percentage", label: "G1 percentage", kind: "number", unit: "%" },
  ],
  calculate: (input) => {
    const g1Cells = input.g1Cells as number;
    const totalCells = input.totalCells as number;
    if (!(totalCells > 0) || g1Cells > totalCells)
      simpleError(
        "totalCells",
        "Counts are inconsistent: total must be positive and G1 cells cannot exceed it.",
        "invalid_counts",
      );
    return { g1Percentage: (g1Cells / totalCells) * 100 };
  },
});
export const runCellCycleG1Percentage = cellCycleG1PercentageTool.execute;
export default cellCycleG1PercentageTool;

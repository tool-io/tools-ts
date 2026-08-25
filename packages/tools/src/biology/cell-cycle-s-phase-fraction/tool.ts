import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CellCycleSPhaseFractionInput = {
  readonly sPhaseCells: number;
  readonly totalCells: number;
};

export type CellCycleSPhaseFractionOutput = {
  readonly sPhaseFraction: number;
};

export const cellCycleSPhaseFractionExample = {
  input: { sPhaseCells: 250, totalCells: 1000 },
  output: { sPhaseFraction: 0.25 },
} satisfies ToolExample<
  CellCycleSPhaseFractionInput,
  CellCycleSPhaseFractionOutput
>;

export const cellCycleSPhaseFractionTool = createSimpleTool({
  id: "biology/cell-cycle-s-phase-fraction",
  title: "S Phase Fraction",
  description:
    "Compute the fraction of cells in S phase relative to the total counted cell population.",
  inputs: [
    { id: "sPhaseCells", label: "S phase cells", kind: "integer", minimum: 0 },
    { id: "totalCells", label: "Total cells", kind: "integer", minimum: 0 },
  ],
  outputs: [
    { id: "sPhaseFraction", label: "S phase fraction", kind: "number" },
  ],
  calculate: (input) => {
    const sPhaseCells = input.sPhaseCells as number;
    const totalCells = input.totalCells as number;
    if (!(totalCells > 0) || sPhaseCells > totalCells)
      simpleError(
        "totalCells",
        "Counts are inconsistent: total must be positive and S phase cells cannot exceed it.",
        "invalid_counts",
      );
    return { sPhaseFraction: sPhaseCells / totalCells };
  },
});
export const runCellCycleSPhaseFraction = cellCycleSPhaseFractionTool.execute;
export default cellCycleSPhaseFractionTool;

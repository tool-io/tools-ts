import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const mitoticIndexPhaseExample = {
  input: { phasePositiveCells: 40, totalCells: 500 },
} satisfies ToolExample<{
  readonly phasePositiveCells: number;
  readonly totalCells: number;
}>;

export const mitoticIndexPhaseTool = createSimpleTool({
  id: "biology/mitotic-index-phase",
  title: "Phase Mitotic Fraction",
  description:
    "Compute the fraction of cells positive for a specific mitotic phase marker.",
  inputs: [
    {
      id: "phasePositiveCells",
      label: "Phase-positive cells",
      kind: "integer",
      minimum: 0,
    },
    { id: "totalCells", label: "Total cells", kind: "integer", minimum: 0 },
  ],
  outputs: [
    {
      id: "mitoticPhaseFraction",
      label: "Mitotic phase fraction",
      kind: "number",
    },
  ],
  calculate: (input) => {
    const phasePositiveCells = input.phasePositiveCells as number;
    const totalCells = input.totalCells as number;
    if (totalCells <= 0 || phasePositiveCells > totalCells)
      simpleError(
        "totalCells",
        "Total must be positive and positive cells must not exceed it.",
        "invalid_counts",
      );
    return { mitoticPhaseFraction: phasePositiveCells / totalCells };
  },
});
export const runMitoticIndexPhase = mitoticIndexPhaseTool.execute;
export default mitoticIndexPhaseTool;

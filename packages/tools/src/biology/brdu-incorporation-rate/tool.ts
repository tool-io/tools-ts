import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BrduIncorporationRateInput = {
  readonly brduPositiveCells: number;
  readonly totalCells: number;
};

export type BrduIncorporationRateOutput = {
  readonly incorporationRatePercent: number;
};

export const brduIncorporationRateExample = {
  input: { brduPositiveCells: 120, totalCells: 800 },
  output: { incorporationRatePercent: 15 },
} satisfies ToolExample<
  BrduIncorporationRateInput,
  BrduIncorporationRateOutput
>;

export const brduIncorporationRateTool = createSimpleTool({
  id: "biology/brdu-incorporation-rate",
  title: "BrdU Incorporation Rate",
  description:
    "Compute the percentage of BrdU positive cells relative to the total counted cell population.",
  inputs: [
    {
      id: "brduPositiveCells",
      label: "BrdU positive cells",
      kind: "integer",
      minimum: 0,
    },
    { id: "totalCells", label: "Total cells", kind: "integer", minimum: 0 },
  ],
  outputs: [
    {
      id: "incorporationRatePercent",
      label: "Incorporation rate",
      kind: "number",
      unit: "%",
    },
  ],
  calculate: (input) => {
    const brduPositiveCells = input.brduPositiveCells as number;
    const totalCells = input.totalCells as number;
    if (!(totalCells > 0) || brduPositiveCells > totalCells)
      simpleError(
        "totalCells",
        "Counts are inconsistent: total must be positive and BrdU positive cells cannot exceed it.",
        "invalid_counts",
      );
    return { incorporationRatePercent: (brduPositiveCells / totalCells) * 100 };
  },
});
export const runBrduIncorporationRate = brduIncorporationRateTool.execute;
export default brduIncorporationRateTool;

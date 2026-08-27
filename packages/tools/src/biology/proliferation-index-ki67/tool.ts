import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const proliferationIndexKi67Example = {
  input: { ki67PositiveCells: 220, totalCells: 800 },
} satisfies ToolExample<{
  readonly ki67PositiveCells: number;
  readonly totalCells: number;
}>;

export const proliferationIndexKi67Tool = createSimpleTool({
  id: "biology/proliferation-index-ki67",
  title: "Ki67 Proliferation Index",
  description:
    "Compute the Ki67 proliferation index as the percentage of Ki67-positive cells.",
  inputs: [
    {
      id: "ki67PositiveCells",
      label: "Ki67-positive cells",
      kind: "integer",
      minimum: 0,
    },
    { id: "totalCells", label: "Total cells", kind: "integer", minimum: 0 },
  ],
  outputs: [
    { id: "ki67IndexPercent", label: "Ki67 index", kind: "number", unit: "%" },
  ],
  calculate: (input) => {
    const ki67PositiveCells = input.ki67PositiveCells as number;
    const totalCells = input.totalCells as number;
    if (totalCells <= 0 || ki67PositiveCells > totalCells)
      simpleError(
        "totalCells",
        "Total must be positive and Ki67-positive cells must not exceed it.",
        "invalid_counts",
      );
    return { ki67IndexPercent: (ki67PositiveCells / totalCells) * 100 };
  },
});
export const runProliferationIndexKi67 = proliferationIndexKi67Tool.execute;
export default proliferationIndexKi67Tool;

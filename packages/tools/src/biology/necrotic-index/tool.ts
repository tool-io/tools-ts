import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const necroticIndexExample = {
  input: { necroticCells: 60, totalCells: 600 },
} satisfies ToolExample<{
  readonly necroticCells: number;
  readonly totalCells: number;
}>;

export const necroticIndexTool = createSimpleTool({
  id: "biology/necrotic-index",
  title: "Necrotic Index",
  description:
    "Compute the percentage of necrotic cells in a counted cell population.",
  inputs: [
    {
      id: "necroticCells",
      label: "Necrotic cells",
      kind: "integer",
      minimum: 0,
    },
    { id: "totalCells", label: "Total cells", kind: "integer", minimum: 0 },
  ],
  outputs: [
    {
      id: "necroticIndexPercent",
      label: "Necrotic index",
      kind: "number",
      unit: "%",
    },
  ],
  calculate: (input) => {
    const necroticCells = input.necroticCells as number;
    const totalCells = input.totalCells as number;
    if (totalCells <= 0 || necroticCells > totalCells)
      simpleError(
        "totalCells",
        "Total must be positive and necrotic cells must not exceed it.",
        "invalid_counts",
      );
    return { necroticIndexPercent: (necroticCells / totalCells) * 100 };
  },
});
export const runNecroticIndex = necroticIndexTool.execute;
export default necroticIndexTool;

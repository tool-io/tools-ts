import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const mitoticIndexExample = {
  input: { cellsInMitosis: 24, totalCells: 200 },
} satisfies ToolExample<{
  readonly cellsInMitosis: number;
  readonly totalCells: number;
}>;

export const mitoticIndexTool = createSimpleTool({
  id: "biology/mitotic-index",
  title: "Mitotic Index %",
  description:
    "Calculate the mitotic index as the percentage of counted cells in mitosis.",
  inputs: [
    { id: "cellsInMitosis", label: "Cells in mitosis", kind: "number" },
    { id: "totalCells", label: "Total cells", kind: "number" },
  ],
  outputs: [
    {
      id: "mitoticIndexPercent",
      label: "Mitotic index",
      kind: "number",
      unit: "%",
    },
  ],
  calculate: (input) => {
    const cellsInMitosis = input.cellsInMitosis as number;
    const totalCells = input.totalCells as number;
    if (totalCells <= 0 || cellsInMitosis < 0 || cellsInMitosis > totalCells)
      simpleError(
        "totalCells",
        "Total must be positive and mitotic count must not exceed it.",
        "invalid_counts",
      );
    return { mitoticIndexPercent: (cellsInMitosis / totalCells) * 100 };
  },
});
export const runMitoticIndex = mitoticIndexTool.execute;
export default mitoticIndexTool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const offcutInventoryExample = {
  input: { pieceLengthsMm: [1850, 1240, 620] },
  output: { pieceCount: 3, totalLengthMm: 3710 },
} satisfies ToolExample<
  { readonly pieceLengthsMm: readonly number[] },
  { readonly pieceCount: number; readonly totalLengthMm: number }
>;

export const offcutInventoryTool = createSimpleTool({
  id: "carpentry/reststuecke-verwaltung-lager",
  title: "Offcut Inventory Summary",
  description:
    "Summarize stored offcut pieces by count and total length in millimeters.",
  inputs: [
    {
      id: "pieceLengthsMm",
      kind: "numberList",
      label: "Piece lengths",
      unit: "mm",
    },
  ],
  outputs: [
    { id: "pieceCount", kind: "integer", label: "Piece count" },
    { id: "totalLengthMm", kind: "number", label: "Total length", unit: "mm" },
  ],
  calculate: (input) => {
    const pieceLengthsMm = input.pieceLengthsMm as number[];
    if (pieceLengthsMm.length === 0)
      simpleError(
        "pieceLengthsMm",
        "Enter at least one piece length.",
        "empty_pieces",
      );
    return {
      pieceCount: pieceLengthsMm.length,
      totalLengthMm: pieceLengthsMm.reduce((sum, piece) => sum + piece, 0),
    };
  },
});
export const runOffcutInventory = offcutInventoryTool.execute;
export default offcutInventoryTool;

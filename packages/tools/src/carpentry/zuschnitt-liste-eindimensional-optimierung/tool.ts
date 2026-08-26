import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const cutList1dExample = {
  input: {
    pieceLengthsMm: [600, 1200, 1800, 600],
    stockLengthMm: 2400,
  },
  output: { barsUsed: 2, totalWasteMm: 600 },
} satisfies ToolExample<
  {
    readonly pieceLengthsMm: readonly number[];
    readonly stockLengthMm: number;
  },
  { readonly barsUsed: number; readonly totalWasteMm: number }
>;

export const cutList1dTool = createSimpleTool({
  id: "carpentry/zuschnitt-liste-eindimensional-optimierung",
  title: "1D Cut List Optimizer",
  description:
    "Pack cut pieces into the fewest stock bars using greedy first-fit-decreasing and report total waste.",
  inputs: [
    { id: "stockLengthMm", kind: "number", label: "Stock length", unit: "mm" },
    {
      id: "pieceLengthsMm",
      kind: "numberList",
      label: "Piece lengths",
      unit: "mm",
    },
  ],
  outputs: [
    { id: "barsUsed", kind: "integer", label: "Bars used" },
    { id: "totalWasteMm", kind: "number", label: "Total waste", unit: "mm" },
  ],
  calculate: (input) => {
    const stockLengthMm = input.stockLengthMm as number;
    const pieceLengthsMm = input.pieceLengthsMm as number[];
    if (!(stockLengthMm > 0))
      simpleError(
        "stockLengthMm",
        "Stock length must be positive.",
        "invalid_stock_length",
      );
    if (pieceLengthsMm.length === 0)
      simpleError(
        "pieceLengthsMm",
        "Enter at least one piece length.",
        "empty_pieces",
      );
    for (const piece of pieceLengthsMm)
      if (piece <= 0)
        simpleError(
          "pieceLengthsMm",
          "Piece lengths must be positive.",
          "invalid_piece_length",
        );
      else if (piece > stockLengthMm)
        simpleError(
          "pieceLengthsMm",
          "piece longer than stock",
          "piece_too_long",
        );
    const remainders: number[] = [];
    for (const piece of [...pieceLengthsMm].sort((a, b) => b - a)) {
      let placed = false;
      for (let index = 0; index < remainders.length; index += 1)
        if (remainders[index] >= piece) {
          remainders[index] -= piece;
          placed = true;
          break;
        }
      if (!placed) remainders.push(stockLengthMm - piece);
    }
    return {
      barsUsed: remainders.length,
      totalWasteMm: remainders.reduce((sum, remainder) => sum + remainder, 0),
    };
  },
});
export const runCutList1d = cutList1dTool.execute;
export default cutList1dTool;

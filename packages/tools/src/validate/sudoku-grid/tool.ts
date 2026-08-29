import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const example = {
  input: {
    grid: [
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
    ],
  },
  output: { valid: true, complete: false },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;
export const tool = createSimpleTool({
  id: "validate/sudoku-grid",
  title: "Sudoku Grid Validator",
  description:
    "Check that a 9×9 Sudoku grid uses digits 0–9 and has no repeated nonzero value in any row, column, or 3×3 box. Zero represents an empty cell.",
  inputs: [{ id: "grid", kind: "matrix", label: "grid" }],
  outputs: [
    { id: "valid", kind: "boolean", label: "valid" },
    { id: "complete", kind: "boolean", label: "complete" },
  ],
  calculate: (input) => {
    const grid = input.grid as number[][];
    if (
      grid.length !== 9 ||
      grid.some(
        (row) =>
          row.length !== 9 ||
          row.some((v) => !Number.isInteger(v) || v < 0 || v > 9),
      )
    )
      simpleError("grid", "Grid must be 9×9 with digits 0–9.");
    const unique = (items: number[]) => {
      const nonzero = items.filter((v) => v !== 0);
      return new Set(nonzero).size === nonzero.length;
    };
    let valid = true;
    for (let i = 0; i < 9; i++) {
      valid &&= unique(grid[i]!);
      valid &&= unique(grid.map((row) => row[i]!));
      const br = Math.floor(i / 3) * 3,
        bc = (i % 3) * 3;
      valid &&= unique(
        [0, 1, 2].flatMap((dr) =>
          [0, 1, 2].map((dc) => grid[br + dr]![bc + dc]!),
        ),
      );
    }
    return {
      valid,
      complete: valid && grid.every((row) => row.every((v) => v !== 0)),
    };
  },
});
export type SudokuGridInput = Readonly<typeof example.input>;
export type SudokuGridOutput = Readonly<typeof example.output>;
export const sudokuGridTool = tool;
export const runSudokuGrid = tool.execute;
export default tool;

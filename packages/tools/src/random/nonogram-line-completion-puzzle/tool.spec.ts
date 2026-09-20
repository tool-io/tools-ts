import { describe, expect, it } from "vitest";
import tool, {
  example,
  calculateNonogramLineCompletionPuzzle as calculate,
} from "./index.js";
import { puzzleContractSpecs } from "../m250-puzzles-logic-spec-support.js";
describe(tool.id, () => {
  puzzleContractSpecs(tool, example, calculate);
  it("proves ambiguity by enumerating all three placements of one filled cell", () => {
    const draws = [0.9, 0.1, 0.1];
    let draw = 0;
    const result = calculate(
      { length: 3, hiddenCount: 3 },
      { random: () => draws[draw++] ?? 0 },
    );
    expect(result).toMatchObject({
      ok: true,
      output: {
        puzzle: { clues: [1], cells: [null, null, null] },
        answer: {
          solution: [1, 0, 0],
          completionCount: 3,
          unique: false,
          forcedCells: [null, null, null],
        },
      },
    });
  });
  it("independently counts complete solutions with a string/run reference", () => {
    for (let seed = 0; seed < 8; seed += 1) {
      const result = calculate({ length: 7, hiddenCount: 5, seed });
      if (!result.ok) throw new Error("Expected generated line");
      const { puzzle, answer } = result.output;
      const matches = Array.from({ length: 128 }, (_, index) =>
        index.toString(2).padStart(7, "0"),
      ).filter((line) => {
        const clues = (line.match(/1+/g) ?? []).map((run) => run.length);
        return (
          JSON.stringify(clues) === JSON.stringify(puzzle.clues) &&
          [...line].every(
            (cell, i) =>
              puzzle.cells[i] === null || puzzle.cells[i] === Number(cell),
          )
        );
      });
      expect(answer.completionCount).toBe(matches.length);
      expect(answer.unique).toBe(matches.length === 1);
      expect(puzzle.cells.filter((cell) => cell === null)).toHaveLength(5);
      for (let i = 0; i < 7; i += 1)
        expect(answer.forcedCells[i]).toBe(
          matches.every((line) => line[i] === matches[0][i])
            ? Number(matches[0][i])
            : null,
        );
    }
  });
  it("handles the empty clue and rejects requests outside the exhaustive search domain", () => {
    expect(
      calculate({ length: 4, hiddenCount: 4 }, { random: () => 0 }),
    ).toMatchObject({
      ok: true,
      output: {
        puzzle: { clues: [] },
        answer: { completionCount: 1, solution: [0, 0, 0, 0] },
      },
    });
    expect(calculate({ length: 2, hiddenCount: 3 })).toMatchObject({
      ok: false,
      error: {
        issues: [{ field: "hiddenCount", code: "infeasible_hidden_count" }],
      },
    });
    expect(tool.execute({ length: 17, hiddenCount: 1 })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "length", code: "invalid_field" }] },
    });
  });
});

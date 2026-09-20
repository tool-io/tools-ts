import { describe, expect, it } from "vitest";
import tool, {
  example,
  calculateKakuroRunCompletionExercise as calculate,
} from "./index.js";
import { puzzleContractSpecs } from "../m250-puzzles-logic-spec-support.js";
describe(tool.id, () => {
  puzzleContractSpecs(tool, example, calculate);
  it("retains all four ordered solutions of the independently known 19-sum partial run", () => {
    const result = calculate(example.input);
    if (!result.ok) throw new Error("Expected Kakuro exercise");
    expect(result.output.answer.remainingDigitSets).toEqual([
      [6, 9],
      [7, 8],
    ]);
    expect(result.output.answer.orderedCompletionCount).toBe(4);
    expect(
      [
        [6, 4, 9],
        [9, 4, 6],
        [7, 4, 8],
        [8, 4, 7],
      ].map((digits) => digits.reduce((a, b) => a + b, 0)),
    ).toEqual([19, 19, 19, 19]);
  });
  it("supports all nine digits and distinguishes unordered from ordered completions", () => {
    const result = calculate({ length: 9, hiddenCount: 9, seed: 42 });
    expect(result).toMatchObject({
      ok: true,
      output: {
        puzzle: { targetSum: 45, cells: [0, 0, 0, 0, 0, 0, 0, 0, 0] },
        answer: {
          remainingDigitSets: [[1, 2, 3, 4, 5, 6, 7, 8, 9]],
          unorderedSetCount: 1,
          orderedCompletionCount: 362880,
        },
      },
    });
    const complete = calculate({ length: 3, hiddenCount: 0, seed: 42 });
    expect(complete).toMatchObject({
      ok: true,
      output: {
        puzzle: { cells: [6, 4, 9] },
        answer: { remainingDigitSets: [[]], orderedCompletionCount: 1 },
      },
    });
  });
  it("conserves sums, excludes known digits, and rejects impossible hiding or oversized runs", () => {
    for (let seed = 0; seed < 8; seed += 1) {
      const result = calculate({ length: 5, hiddenCount: 3, seed });
      if (!result.ok) throw new Error("Expected run");
      const { puzzle, answer } = result.output;
      expect(new Set(answer.solution).size).toBe(5);
      for (const digits of answer.remainingDigitSets) {
        expect(digits).toHaveLength(3);
        expect(new Set(digits).size).toBe(3);
        expect(digits.every((digit) => !puzzle.cells.includes(digit))).toBe(
          true,
        );
        expect([...digits, ...puzzle.cells].reduce((a, b) => a + b, 0)).toBe(
          puzzle.targetSum,
        );
      }
    }
    expect(calculate({ length: 2, hiddenCount: 3 })).toMatchObject({
      ok: false,
      error: { issues: [{ code: "infeasible_hidden_count" }] },
    });
    expect(tool.execute({ length: 10, hiddenCount: 1 })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "length", code: "invalid_field" }] },
    });
  });
});

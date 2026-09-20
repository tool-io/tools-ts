import { describe, expect, it } from "vitest";
import tool, {
  example,
  calculateBooleanEquivalenceQuiz as calculate,
} from "./index.js";
import { puzzleContractSpecs } from "../m250-puzzles-logic-spec-support.js";
describe(tool.id, () => {
  puzzleContractSpecs(tool, example, calculate);
  it("uses complete false-first valuations and exactly the requested mismatches", () => {
    for (const variableCount of [0, 1, 4])
      for (const mismatchCount of [0, 1, 2 ** variableCount]) {
        const result = calculate({
          variableCount,
          mismatchCount,
          count: 5,
          seed: 3,
        });
        if (!result.ok) throw new Error("Expected complete columns");
        expect(result.output.valuations).toHaveLength(2 ** variableCount);
        expect(
          new Set(result.output.valuations.map((row) => row.join(","))).size,
        ).toBe(2 ** variableCount);
        expect(result.output.valuations[0]).toEqual(
          Array(variableCount).fill(false),
        );
        expect(
          result.output.valuations[result.output.valuations.length - 1],
        ).toEqual(Array(variableCount).fill(true));
        for (const question of result.output.questions) {
          const different = question.left.flatMap((value, row) =>
            value !== question.right[row] ? [row] : [],
          );
          expect(different).toEqual(question.mismatchRows);
          expect(different).toHaveLength(mismatchCount);
          expect(question.equivalent).toBe(mismatchCount === 0);
        }
      }
  });
  it("supports a zero-variable constant table and rejects impossible changes or excess rows", () => {
    expect(
      calculate({ variableCount: 0, mismatchCount: 1, count: 1, seed: 42 }),
    ).toMatchObject({
      ok: true,
      output: {
        valuations: [[]],
        questions: [
          {
            left: [true],
            right: [false],
            equivalent: false,
            mismatchRows: [0],
          },
        ],
      },
    });
    expect(
      calculate({ variableCount: 1, mismatchCount: 3, count: 1 }),
    ).toMatchObject({
      ok: false,
      error: {
        issues: [{ field: "mismatchCount", code: "infeasible_mismatch_count" }],
      },
    });
    expect(tool.execute({ ...example.input, variableCount: 9 })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "variableCount", code: "invalid_field" }] },
    });
  });
});

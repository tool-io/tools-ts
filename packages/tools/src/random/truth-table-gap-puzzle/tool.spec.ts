import { describe, expect, it } from "vitest";
import tool, {
  example,
  calculateTruthTableGapPuzzle as calculate,
} from "./index.js";
import { puzzleContractSpecs } from "../m250-puzzles-logic-spec-support.js";
describe(tool.id, () => {
  puzzleContractSpecs(tool, example, calculate);
  it("preserves every supplied answer value, hides exactly the requested rows, and classifies each column", () => {
    const columns = [
      [true, true, true, true],
      [false, false, false, false],
      [false, false, false, true],
    ] as const;
    const classifications = [
      "tautology",
      "contradiction",
      "contingency",
    ] as const;
    for (let i = 0; i < columns.length; i += 1) {
      const result = calculate({
        ...example.input,
        pairs: [{ formula: "Caller-provided label", values: columns[i] }],
        count: 2,
      });
      if (!result.ok) throw new Error("Expected gap puzzle");
      for (const row of result.output.cases) {
        expect(row.answer.values).toEqual(columns[i]);
        expect(row.answer.classification).toBe(classifications[i]);
        expect(row.puzzle.cells.filter((cell) => cell === null)).toHaveLength(
          2,
        );
        for (let j = 0; j < row.puzzle.cells.length; j += 1)
          if (row.puzzle.cells[j] !== null)
            expect(row.puzzle.cells[j]).toBe(columns[i][j]);
      }
    }
  });
  it("treats formula/table agreement as caller-provided rather than claiming a nonexistent evaluator", () => {
    expect(
      calculate({
        ...example.input,
        variables: ["p"],
        pairs: [{ formula: "p && !p", values: [true, true] }],
        hiddenCount: 0,
      }),
    ).toMatchObject({
      ok: true,
      output: {
        cases: [
          {
            puzzle: { formula: "p && !p", cells: [true, true] },
            answer: {
              values: [true, true],
              classification: "tautology",
              tautology: true,
              contradiction: false,
            },
          },
        ],
      },
    });
    expect(
      calculate({
        ...example.input,
        variables: [],
        pairs: [{ formula: "false", values: [false] }],
        hiddenCount: 1,
      }),
    ).toMatchObject({
      ok: true,
      output: {
        valuations: [[]],
        cases: [
          {
            puzzle: { cells: [null] },
            answer: { classification: "contradiction" },
          },
        ],
      },
    });
  });
  it("rejects missing rows, impossible hiding, duplicate identifiers, trailing newlines, and resource excess", () => {
    expect(
      calculate({
        ...example.input,
        pairs: [{ formula: "p", values: [false, true] }],
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "pairs", code: "incomplete_table" }] },
    });
    expect(calculate({ ...example.input, hiddenCount: 5 })).toMatchObject({
      ok: false,
      error: {
        issues: [{ field: "hiddenCount", code: "infeasible_hidden_count" }],
      },
    });
    expect(
      calculate({ ...example.input, variables: ["p", "p"] }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "variables", code: "duplicate_entry" }] },
    });
    for (const variable of ["p\n", "p\r\n", "true", "p-atom"])
      expect(
        tool.execute({ ...example.input, variables: [variable] }),
      ).toMatchObject({
        ok: false,
        error: { issues: [{ field: "variables", code: "invalid_field" }] },
      });
    expect(tool.execute({ ...example.input, count: 33 })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "count", code: "invalid_field" }] },
    });
    expect(
      tool.execute({ ...example.input, callerVerified: false }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "callerVerified", code: "invalid_field" }] },
    });
  });
});

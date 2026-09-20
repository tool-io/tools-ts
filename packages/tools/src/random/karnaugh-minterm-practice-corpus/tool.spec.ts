import { describe, expect, it } from "vitest";
import tool, {
  example,
  calculateKarnaughMintermPracticeCorpus as calculate,
} from "./index.js";
import { puzzleContractSpecs } from "../m250-puzzles-logic-spec-support.js";
describe(tool.id, () => {
  puzzleContractSpecs(tool, example, calculate);
  it("handles the zero-variable constant and the largest bounded all-ones minterm", () => {
    expect(
      calculate({
        minimumVariables: 0,
        maximumVariables: 0,
        count: 1,
        seed: 42,
      }),
    ).toMatchObject({
      ok: true,
      output: {
        cases: [
          {
            variables: [],
            index: 0,
            bits: "",
            minterm: "true",
            grid: {
              cellCount: 1,
              rowCount: 1,
              columnCount: 1,
              rowVariables: 0,
              columnVariables: 0,
            },
          },
        ],
      },
    });
    expect(
      calculate(
        { minimumVariables: 12, maximumVariables: 12, count: 1 },
        { random: () => 0.99999 },
      ),
    ).toMatchObject({
      ok: true,
      output: {
        cases: [
          {
            index: 4095,
            bits: "111111111111",
            minterm:
              "x1 && x2 && x3 && x4 && x5 && x6 && x7 && x8 && x9 && x10 && x11 && x12",
            grid: {
              cellCount: 4096,
              rowCount: 64,
              columnCount: 64,
              rowVariables: 6,
              columnVariables: 6,
            },
          },
        ],
      },
    });
  });
  it("independently reconstructs indices and checks balanced grid dimensions", () => {
    const result = calculate({
      minimumVariables: 0,
      maximumVariables: 12,
      count: 64,
      seed: 13,
    });
    if (!result.ok) throw new Error("Expected corpus");
    for (const row of result.output.cases) {
      expect(row.bits.length).toBe(row.variables.length);
      expect(row.bits === "" ? 0 : Number.parseInt(row.bits, 2)).toBe(
        row.index,
      );
      expect(row.grid.rowCount * row.grid.columnCount).toBe(row.grid.cellCount);
      expect(row.grid.cellCount).toBe(2 ** row.variables.length);
      expect([row.grid.rowCount, row.grid.rowCount * 2]).toContain(
        row.grid.columnCount,
      );
      const literals = row.minterm === "true" ? [] : row.minterm.split(" && ");
      expect(
        literals
          .map((literal) => (literal.startsWith("!") ? "0" : "1"))
          .join(""),
      ).toBe(row.bits);
    }
  });
  it("rejects reversed variable bounds and resource excess", () => {
    expect(
      calculate({ minimumVariables: 5, maximumVariables: 4, count: 1 }),
    ).toMatchObject({
      ok: false,
      error: {
        issues: [{ field: "maximumVariables", code: "invalid_variable_range" }],
      },
    });
    expect(
      tool.execute({ ...example.input, maximumVariables: 13 }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "maximumVariables", code: "invalid_field" }] },
    });
  });
});

import { describe, expect, it } from "vitest";
import tool, {
  example,
  calculateVennRegionIdentificationPuzzle as calculate,
} from "./index.js";
import { puzzleContractSpecs } from "../m250-puzzles-logic-spec-support.js";
describe(tool.id, () => {
  puzzleContractSpecs(tool, example, calculate);
  it("maps all eight ternary membership cases independently in MSB order", () => {
    const draws = [
      0, 0, 0, 0, 0, 0.9, 0, 0.9, 0, 0, 0.9, 0.9, 0.9, 0, 0, 0.9, 0, 0.9, 0.9,
      0.9, 0, 0.9, 0.9, 0.9,
    ];
    let i = 0;
    const result = calculate(
      { setCount: 3, count: 8 },
      { random: () => draws[i++] ?? 0 },
    );
    if (!result.ok) throw new Error("Expected Venn cases");
    expect(result.output.cases.map((row) => row.regionIndex)).toEqual([
      0, 1, 2, 3, 4, 5, 6, 7,
    ]);
    expect(result.output.cases.map((row) => row.region)).toEqual([
      "000",
      "001",
      "010",
      "011",
      "100",
      "101",
      "110",
      "111",
    ]);
    expect(result.output.cases.map((row) => row.memberOf)).toEqual([
      [],
      ["C"],
      ["B"],
      ["B", "C"],
      ["A"],
      ["A", "C"],
      ["A", "B"],
      ["A", "B", "C"],
    ]);
    expect(i).toBe(24);
  });
  it("maps the outside of two sets and rejects unsupported dimensions and oversized quizzes", () => {
    expect(
      calculate({ setCount: 2, count: 1 }, { random: () => 0 }),
    ).toMatchObject({
      ok: true,
      output: {
        cases: [
          {
            memberships: [false, false],
            regionIndex: 0,
            region: "outside",
            memberOf: [],
          },
        ],
      },
    });
    expect(tool.execute({ setCount: 4, count: 1 })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "setCount", code: "invalid_field" }] },
    });
    expect(tool.execute({ setCount: 3, count: 65 })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "count", code: "invalid_field" }] },
    });
  });
});

import { describe, expect, it } from "vitest";
import { runCellCycleG2Percentage } from "./tool.js";

describe("G2 Percentage", () => {
  it("calculates a valid result", () =>
    expect(runCellCycleG2Percentage({ g2Cells: 160, totalCells: 800 })).toEqual(
      {
        ok: true,
        output: { g2Percentage: 20 },
      },
    ));
  it("returns zero with no G2 cells", () =>
    expect(runCellCycleG2Percentage({ g2Cells: 0, totalCells: 700 })).toEqual({
      ok: true,
      output: { g2Percentage: 0 },
    }));
  it("returns one hundred when all cells are in G2", () =>
    expect(runCellCycleG2Percentage({ g2Cells: 120, totalCells: 120 })).toEqual(
      {
        ok: true,
        output: { g2Percentage: 100 },
      },
    ));
  it("rejects counts exceeding the total", () => {
    const result = runCellCycleG2Percentage({ g2Cells: 121, totalCells: 120 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_counts");
  });
  it("rejects a zero total", () => {
    const result = runCellCycleG2Percentage({ g2Cells: 16, totalCells: 0 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_counts");
  });
  it("rejects fractional counts", () =>
    expect(runCellCycleG2Percentage({ g2Cells: 1.6, totalCells: 8 }).ok).toBe(
      false,
    ));
});

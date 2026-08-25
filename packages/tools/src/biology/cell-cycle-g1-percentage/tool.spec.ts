import { describe, expect, it } from "vitest";
import { runCellCycleG1Percentage } from "./tool.js";

describe("G1 Percentage", () => {
  it("computes forty percent of the population", () =>
    expect(
      runCellCycleG1Percentage({ g1Cells: 400, totalCells: 1000 }),
    ).toEqual({ ok: true, output: { g1Percentage: 40 } }));
  it("computes zero for no G1 cells", () =>
    expect(runCellCycleG1Percentage({ g1Cells: 0, totalCells: 250 })).toEqual({
      ok: true,
      output: { g1Percentage: 0 },
    }));
  it("computes one hundred percent when all cells are in G1", () =>
    expect(runCellCycleG1Percentage({ g1Cells: 320, totalCells: 320 })).toEqual(
      { ok: true, output: { g1Percentage: 100 } },
    ));
  it("handles small cohorts", () =>
    expect(runCellCycleG1Percentage({ g1Cells: 1, totalCells: 8 })).toEqual({
      ok: true,
      output: { g1Percentage: 12.5 },
    }));
  it("reports non terminating percentages exactly", () =>
    expect(runCellCycleG1Percentage({ g1Cells: 1, totalCells: 3 })).toEqual({
      ok: true,
      output: { g1Percentage: 33.33333333333333 },
    }));
  it("rejects a zero total", () => {
    const result = runCellCycleG1Percentage({ g1Cells: 5, totalCells: 0 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_counts");
  });
  it("rejects G1 cells exceeding the total", () => {
    const result = runCellCycleG1Percentage({ g1Cells: 60, totalCells: 30 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_counts");
  });
});

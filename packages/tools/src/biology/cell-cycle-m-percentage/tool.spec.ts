import { describe, expect, it } from "vitest";
import { runCellCycleMPercentage } from "./tool.js";

describe("M Phase Percentage", () => {
  it("calculates a valid result", () =>
    expect(
      runCellCycleMPercentage({ mPhaseCells: 45, totalCells: 900 }),
    ).toEqual({
      ok: true,
      output: { mPhasePercentage: 5 },
    }));
  it("returns zero with no M phase cells", () =>
    expect(
      runCellCycleMPercentage({ mPhaseCells: 0, totalCells: 600 }),
    ).toEqual({
      ok: true,
      output: { mPhasePercentage: 0 },
    }));
  it("returns one hundred when all cells are in M phase", () =>
    expect(
      runCellCycleMPercentage({ mPhaseCells: 60, totalCells: 60 }),
    ).toEqual({
      ok: true,
      output: { mPhasePercentage: 100 },
    }));
  it("rejects counts exceeding the total", () => {
    const result = runCellCycleMPercentage({
      mPhaseCells: 61,
      totalCells: 60,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_counts");
  });
  it("rejects a zero total", () => {
    const result = runCellCycleMPercentage({
      mPhaseCells: 45,
      totalCells: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_counts");
  });
  it("rejects negative counts", () =>
    expect(
      runCellCycleMPercentage({ mPhaseCells: -45, totalCells: 900 }).ok,
    ).toBe(false));
});

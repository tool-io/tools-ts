import { describe, expect, it } from "vitest";
import { runProliferationIndexKi67 } from "./tool.js";

describe("Ki67 Proliferation Index", () => {
  it("calculates a valid result", () =>
    expect(
      runProliferationIndexKi67({ ki67PositiveCells: 220, totalCells: 800 }),
    ).toEqual({
      ok: true,
      output: { ki67IndexPercent: 27.500000000000004 },
    }));
  it("returns zero with no Ki67-positive cells", () =>
    expect(
      runProliferationIndexKi67({ ki67PositiveCells: 0, totalCells: 400 }),
    ).toEqual({
      ok: true,
      output: { ki67IndexPercent: 0 },
    }));
  it("returns one hundred when all cells are positive", () =>
    expect(
      runProliferationIndexKi67({ ki67PositiveCells: 500, totalCells: 500 }),
    ).toEqual({
      ok: true,
      output: { ki67IndexPercent: 100 },
    }));
  it("rejects counts exceeding the total", () => {
    const result = runProliferationIndexKi67({
      ki67PositiveCells: 501,
      totalCells: 500,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_counts");
  });
  it("rejects a zero total", () => {
    const result = runProliferationIndexKi67({
      ki67PositiveCells: 10,
      totalCells: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_counts");
  });
  it("rejects fractional counts", () =>
    expect(
      runProliferationIndexKi67({
        ki67PositiveCells: 2.2,
        totalCells: 8,
      }).ok,
    ).toBe(false));
});

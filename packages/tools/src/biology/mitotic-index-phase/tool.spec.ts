import { describe, expect, it } from "vitest";
import { runMitoticIndexPhase } from "./tool.js";

describe("Phase Mitotic Fraction", () => {
  it("calculates a valid result", () =>
    expect(
      runMitoticIndexPhase({ phasePositiveCells: 40, totalCells: 500 }),
    ).toEqual({
      ok: true,
      output: { mitoticPhaseFraction: 0.08 },
    }));
  it("returns zero with no positive cells", () =>
    expect(
      runMitoticIndexPhase({ phasePositiveCells: 0, totalCells: 90 }),
    ).toEqual({
      ok: true,
      output: { mitoticPhaseFraction: 0 },
    }));
  it("returns one when all cells are positive", () =>
    expect(
      runMitoticIndexPhase({ phasePositiveCells: 40, totalCells: 40 }),
    ).toEqual({
      ok: true,
      output: { mitoticPhaseFraction: 1 },
    }));
  it("rejects counts exceeding the total", () => {
    const result = runMitoticIndexPhase({
      phasePositiveCells: 41,
      totalCells: 40,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_counts");
  });
  it("rejects a zero total", () => {
    const result = runMitoticIndexPhase({
      phasePositiveCells: 1,
      totalCells: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_counts");
  });
  it("rejects fractional counts", () =>
    expect(
      runMitoticIndexPhase({ phasePositiveCells: 1.5, totalCells: 10 }).ok,
    ).toBe(false));
  it("rejects negative counts", () =>
    expect(
      runMitoticIndexPhase({ phasePositiveCells: -5, totalCells: 50 }).ok,
    ).toBe(false));
});

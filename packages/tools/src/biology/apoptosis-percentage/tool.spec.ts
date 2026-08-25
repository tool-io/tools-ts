import { describe, expect, it } from "vitest";
import { runApoptosisPercentage } from "./tool.js";

describe("Apoptosis %", () => {
  it("calculates a valid result", () =>
    expect(
      runApoptosisPercentage({ apoptoticCells: 75, totalCells: 500 }),
    ).toEqual({
      ok: true,
      output: { apoptosisPercent: 15 },
    }));
  it("returns zero with no apoptotic cells", () =>
    expect(
      runApoptosisPercentage({ apoptoticCells: 0, totalCells: 90 }),
    ).toEqual({
      ok: true,
      output: { apoptosisPercent: 0 },
    }));
  it("returns one hundred when all cells are apoptotic", () =>
    expect(
      runApoptosisPercentage({ apoptoticCells: 40, totalCells: 40 }),
    ).toEqual({
      ok: true,
      output: { apoptosisPercent: 100 },
    }));
  it("rejects counts exceeding the total", () => {
    const result = runApoptosisPercentage({
      apoptoticCells: 41,
      totalCells: 40,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_counts");
  });
  it("rejects a zero total", () => {
    const result = runApoptosisPercentage({ apoptoticCells: 1, totalCells: 0 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_counts");
  });
  it("rejects negative apoptotic counts", () =>
    expect(
      runApoptosisPercentage({ apoptoticCells: -5, totalCells: 50 }).ok,
    ).toBe(false));
});

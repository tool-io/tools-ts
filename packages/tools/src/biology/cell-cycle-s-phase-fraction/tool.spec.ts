import { describe, expect, it } from "vitest";
import { runCellCycleSPhaseFraction } from "./tool.js";

describe("S Phase Fraction", () => {
  it("computes a quarter of the population", () =>
    expect(
      runCellCycleSPhaseFraction({ sPhaseCells: 250, totalCells: 1000 }),
    ).toEqual({ ok: true, output: { sPhaseFraction: 0.25 } }));
  it("computes zero for no S phase cells", () =>
    expect(
      runCellCycleSPhaseFraction({ sPhaseCells: 0, totalCells: 500 }),
    ).toEqual({ ok: true, output: { sPhaseFraction: 0 } }));
  it("computes one when all cells are in S phase", () =>
    expect(
      runCellCycleSPhaseFraction({ sPhaseCells: 1000, totalCells: 1000 }),
    ).toEqual({ ok: true, output: { sPhaseFraction: 1 } }));
  it("handles small cohorts", () =>
    expect(
      runCellCycleSPhaseFraction({ sPhaseCells: 1, totalCells: 4 }),
    ).toEqual({ ok: true, output: { sPhaseFraction: 0.25 } }));
  it("reports repeating fractions exactly", () =>
    expect(
      runCellCycleSPhaseFraction({ sPhaseCells: 333, totalCells: 999 }),
    ).toEqual({
      ok: true,
      output: { sPhaseFraction: 0.3333333333333333 },
    }));
  it("rejects a zero total", () => {
    const result = runCellCycleSPhaseFraction({
      sPhaseCells: 10,
      totalCells: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_counts");
  });
  it("rejects S phase cells exceeding the total", () => {
    const result = runCellCycleSPhaseFraction({
      sPhaseCells: 50,
      totalCells: 40,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_counts");
  });
});

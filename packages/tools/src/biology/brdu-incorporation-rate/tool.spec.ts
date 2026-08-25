import { describe, expect, it } from "vitest";
import { runBrduIncorporationRate } from "./tool.js";

describe("BrdU Incorporation Rate", () => {
  it("computes fifteen percent labeled cells", () =>
    expect(
      runBrduIncorporationRate({ brduPositiveCells: 120, totalCells: 800 }),
    ).toEqual({ ok: true, output: { incorporationRatePercent: 15 } }));
  it("computes zero for no labeled cells", () =>
    expect(
      runBrduIncorporationRate({ brduPositiveCells: 0, totalCells: 300 }),
    ).toEqual({ ok: true, output: { incorporationRatePercent: 0 } }));
  it("computes one hundred percent for fully labeled culture", () =>
    expect(
      runBrduIncorporationRate({ brduPositiveCells: 640, totalCells: 640 }),
    ).toEqual({ ok: true, output: { incorporationRatePercent: 100 } }));
  it("computes a quarter labeled population", () =>
    expect(
      runBrduIncorporationRate({ brduPositiveCells: 200, totalCells: 800 }),
    ).toEqual({ ok: true, output: { incorporationRatePercent: 25 } }));
  it("reports non terminating rates exactly", () =>
    expect(
      runBrduIncorporationRate({ brduPositiveCells: 45, totalCells: 360 }),
    ).toEqual({ ok: true, output: { incorporationRatePercent: 12.5 } }));
  it("rejects a zero total", () => {
    const result = runBrduIncorporationRate({
      brduPositiveCells: 8,
      totalCells: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_counts");
  });
  it("rejects labeled cells exceeding the total", () => {
    const result = runBrduIncorporationRate({
      brduPositiveCells: 90,
      totalCells: 80,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_counts");
  });
});

import { describe, expect, it } from "vitest";
import { runHemocytometerViability } from "./tool.js";

describe("Trypan Blue Viability %", () => {
  it("calculates a valid result", () =>
    expect(
      runHemocytometerViability({ stainedCells: 50, unstainedCells: 150 }),
    ).toEqual({ ok: true, output: { viabilityPercent: 75 } }));
  it("reports full viability without stained cells", () =>
    expect(
      runHemocytometerViability({ stainedCells: 0, unstainedCells: 60 }),
    ).toEqual({ ok: true, output: { viabilityPercent: 100 } }));
  it("reports zero viability for all stained cells", () =>
    expect(
      runHemocytometerViability({ stainedCells: 25, unstainedCells: 0 }),
    ).toEqual({ ok: true, output: { viabilityPercent: 0 } }));
  it("reports half viability for equal counts", () =>
    expect(
      runHemocytometerViability({ stainedCells: 90, unstainedCells: 90 }),
    ).toEqual({ ok: true, output: { viabilityPercent: 50 } }));
  it("scores high viability samples", () =>
    expect(
      runHemocytometerViability({ stainedCells: 20, unstainedCells: 180 }),
    ).toEqual({ ok: true, output: { viabilityPercent: 90 } }));
  it("rejects an empty counting chamber", () => {
    const result = runHemocytometerViability({
      stainedCells: 0,
      unstainedCells: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].code).toBe("insufficient_cells");
  });
  it("rejects negative stained counts", () =>
    expect(
      runHemocytometerViability({ stainedCells: -1, unstainedCells: 50 }).ok,
    ).toBe(false));
});

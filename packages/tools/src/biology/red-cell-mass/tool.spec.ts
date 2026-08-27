import { describe, expect, it } from "vitest";
import { runRedCellMass } from "./tool.js";

describe("Red Cell Mass mL", () => {
  it("scales blood volume by the hematocrit fraction", () =>
    expect(
      runRedCellMass({ bloodVolumeMl: 5000, hematocritFraction: 0.45 }),
    ).toEqual({ ok: true, output: { redCellMassMl: 2250 } }));
  it("yields the whole volume at a hematocrit of one", () =>
    expect(
      runRedCellMass({ bloodVolumeMl: 4000, hematocritFraction: 1 }),
    ).toEqual({ ok: true, output: { redCellMassMl: 4000 } }));
  it("yields no red cell mass without hematocrit", () =>
    expect(
      runRedCellMass({ bloodVolumeMl: 4000, hematocritFraction: 0 }),
    ).toEqual({ ok: true, output: { redCellMassMl: 0 } }));
  it("handles polycythemic fractions", () =>
    expect(
      runRedCellMass({ bloodVolumeMl: 4800, hematocritFraction: 0.42 }),
    ).toEqual({ ok: true, output: { redCellMassMl: 2016 } }));
  it("rejects non positive blood volume", () => {
    const result = runRedCellMass({
      bloodVolumeMl: 0,
      hematocritFraction: 0.45,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_value");
  });
  it("rejects hematocrit fractions outside the unit interval", () => {
    const result = runRedCellMass({
      bloodVolumeMl: 5000,
      hematocritFraction: 1.5,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].field).toBe("hematocritFraction");
  });
});

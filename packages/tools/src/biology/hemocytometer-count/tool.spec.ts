import { describe, expect, it } from "vitest";
import { runHemocytometerCount } from "./tool.js";

describe("Hemocytometer Cell Count", () => {
  it("calculates a valid result", () =>
    expect(
      runHemocytometerCount({ avgCellsPerSquare: 45, dilutionFactor: 2 }),
    ).toEqual({ ok: true, output: { cellsPerMl: 900000 } }));
  it("defaults the dilution factor to one", () =>
    expect(runHemocytometerCount({ avgCellsPerSquare: 50 })).toEqual({
      ok: true,
      output: { cellsPerMl: 500000 },
    }));
  it("allows zero cells per square", () =>
    expect(
      runHemocytometerCount({ avgCellsPerSquare: 0, dilutionFactor: 5 }),
    ).toEqual({ ok: true, output: { cellsPerMl: 0 } }));
  it("scales fractional averages", () =>
    expect(
      runHemocytometerCount({ avgCellsPerSquare: 12.5, dilutionFactor: 2 }),
    ).toEqual({ ok: true, output: { cellsPerMl: 250000 } }));
  it("applies large dilution factors", () =>
    expect(
      runHemocytometerCount({ avgCellsPerSquare: 100, dilutionFactor: 1 }),
    ).toEqual({ ok: true, output: { cellsPerMl: 1000000 } }));
  it("rejects negative averages", () =>
    expect(runHemocytometerCount({ avgCellsPerSquare: -1 }).ok).toBe(false));
  it("rejects dilution factors below one", () =>
    expect(
      runHemocytometerCount({ avgCellsPerSquare: 10, dilutionFactor: 0.5 }).ok,
    ).toBe(false));
});

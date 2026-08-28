import { describe, expect, it } from "vitest";
import {
  runBoilingPointElevation,
  boilingPointElevationExample,
} from "./tool.js";
describe("Boiling Point Elevation", () => {
  it("publishes an executable example", () =>
    expect(
      runBoilingPointElevation(boilingPointElevationExample.input),
    ).toEqual({
      ok: true,
      output: boilingPointElevationExample.output,
    }));
  it("defaults to water with no dissociation", () =>
    expect(
      runBoilingPointElevation({ kbCkgPerMol: 0.512, molality: 2 }),
    ).toEqual({ ok: true, output: { boilingPointRiseCelsius: 1.024 } }));
  it("doubles with a van 't Hoff factor of two", () =>
    expect(
      runBoilingPointElevation({
        kbCkgPerMol: 0.512,
        molality: 2,
        vantHoffFactor: 2,
      }),
    ).toEqual({ ok: true, output: { boilingPointRiseCelsius: 2.048 } }));
  it("returns zero elevation for zero molality", () =>
    expect(runBoilingPointElevation({ molality: 0 })).toEqual({
      ok: true,
      output: { boilingPointRiseCelsius: 0 },
    }));
  it("accepts a custom ebullioscopic constant for benzene", () => {
    const result = runBoilingPointElevation({ kbCkgPerMol: 2.53, molality: 1 });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.boilingPointRiseCelsius).toBeCloseTo(2.53, 12);
  });
  it("rejects negative molality", () =>
    expect(runBoilingPointElevation({ molality: -2 }).ok).toBe(false));
  it("rejects a non-positive ebullioscopic constant", () =>
    expect(runBoilingPointElevation({ kbCkgPerMol: 0, molality: 2 }).ok).toBe(
      false,
    ));
  it("rejects a non-integer van 't Hoff factor", () =>
    expect(
      runBoilingPointElevation({ molality: 2, vantHoffFactor: 1.5 }).ok,
    ).toBe(false));
});

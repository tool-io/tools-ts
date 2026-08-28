import { describe, expect, it } from "vitest";
import {
  runFreezingPointDepression,
  freezingPointDepressionExample,
} from "./tool.js";
describe("Freezing Point Depression", () => {
  it("publishes an executable example", () =>
    expect(
      runFreezingPointDepression(freezingPointDepressionExample.input),
    ).toEqual({
      ok: true,
      output: freezingPointDepressionExample.output,
    }));
  it("defaults to water with no dissociation", () =>
    expect(runFreezingPointDepression({ molality: 1.5 })).toEqual({
      ok: true,
      output: { freezingPointDropCelsius: 2.79 },
    }));
  it("returns zero depression for zero molality", () =>
    expect(runFreezingPointDepression({ molality: 0 })).toEqual({
      ok: true,
      output: { freezingPointDropCelsius: 0 },
    }));
  it("scales with the van 't Hoff factor", () =>
    expect(
      runFreezingPointDepression({ molality: 1.5, vantHoffFactor: 4 }),
    ).toEqual({ ok: true, output: { freezingPointDropCelsius: 11.16 } }));
  it("accepts a custom cryoscopic constant for benzene", () => {
    const result = runFreezingPointDepression({
      kfCkgPerMol: 5.12,
      molality: 0.5,
    });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.freezingPointDropCelsius).toBeCloseTo(2.56, 12);
  });
  it("rejects a van 't Hoff factor below one", () =>
    expect(
      runFreezingPointDepression({ molality: 1, vantHoffFactor: 0 }).ok,
    ).toBe(false));
  it("rejects a van 't Hoff factor above five", () =>
    expect(
      runFreezingPointDepression({ molality: 1, vantHoffFactor: 6 }).ok,
    ).toBe(false));
  it("rejects negative molality", () =>
    expect(runFreezingPointDepression({ molality: -1 }).ok).toBe(false));
});

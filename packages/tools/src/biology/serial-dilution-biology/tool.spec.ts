import { describe, expect, it } from "vitest";
import { runSerialDilutionBiology } from "./tool.js";

describe("Serial Dilution Biology", () => {
  it("calculates a valid result", () =>
    expect(
      runSerialDilutionBiology({
        dilutionSteps: 3,
        startConcentration: 100,
        transferRatio: 0.5,
      }),
    ).toEqual({
      ok: true,
      output: { finalConcentration: 12.5 },
    }));
  it("matches the single-step tool for one step", () => {
    const result = runSerialDilutionBiology({
      dilutionSteps: 1,
      startConcentration: 80,
      transferRatio: 0.25,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.finalConcentration).toBe(20);
  });
  it("decays geometrically across steps", () => {
    const result = runSerialDilutionBiology({
      dilutionSteps: 4,
      startConcentration: 10000,
      transferRatio: 0.1,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.finalConcentration).toBeCloseTo(1, 9);
  });
  it("never reaches zero in finite steps", () => {
    const result = runSerialDilutionBiology({
      dilutionSteps: 12,
      startConcentration: 1000000,
      transferRatio: 0.5,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.finalConcentration).toBeGreaterThan(0);
  });
  it("requires at least one step", () =>
    expect(
      runSerialDilutionBiology({
        dilutionSteps: 0,
        startConcentration: 100,
        transferRatio: 0.5,
      }).ok,
    ).toBe(false));
  it("rejects boundary transfer ratios", () => {
    expect(
      runSerialDilutionBiology({
        dilutionSteps: 2,
        startConcentration: 100,
        transferRatio: 1,
      }).ok,
    ).toBe(false);
    expect(
      runSerialDilutionBiology({
        dilutionSteps: 2,
        startConcentration: 100,
        transferRatio: 0,
      }).ok,
    ).toBe(false);
  });
  it("rejects non-positive start concentrations", () =>
    expect(
      runSerialDilutionBiology({
        dilutionSteps: 2,
        startConcentration: -5,
        transferRatio: 0.5,
      }).ok,
    ).toBe(false));
  it("rejects fractional step counts", () =>
    expect(
      runSerialDilutionBiology({
        dilutionSteps: 1.5,
        startConcentration: 100,
        transferRatio: 0.5,
      }).ok,
    ).toBe(false));
});

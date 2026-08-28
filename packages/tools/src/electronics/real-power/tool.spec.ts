import { describe, expect, it } from "vitest";
import { runRealPower } from "./tool.js";
describe("Real Power Watts", () => {
  it("calculates a valid result", () =>
    expect(
      runRealPower({ ampsRms: 0.5, powerFactor: 0.8, voltsRms: 120 }),
    ).toEqual({
      ok: true,
      output: { realPowerWatts: 48 },
    }));
  it("calculates another value", () =>
    expect(
      runRealPower({ ampsRms: 1, powerFactor: 0.5, voltsRms: 230 }),
    ).toEqual({
      ok: true,
      output: { realPowerWatts: 115 },
    }));
  it("allows zero power factor", () =>
    expect(
      runRealPower({ ampsRms: 0.5, powerFactor: 0, voltsRms: 120 }),
    ).toEqual({
      ok: true,
      output: { realPowerWatts: 0 },
    }));
  it("allows unity power factor", () =>
    expect(
      runRealPower({ ampsRms: 0.5, powerFactor: 1, voltsRms: 120 }).ok,
    ).toBe(true));
  it("rejects power factor above one", () => {
    const result = runRealPower({
      ampsRms: 1,
      powerFactor: 1.2,
      voltsRms: 120,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "invalid_field",
        field: "powerFactor",
      });
  });
  it("rejects negative power factor", () => {
    const result = runRealPower({
      ampsRms: 1,
      powerFactor: -0.1,
      voltsRms: 120,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].field).toBe("powerFactor");
  });
  it("rejects non-finite input", () =>
    expect(
      runRealPower({
        ampsRms: Number.POSITIVE_INFINITY,
        powerFactor: 0.8,
        voltsRms: 1,
      }).ok,
    ).toBe(false));
  it("rejects an unknown field", () => {
    const result = runRealPower({
      ampsRms: 1,
      extra: 3,
      powerFactor: 0.8,
      voltsRms: 2,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "unknown_field",
        field: "extra",
      });
  });
  it("rejects missing required input", () =>
    expect(runRealPower({ ampsRms: 1, voltsRms: 2 }).ok).toBe(false));
});

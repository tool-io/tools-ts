import { describe, expect, it } from "vitest";
import {
  calculateResistorPowerRatingRequired,
  resistorPowerRatingRequiredExample,
  runResistorPowerRatingRequired,
} from "./tool.js";

describe("resistor power rating required", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runResistorPowerRatingRequired(resistorPowerRatingRequiredExample.input),
    ).toEqual({ ok: true, output: resistorPowerRatingRequiredExample.output });
  });

  it("doubles the required power with the default safety factor of two", () => {
    expect(
      calculateResistorPowerRatingRequired({
        currentAmps: 0.25,
        voltsAcrossV: 8,
      }),
    ).toEqual({ recommendedRatingW: 4, requiredPowerWatts: 2 });
  });

  it("scales the recommended rating linearly across the safety factor range", () => {
    const base = { currentAmps: 0.25, voltsAcrossV: 8 };
    expect(
      calculateResistorPowerRatingRequired({ ...base, safetyFactor: 1 })
        .recommendedRatingW,
    ).toBe(2);
    expect(
      calculateResistorPowerRatingRequired({ ...base, safetyFactor: 5 })
        .recommendedRatingW,
    ).toBe(10);
  });

  it("matches the i squared r dissipation for a resistive load", () => {
    const resistanceOhms = 220;
    const currentAmps = 0.05;
    expect(
      calculateResistorPowerRatingRequired({
        currentAmps,
        voltsAcrossV: currentAmps * resistanceOhms,
      }).requiredPowerWatts,
    ).toBeCloseTo(currentAmps ** 2 * resistanceOhms, 12);
  });

  it("rejects non-positive voltage and current through execution", () => {
    expect(
      runResistorPowerRatingRequired({ currentAmps: 1, voltsAcrossV: -5 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_voltage", field: "voltsAcrossV" }] },
      ok: false,
    });
    expect(
      runResistorPowerRatingRequired({ currentAmps: 0, voltsAcrossV: 5 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_current", field: "currentAmps" }] },
      ok: false,
    });
  });

  it("enforces the documented one to five safety factor window", () => {
    expect(
      runResistorPowerRatingRequired({
        currentAmps: 1,
        safetyFactor: 6,
        voltsAcrossV: 5,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_safety_factor", field: "safetyFactor" }],
      },
      ok: false,
    });
    expect(
      runResistorPowerRatingRequired({
        currentAmps: 1,
        safetyFactor: 0.5,
        voltsAcrossV: 5,
      }).ok,
    ).toBe(false);
  });

  it("defaults the safety factor when omitted", () => {
    expect(
      runResistorPowerRatingRequired({ currentAmps: 0.02, voltsAcrossV: 5 }),
    ).toEqual({
      ok: true,
      output: { recommendedRatingW: 0.2, requiredPowerWatts: 0.1 },
    });
  });
});

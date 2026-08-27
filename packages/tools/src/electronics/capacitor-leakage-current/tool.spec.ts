import { describe, expect, it } from "vitest";
import {
  calculateCapacitorLeakageCurrent,
  capacitorLeakageCurrentExample,
  runCapacitorLeakageCurrent,
} from "./tool.js";

describe("Leakage Current", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runCapacitorLeakageCurrent(capacitorLeakageCurrentExample.input),
    ).toEqual({
      ok: true,
      output: capacitorLeakageCurrentExample.output,
    });
  });

  it("doubles leakage when applied voltage doubles", () => {
    const base = calculateCapacitorLeakageCurrent({
      appliedVolts: 12,
      insulationResistanceMohm: 1000,
    }).leakageCurrentMicroamps;
    expect(
      calculateCapacitorLeakageCurrent({
        appliedVolts: 24,
        insulationResistanceMohm: 1000,
      }).leakageCurrentMicroamps,
    ).toBe(base * 2);
  });

  it("halves leakage when insulation resistance doubles", () => {
    const base = calculateCapacitorLeakageCurrent({
      appliedVolts: 50,
      insulationResistanceMohm: 200,
    }).leakageCurrentMicroamps;
    expect(
      calculateCapacitorLeakageCurrent({
        appliedVolts: 50,
        insulationResistanceMohm: 400,
      }).leakageCurrentMicroamps,
    ).toBe(base / 2);
  });

  it("matches I equals V over R in microamp units", () => {
    expect(
      calculateCapacitorLeakageCurrent({
        appliedVolts: 3.3,
        insulationResistanceMohm: 3300,
      }).leakageCurrentMicroamps,
    ).toBe(0.001);
  });

  it("rejects zero voltage with a stable code", () => {
    expect(
      runCapacitorLeakageCurrent({
        appliedVolts: 0,
        insulationResistanceMohm: 100,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_voltage", field: "appliedVolts" }] },
      ok: false,
    });
  });

  it("rejects zero insulation resistance with a stable code", () => {
    expect(
      runCapacitorLeakageCurrent({
        appliedVolts: 5,
        insulationResistanceMohm: 0,
      }),
    ).toMatchObject({
      error: {
        issues: [
          { code: "invalid_resistance", field: "insulationResistanceMohm" },
        ],
      },
      ok: false,
    });
  });

  it("rejects unknown input fields", () => {
    expect(
      runCapacitorLeakageCurrent({
        ...capacitorLeakageCurrentExample.input,
        megohms: 1,
      } as never),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "megohms" }] },
      ok: false,
    });
  });
});

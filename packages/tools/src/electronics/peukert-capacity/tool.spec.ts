import { describe, expect, it } from "vitest";
import {
  calculatePeukertCapacity,
  peukertCapacityExample,
  runPeukertCapacity,
} from "./tool.js";

describe("Peukert Capacity", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runPeukertCapacity(peukertCapacityExample.input)).toEqual({
      ok: true,
      output: peukertCapacityExample.output,
    });
  });

  it("returns the rated capacity when current matches the rated rate", () => {
    expect(
      runPeukertCapacity({
        dischargeCurrentAmps: 5,
        ratedCapacityAh: 100,
        ratedDischargeRateAmps: 5,
      }),
    ).toEqual({ ok: true, output: { effectiveRuntimeHours: 100 } });
  });

  it("defaults to a Peukert exponent of 1.2", () => {
    expect(
      calculatePeukertCapacity({
        dischargeCurrentAmps: 20,
        ratedCapacityAh: 100,
        ratedDischargeRateAmps: 10,
      }).effectiveRuntimeHours,
    ).toBe(peukertCapacityExample.output.effectiveRuntimeHours);
  });

  it("extends runtime at lighter loads than the rated rate", () => {
    expect(
      calculatePeukertCapacity({
        dischargeCurrentAmps: 10,
        ratedCapacityAh: 100,
        ratedDischargeRateAmps: 20,
      }).effectiveRuntimeHours,
    ).toBeGreaterThan(200);
  });

  it("applies an explicit exponent of one linearly", () => {
    expect(
      calculatePeukertCapacity({
        dischargeCurrentAmps: 20,
        peukertExponent: 1,
        ratedCapacityAh: 100,
        ratedDischargeRateAmps: 10,
      }).effectiveRuntimeHours,
    ).toBeCloseTo(50, 12);
  });

  it("rejects exponent outside the supported range through execution", () => {
    expect(
      runPeukertCapacity({
        dischargeCurrentAmps: 20,
        peukertExponent: 1.8,
        ratedCapacityAh: 100,
        ratedDischargeRateAmps: 10,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "peukertExponent" }] },
      ok: false,
    });
  });

  it("rejects non-positive discharge current with a stable code", () => {
    expect(
      runPeukertCapacity({
        dischargeCurrentAmps: 0,
        ratedCapacityAh: 100,
        ratedDischargeRateAmps: 10,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_current", field: "dischargeCurrentAmps" }],
      },
      ok: false,
    });
  });

  it("guards the direct helper against out-of-range exponents", () => {
    expect(() =>
      calculatePeukertCapacity({
        dischargeCurrentAmps: 20,
        peukertExponent: 0.5,
        ratedCapacityAh: 100,
        ratedDischargeRateAmps: 10,
      }),
    ).toThrowError();
  });
});

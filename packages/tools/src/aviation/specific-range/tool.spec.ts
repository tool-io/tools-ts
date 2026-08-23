import { describe, expect, it } from "vitest";
import { runSpecificRange, specificRangeExample } from "./tool.js";

describe("specific range calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runSpecificRange(specificRangeExample.input)).toEqual({
      ok: true,
      output: specificRangeExample.output,
    });
  });

  it("divides true airspeed by fuel flow", () => {
    const result = runSpecificRange({
      fuelFlowKgPerHour: 1200,
      trueAirspeedKt: 480,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.nauticalMilesPerKg).toBeCloseTo(0.4, 12);
  });

  it("doubles the range when airspeed doubles at constant flow", () => {
    const slow = runSpecificRange({
      fuelFlowKgPerHour: 1000,
      trueAirspeedKt: 200,
    });
    const fast = runSpecificRange({
      fuelFlowKgPerHour: 1000,
      trueAirspeedKt: 400,
    });
    if (!slow.ok || !fast.ok) throw new Error("expected success");
    expect(fast.output.nauticalMilesPerKg).toBeCloseTo(
      Number(slow.output.nauticalMilesPerKg) * 2,
      12,
    );
  });

  it("halves the range when fuel flow doubles at constant airspeed", () => {
    const lean = runSpecificRange({
      fuelFlowKgPerHour: 500,
      trueAirspeedKt: 450,
    });
    const rich = runSpecificRange({
      fuelFlowKgPerHour: 1000,
      trueAirspeedKt: 450,
    });
    if (!lean.ok || !rich.ok) throw new Error("expected success");
    expect(rich.output.nauticalMilesPerKg).toBeCloseTo(
      Number(lean.output.nauticalMilesPerKg) / 2,
      12,
    );
  });

  it("rejects zero true airspeed with a stable code", () => {
    expect(
      runSpecificRange({ fuelFlowKgPerHour: 1000, trueAirspeedKt: 0 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_true_airspeed" }] },
      ok: false,
    });
  });

  it("rejects negative fuel flow through validation", () => {
    expect(
      runSpecificRange({ fuelFlowKgPerHour: -10, trueAirspeedKt: 450 }).ok,
    ).toBe(false);
  });

  it("rejects missing required inputs", () => {
    expect(runSpecificRange({ trueAirspeedKt: 450 })).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "fuelFlowKgPerHour" }],
      },
      ok: false,
    });
  });

  it("rejects non-finite inputs", () => {
    for (const bad of [
      { fuelFlowKgPerHour: Number.NaN, trueAirspeedKt: 450 },
      { fuelFlowKgPerHour: 1000, trueAirspeedKt: Number.POSITIVE_INFINITY },
    ])
      expect(runSpecificRange(bad).ok).toBe(false);
  });
});

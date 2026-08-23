import { describe, expect, it } from "vitest";
import { runSpecificEndurance, specificEnduranceExample } from "./tool.js";

describe("specific endurance calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runSpecificEndurance(specificEnduranceExample.input)).toEqual({
      ok: true,
      output: specificEnduranceExample.output,
    });
  });

  it("returns the reciprocal of the fuel flow", () => {
    const result = runSpecificEndurance({ fuelFlowKgPerHour: 800 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.enduranceHoursPerKg).toBeCloseTo(0.00125, 15);
  });

  it("halves endurance when fuel flow doubles", () => {
    const lean = runSpecificEndurance({ fuelFlowKgPerHour: 400 });
    const rich = runSpecificEndurance({ fuelFlowKgPerHour: 800 });
    if (!lean.ok || !rich.ok) throw new Error("expected success");
    expect(rich.output.enduranceHoursPerKg).toBeCloseTo(
      Number(lean.output.enduranceHoursPerKg) / 2,
      15,
    );
  });

  it("yields one hour per kilogram at one kilogram per hour", () => {
    expect(runSpecificEndurance({ fuelFlowKgPerHour: 1 })).toEqual({
      ok: true,
      output: { enduranceHoursPerKg: 1 },
    });
  });

  it("rejects zero fuel flow with a stable code", () => {
    expect(runSpecificEndurance({ fuelFlowKgPerHour: 0 })).toMatchObject({
      error: { issues: [{ code: "invalid_fuel_flow" }] },
      ok: false,
    });
  });

  it("rejects negative fuel flow through validation", () => {
    expect(runSpecificEndurance({ fuelFlowKgPerHour: -50 }).ok).toBe(false);
  });

  it("rejects missing required inputs", () => {
    expect(runSpecificEndurance({})).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "fuelFlowKgPerHour" }],
      },
      ok: false,
    });
  });

  it("rejects non-finite inputs", () => {
    for (const bad of [
      { fuelFlowKgPerHour: Number.NaN },
      { fuelFlowKgPerHour: Number.NEGATIVE_INFINITY },
    ])
      expect(runSpecificEndurance(bad).ok).toBe(false);
  });
});

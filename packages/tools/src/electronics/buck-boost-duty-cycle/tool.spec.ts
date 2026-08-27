import { describe, expect, it } from "vitest";
import {
  buckBoostDutyCycleExample,
  calculateBuckBoostDutyCycle,
  runBuckBoostDutyCycle,
} from "./tool.js";

describe("Buck-Boost Duty", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runBuckBoostDutyCycle(buckBoostDutyCycleExample.input)).toEqual({
      ok: true,
      output: buckBoostDutyCycleExample.output,
    });
  });

  it("treats negative inverting outputs by magnitude", () => {
    expect(
      calculateBuckBoostDutyCycle({ vIn: 10, vOut: -10 }).dutyCyclePercent,
    ).toBe(50);
  });

  it("uses the same magnitude for positive outputs", () => {
    expect(
      calculateBuckBoostDutyCycle({ vIn: 10, vOut: 10 }).dutyCyclePercent,
    ).toBe(50);
  });

  it("exceeds fifty percent only for magnitudes above the input", () => {
    expect(
      calculateBuckBoostDutyCycle({ vIn: 5, vOut: -15 }).dutyCyclePercent,
    ).toBeCloseTo(75);
  });

  it("falls below fifty percent for small magnitudes", () => {
    expect(
      calculateBuckBoostDutyCycle({ vIn: 19, vOut: -1 }).dutyCyclePercent,
    ).toBeCloseTo(5);
  });

  it("never reaches one hundred percent for finite magnitudes", () => {
    const duty = calculateBuckBoostDutyCycle({
      vIn: 0.001,
      vOut: -1000000,
    }).dutyCyclePercent;
    expect(duty).toBeLessThan(100);
  });

  it("rejects a non-positive input voltage", () => {
    expect(runBuckBoostDutyCycle({ vIn: 0, vOut: -5 })).toMatchObject({
      error: { issues: [{ code: "invalid_v_in" }] },
      ok: false,
    });
  });

  it("guards a zero output with zero_output", () => {
    expect(runBuckBoostDutyCycle({ vIn: 12, vOut: 0 })).toMatchObject({
      error: { issues: [{ code: "zero_output" }] },
      ok: false,
    });
  });
});

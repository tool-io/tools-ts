import { describe, expect, it } from "vitest";
import {
  calculateCukDutyCycle,
  cukDutyCycleExample,
  runCukDutyCycle,
} from "./tool.js";

describe("Ćuk Duty Cycle", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runCukDutyCycle(cukDutyCycleExample.input)).toEqual({
      ok: true,
      output: cukDutyCycleExample.output,
    });
  });

  it("doubles the input magnitude for a doubled negative output", () => {
    expect(
      calculateCukDutyCycle({ vIn: 10, vOut: -20 }).cukDutyCyclePercent,
    ).toBeCloseTo(66.66666666666666);
  });

  it("matches the buck-boost magnitude formula", () => {
    expect(
      calculateCukDutyCycle({ vIn: 24, vOut: -8 }).cukDutyCyclePercent,
    ).toBe(25);
  });

  it("treats positive and negative outputs identically", () => {
    expect(calculateCukDutyCycle({ vIn: 9, vOut: 3 }).cukDutyCyclePercent).toBe(
      calculateCukDutyCycle({ vIn: 9, vOut: -3 }).cukDutyCyclePercent,
    );
  });

  it("approaches one hundred percent for very large magnitudes", () => {
    const duty = calculateCukDutyCycle({
      vIn: 1,
      vOut: -999999,
    }).cukDutyCyclePercent;
    expect(duty).toBeGreaterThan(99);
    expect(duty).toBeLessThan(100);
  });

  it("rejects a non-positive input voltage", () => {
    expect(runCukDutyCycle({ vIn: -5, vOut: -12 })).toMatchObject({
      error: { issues: [{ code: "invalid_v_in" }] },
      ok: false,
    });
  });

  it("guards a zero output with zero_output", () => {
    expect(runCukDutyCycle({ vIn: 12, vOut: 0 })).toMatchObject({
      error: { issues: [{ code: "zero_output" }] },
      ok: false,
    });
  });
});

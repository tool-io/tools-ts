import { describe, expect, it } from "vitest";
import {
  calculateServoAngleFromPulseWidth,
  servoAngleFromPulseWidthExample,
  runServoAngleFromPulseWidth,
} from "./tool.js";

describe("servo angle from pulse width", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runServoAngleFromPulseWidth(servoAngleFromPulseWidthExample.input),
    ).toEqual({ ok: true, output: servoAngleFromPulseWidthExample.output });
  });

  it("maps the documented endpoints linearly", () => {
    expect(
      calculateServoAngleFromPulseWidth({ pulseWidthUs: 1500 })
        .servoAngleDegrees,
    ).toBe(0);
    expect(
      calculateServoAngleFromPulseWidth({ pulseWidthUs: 1000 })
        .servoAngleDegrees,
    ).toBe(-90);
    expect(
      calculateServoAngleFromPulseWidth({ pulseWidthUs: 1750 })
        .servoAngleDegrees,
    ).toBe(45);
  });

  it("clamps extended range pulses beyond the standard window", () => {
    expect(
      calculateServoAngleFromPulseWidth({ pulseWidthUs: 2200 })
        .servoAngleDegrees,
    ).toBe(90);
    expect(
      calculateServoAngleFromPulseWidth({ pulseWidthUs: 750 })
        .servoAngleDegrees,
    ).toBe(-90);
  });

  it("keeps the extremes of the extended range at their clamps", () => {
    expect(
      calculateServoAngleFromPulseWidth({ pulseWidthUs: 2500 })
        .servoAngleDegrees,
    ).toBe(90);
    expect(
      calculateServoAngleFromPulseWidth({ pulseWidthUs: 500 })
        .servoAngleDegrees,
    ).toBe(-90);
  });

  it("moves eighteen degrees per hundred microseconds inside the window", () => {
    const low = calculateServoAngleFromPulseWidth({
      pulseWidthUs: 1600,
    }).servoAngleDegrees;
    const high = calculateServoAngleFromPulseWidth({
      pulseWidthUs: 1700,
    }).servoAngleDegrees;
    expect(high - low).toBe(18);
  });

  it("rejects pulses outside five hundred to twenty five hundred microseconds", () => {
    expect(runServoAngleFromPulseWidth({ pulseWidthUs: 499 })).toMatchObject({
      error: {
        issues: [{ code: "invalid_pulse_width", field: "pulseWidthUs" }],
      },
      ok: false,
    });
    expect(runServoAngleFromPulseWidth({ pulseWidthUs: 2501 })).toMatchObject({
      error: {
        issues: [{ code: "invalid_pulse_width", field: "pulseWidthUs" }],
      },
      ok: false,
    });
  });

  it("is monotonic across the standard window", () => {
    let previous = -91;
    for (const pulseWidthUs of [1000, 1250, 1500, 1750, 2000]) {
      const angle = calculateServoAngleFromPulseWidth({
        pulseWidthUs,
      }).servoAngleDegrees;
      expect(angle).toBeGreaterThan(previous);
      previous = angle;
    }
  });
});

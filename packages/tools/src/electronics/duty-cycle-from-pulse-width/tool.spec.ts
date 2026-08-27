import { describe, expect, it } from "vitest";
import {
  calculateDutyCycleFromPulseWidth,
  dutyCycleFromPulseWidthExample,
  runDutyCycleFromPulseWidth,
} from "./tool.js";

describe("Duty From Pulse Width", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runDutyCycleFromPulseWidth(dutyCycleFromPulseWidthExample.input),
    ).toEqual({
      ok: true,
      output: dutyCycleFromPulseWidthExample.output,
    });
  });

  it("returns one hundred percent for a full-period pulse", () => {
    expect(
      calculateDutyCycleFromPulseWidth({ pulseWidthMs: 10, periodMs: 10 })
        .dutyCyclePercent,
    ).toBe(100);
  });

  it("returns fifty percent for a half-period pulse", () => {
    expect(
      calculateDutyCycleFromPulseWidth({ pulseWidthMs: 5, periodMs: 10 })
        .dutyCyclePercent,
    ).toBe(50);
  });

  it("handles sub-millisecond timing", () => {
    expect(
      calculateDutyCycleFromPulseWidth({ pulseWidthMs: 0.05, periodMs: 2 })
        .dutyCyclePercent,
    ).toBeCloseTo(2.5);
  });

  it("returns zero for a grounded pulse", () => {
    expect(
      calculateDutyCycleFromPulseWidth({ pulseWidthMs: 0, periodMs: 4 })
        .dutyCyclePercent,
    ).toBe(0);
  });

  it("rejects a non-positive period", () => {
    expect(
      runDutyCycleFromPulseWidth({ pulseWidthMs: 2, periodMs: 0 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_period_ms" }] },
      ok: false,
    });
  });

  it("guards pulses longer than the period with invalid_pulse", () => {
    expect(
      runDutyCycleFromPulseWidth({ pulseWidthMs: 12, periodMs: 8 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_pulse" }] },
      ok: false,
    });
  });
});

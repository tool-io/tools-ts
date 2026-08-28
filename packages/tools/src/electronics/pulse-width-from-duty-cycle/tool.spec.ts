import { describe, expect, it } from "vitest";
import {
  calculatePulseWidthFromDutyCycle,
  pulseWidthFromDutyCycleExample,
  runPulseWidthFromDutyCycle,
} from "./tool.js";

describe("Pulse Width From Duty", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runPulseWidthFromDutyCycle(pulseWidthFromDutyCycleExample.input),
    ).toEqual({
      ok: true,
      output: pulseWidthFromDutyCycleExample.output,
    });
  });

  it("spans the full period at one hundred percent duty", () => {
    expect(
      calculatePulseWidthFromDutyCycle({ dutyPercent: 100, periodMs: 16 })
        .pulseWidthMs,
    ).toBe(16);
  });

  it("collapses to zero width at zero percent duty", () => {
    expect(
      calculatePulseWidthFromDutyCycle({ dutyPercent: 0, periodMs: 16 })
        .pulseWidthMs,
    ).toBe(0);
  });

  it("splits a period in half at fifty percent duty", () => {
    expect(
      calculatePulseWidthFromDutyCycle({ dutyPercent: 50, periodMs: 2.5 })
        .pulseWidthMs,
    ).toBe(1.25);
  });

  it("inverts the duty-cycle-from-pulse-width tool", () => {
    expect(
      calculatePulseWidthFromDutyCycle({ dutyPercent: 25, periodMs: 8 })
        .pulseWidthMs,
    ).toBe(2);
    expect(
      (calculatePulseWidthFromDutyCycle({ dutyPercent: 33.5, periodMs: 200 })
        .pulseWidthMs *
        100) /
        200,
    ).toBeCloseTo(33.5);
  });

  it("rejects a non-positive period", () => {
    expect(
      runPulseWidthFromDutyCycle({ dutyPercent: 50, periodMs: -4 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_period_ms" }] },
      ok: false,
    });
  });

  it("rejects duty above one hundred percent", () => {
    expect(
      runPulseWidthFromDutyCycle({ dutyPercent: 101, periodMs: 8 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "dutyPercent" }] },
      ok: false,
    });
  });

  it("rejects negative duty", () => {
    expect(
      runPulseWidthFromDutyCycle({ dutyPercent: -1, periodMs: 8 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "dutyPercent" }] },
      ok: false,
    });
  });
});

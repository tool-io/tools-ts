import { describe, expect, it } from "vitest";
import {
  calculateStepperMotorRpmFromPulseRate,
  stepperMotorRpmFromPulseRateExample,
  runStepperMotorRpmFromPulseRate,
} from "./tool.js";

describe("stepper rpm from pulse rate", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runStepperMotorRpmFromPulseRate(
        stepperMotorRpmFromPulseRateExample.input,
      ),
    ).toEqual({ ok: true, output: stepperMotorRpmFromPulseRateExample.output });
  });

  it("converts one thousand pulses per second on a 3200 step motor to 18.75 rpm", () => {
    expect(
      calculateStepperMotorRpmFromPulseRate({
        pulseRateHz: 1000,
        stepsPerRevolutionInt: 3200,
      }).revolutionsPerMinute,
    ).toBeCloseTo(18.75, 15);
  });

  it("doubles speed when the pulse rate doubles", () => {
    const base = calculateStepperMotorRpmFromPulseRate({
      pulseRateHz: 500,
      stepsPerRevolutionInt: 200,
    }).revolutionsPerMinute;
    expect(base).toBe(150);
    expect(
      calculateStepperMotorRpmFromPulseRate({
        pulseRateHz: 1000,
        stepsPerRevolutionInt: 200,
      }).revolutionsPerMinute,
    ).toBe(base * 2);
  });

  it("slows by the same factor as added microsteps", () => {
    const full = calculateStepperMotorRpmFromPulseRate({
      pulseRateHz: 9600,
      stepsPerRevolutionInt: 200,
    }).revolutionsPerMinute;
    const micro = calculateStepperMotorRpmFromPulseRate({
      pulseRateHz: 9600,
      stepsPerRevolutionInt: 1600,
    }).revolutionsPerMinute;
    expect(micro).toBe(full / 8);
  });

  it("rejects non-positive pulse rates through execution", () => {
    expect(
      runStepperMotorRpmFromPulseRate({
        pulseRateHz: 0,
        stepsPerRevolutionInt: 200,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_rate", field: "pulseRateHz" }] },
      ok: false,
    });
  });

  it("rejects fewer than one step per revolution through execution", () => {
    expect(
      runStepperMotorRpmFromPulseRate({
        pulseRateHz: 100,
        stepsPerRevolutionInt: 0,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_steps", field: "stepsPerRevolutionInt" }],
      },
      ok: false,
    });
  });

  it("stays consistent with the pulses times sixty over steps formula", () => {
    const pulseRateHz = 12345;
    const stepsPerRevolutionInt = 640;
    expect(
      calculateStepperMotorRpmFromPulseRate({
        pulseRateHz,
        stepsPerRevolutionInt,
      }).revolutionsPerMinute,
    ).toBe((pulseRateHz * 60) / stepsPerRevolutionInt);
  });
});

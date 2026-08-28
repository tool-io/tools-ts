import { describe, expect, it } from "vitest";
import {
  calculateStepperMotorStepsPerRevolution,
  stepperMotorStepsPerRevolutionExample,
  runStepperMotorStepsPerRevolution,
} from "./tool.js";

describe("stepper steps per revolution", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runStepperMotorStepsPerRevolution(
        stepperMotorStepsPerRevolutionExample.input,
      ),
    ).toEqual({
      ok: true,
      output: stepperMotorStepsPerRevolutionExample.output,
    });
  });

  it("defaults to two hundred full steps without microstepping", () => {
    expect(calculateStepperMotorStepsPerRevolution({})).toEqual({
      stepsPerRevolution: 200,
    });
    expect(runStepperMotorStepsPerRevolution({})).toEqual({
      ok: true,
      output: { stepsPerRevolution: 200 },
    });
  });

  it("multiplies full steps by the microstepping divisor", () => {
    expect(
      calculateStepperMotorStepsPerRevolution({
        fullStepsPerRevInt: 400,
        microsteppingInt: 8,
      }).stepsPerRevolution,
    ).toBe(3200);
    expect(
      calculateStepperMotorStepsPerRevolution({
        fullStepsPerRevInt: 200,
        microsteppingInt: 256,
      }).stepsPerRevolution,
    ).toBe(51200);
  });

  it("supports 0.9 degree motors with microstepping", () => {
    expect(
      calculateStepperMotorStepsPerRevolution({
        fullStepsPerRevInt: 400,
        microsteppingInt: 16,
      }).stepsPerRevolution,
    ).toBe(6400);
  });

  it("rejects zero or negative full steps through execution", () => {
    expect(
      runStepperMotorStepsPerRevolution({
        fullStepsPerRevInt: 0,
        microsteppingInt: 4,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_steps", field: "fullStepsPerRevInt" }],
      },
      ok: false,
    });
  });

  it("rejects microstepping outside the one to two fifty six window", () => {
    expect(
      runStepperMotorStepsPerRevolution({
        fullStepsPerRevInt: 200,
        microsteppingInt: 257,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_microstepping", field: "microsteppingInt" }],
      },
      ok: false,
    });
    expect(
      runStepperMotorStepsPerRevolution({
        fullStepsPerRevInt: 200,
        microsteppingInt: 0,
      }).ok,
    ).toBe(false);
  });
});

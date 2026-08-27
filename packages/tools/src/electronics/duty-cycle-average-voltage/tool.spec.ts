import { describe, expect, it } from "vitest";
import {
  calculateDutyCycleAverageVoltage,
  dutyCycleAverageVoltageExample,
  runDutyCycleAverageVoltage,
} from "./tool.js";

describe("PWM Average Voltage", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runDutyCycleAverageVoltage(dutyCycleAverageVoltageExample.input),
    ).toEqual({
      ok: true,
      output: dutyCycleAverageVoltageExample.output,
    });
  });

  it("rejects duty cycle above one hundred percent", () => {
    expect(
      runDutyCycleAverageVoltage({ dutyPercent: 150, supplyVolts: 12 }).ok,
    ).toBe(false);
  });

  it("reaches full supply voltage at one hundred percent duty", () => {
    expect(
      calculateDutyCycleAverageVoltage({
        dutyPercent: 100,
        supplyVolts: 12,
      }).averageVoltage,
    ).toBe(12);
  });
});

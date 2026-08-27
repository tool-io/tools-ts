import { describe, expect, it } from "vitest";
import {
  calculateDifferentiatorStepVoltage,
  differentiatorStepVoltageExample,
  runDifferentiatorStepVoltage,
} from "./tool.js";

describe("Differentiator Step Peak", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runDifferentiatorStepVoltage(differentiatorStepVoltageExample.input),
    ).toEqual({
      ok: true,
      output: differentiatorStepVoltageExample.output,
    });
  });

  it("peaks at nearly the full inverted step for a step much faster than tau", () => {
    expect(
      calculateDifferentiatorStepVoltage({
        vinStepVolts: -4,
        rOhms: 10000,
        cFarads: 0.000001,
        stepTimeSeconds: 0.000001,
      }).differentiatorPeakV,
    ).toBeCloseTo(4);
  });

  it("inverts the sign of a positive step", () => {
    const peak = calculateDifferentiatorStepVoltage({
      vinStepVolts: 2,
      rOhms: 1000,
      cFarads: 0.000001,
      stepTimeSeconds: 0.001,
    }).differentiatorPeakV;
    expect(peak).toBeLessThan(0);
    expect(Math.abs(peak)).toBeCloseTo(
      Math.abs(
        calculateDifferentiatorStepVoltage({
          vinStepVolts: -2,
          rOhms: 1000,
          cFarads: 0.000001,
          stepTimeSeconds: 0.001,
        }).differentiatorPeakV,
      ),
    );
  });

  it("stays within the theoretical unbounded ideal by magnitude", () => {
    const { differentiatorPeakV } = calculateDifferentiatorStepVoltage({
      vinStepVolts: 10,
      rOhms: 1000000,
      cFarads: 0.001,
      stepTimeSeconds: 0.000001,
    });
    expect(Math.abs(differentiatorPeakV)).toBeLessThan(10);
  });

  it("approaches zero for a step much slower than tau", () => {
    const { differentiatorPeakV } = calculateDifferentiatorStepVoltage({
      vinStepVolts: 5,
      rOhms: 1,
      cFarads: 0.000001,
      stepTimeSeconds: 1000000,
    });
    expect(differentiatorPeakV).toBeLessThan(0);
    expect(differentiatorPeakV).toBeCloseTo(0, 10);
  });

  it("rejects zero resistance", () => {
    expect(
      runDifferentiatorStepVoltage({
        vinStepVolts: 5,
        rOhms: 0,
        cFarads: 0.000001,
        stepTimeSeconds: 0.001,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_r_ohms" }] },
      ok: false,
    });
  });

  it("rejects zero capacitance", () => {
    expect(
      runDifferentiatorStepVoltage({
        vinStepVolts: 5,
        rOhms: 1000,
        cFarads: 0,
        stepTimeSeconds: 0.001,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_c_farads" }] },
      ok: false,
    });
  });

  it("rejects a non-positive step time", () => {
    expect(
      runDifferentiatorStepVoltage({
        vinStepVolts: 5,
        rOhms: 1000,
        cFarads: 0.000001,
        stepTimeSeconds: -1,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_step_time_seconds" }] },
      ok: false,
    });
  });
});

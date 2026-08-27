import { describe, expect, it } from "vitest";
import {
  calculateCrosstalkCoefficient,
  crosstalkCoefficientExample,
  runCrosstalkCoefficient,
} from "./tool.js";

describe("Crosstalk Coefficient", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runCrosstalkCoefficient(crosstalkCoefficientExample.input)).toEqual({
      ok: true,
      output: crosstalkCoefficientExample.output,
    });
  });

  it("returns zero decibels when the coupled and aggressor voltages match", () => {
    expect(
      calculateCrosstalkCoefficient({
        aggressorVoltageV: 1.5,
        coupledVoltageV: 1.5,
      }).crosstalkDb,
    ).toBe(0);
  });

  it("reports -20 dB for a factor of ten attenuation", () => {
    expect(
      calculateCrosstalkCoefficient({
        aggressorVoltageV: 1,
        coupledVoltageV: 0.1,
      }).crosstalkDb,
    ).toBeCloseTo(-20, 12);
  });

  it("reports positive decibels for amplification", () => {
    expect(
      calculateCrosstalkCoefficient({
        aggressorVoltageV: 0.5,
        coupledVoltageV: 1,
      }).crosstalkDb,
    ).toBe(20 * Math.log10(2));
  });

  it("rejects the non-finite result of a zero coupled voltage", () => {
    expect(
      runCrosstalkCoefficient({ aggressorVoltageV: 2, coupledVoltageV: 0 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_output" }] },
      ok: false,
    });
  });

  it("rejects a zero aggressor voltage with must_be_nonzero", () => {
    expect(
      runCrosstalkCoefficient({ aggressorVoltageV: 0, coupledVoltageV: 1 }),
    ).toMatchObject({
      error: { issues: [{ code: "must_be_nonzero" }] },
      ok: false,
    });
  });

  it("rejects a negative coupled voltage", () => {
    expect(
      runCrosstalkCoefficient({ aggressorVoltageV: 2, coupledVoltageV: -0.1 })
        .ok,
    ).toBe(false);
  });
});

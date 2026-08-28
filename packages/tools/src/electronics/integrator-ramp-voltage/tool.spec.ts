import { describe, expect, it } from "vitest";
import {
  calculateIntegratorRampVoltage,
  integratorRampVoltageExample,
  runIntegratorRampVoltage,
} from "./tool.js";

describe("Integrator Ramp", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runIntegratorRampVoltage(integratorRampVoltageExample.input),
    ).toEqual({
      ok: true,
      output: integratorRampVoltageExample.output,
    });
  });

  it("inverts the input voltage sign", () => {
    expect(
      calculateIntegratorRampVoltage({
        vinVolts: -1,
        timeSeconds: 0.001,
        rOhms: 1000000,
        cFarads: 0.000001,
      }).rampVoltageV,
    ).toBeCloseTo(0.001);
  });

  it("produces an equal magnitude ramp for one time constant", () => {
    expect(
      Math.abs(
        calculateIntegratorRampVoltage({
          vinVolts: 1,
          timeSeconds: 0.01,
          rOhms: 10000,
          cFarads: 0.000001,
        }).rampVoltageV,
      ),
    ).toBeCloseTo(1);
  });

  it("ramps twice as far for doubled time", () => {
    const short = calculateIntegratorRampVoltage({
      vinVolts: 3,
      timeSeconds: 0.002,
      rOhms: 5000,
      cFarads: 0.0000001,
    }).rampVoltageV;
    const long = calculateIntegratorRampVoltage({
      vinVolts: 3,
      timeSeconds: 0.004,
      rOhms: 5000,
      cFarads: 0.0000001,
    }).rampVoltageV;
    expect(long).toBeCloseTo(short * 2);
  });

  it("outputs zero for a grounded input", () => {
    expect(
      calculateIntegratorRampVoltage({
        vinVolts: 0,
        timeSeconds: 0.01,
        rOhms: 1000,
        cFarads: 0.0001,
      }).rampVoltageV,
    ).toBe(-0);
  });

  it("rejects a non-positive time interval", () => {
    expect(
      runIntegratorRampVoltage({
        vinVolts: 1,
        timeSeconds: 0,
        rOhms: 1000,
        cFarads: 0.0001,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_time_seconds" }] },
      ok: false,
    });
  });

  it("rejects zero resistance", () => {
    expect(
      runIntegratorRampVoltage({
        vinVolts: 1,
        timeSeconds: 0.01,
        rOhms: 0,
        cFarads: 0.0001,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_r_ohms" }] },
      ok: false,
    });
  });

  it("rejects zero capacitance", () => {
    expect(
      runIntegratorRampVoltage({
        vinVolts: 1,
        timeSeconds: 0.01,
        rOhms: 1000,
        cFarads: 0,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_c_farads" }] },
      ok: false,
    });
  });
});

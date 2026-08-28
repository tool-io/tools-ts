import { describe, expect, it } from "vitest";
import {
  calculateStrainGaugeFactor,
  runStrainGaugeFactor,
  strainGaugeFactorExample,
} from "./tool.js";

describe("Strain Gauge Resistance Change", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runStrainGaugeFactor(strainGaugeFactorExample.input)).toEqual({
      ok: true,
      output: strainGaugeFactorExample.output,
    });
  });

  it("defaults to a gauge factor of two", () => {
    expect(
      calculateStrainGaugeFactor({
        nominalOhms: 350,
        strainEpsilon: 0.005,
      }).resistanceChangeOhms,
    ).toBe(3.5);
  });

  it("applies an explicit gauge factor proportionally", () => {
    expect(
      calculateStrainGaugeFactor({
        gaugeFactorNumber: 4,
        nominalOhms: 120,
        strainEpsilon: 0.0025,
      }).resistanceChangeOhms,
    ).toBe(1.2);
  });

  it("yields the maximum strain endpoint value", () => {
    expect(
      calculateStrainGaugeFactor({
        nominalOhms: 350,
        strainEpsilon: 0.01,
      }).resistanceChangeOhms,
    ).toBe(7);
  });

  it("reports zero change for zero strain", () => {
    expect(
      runStrainGaugeFactor({ nominalOhms: 120, strainEpsilon: 0 }),
    ).toEqual({ ok: true, output: { resistanceChangeOhms: 0 } });
  });

  it("rejects strain above 0.01 through execution", () => {
    expect(
      runStrainGaugeFactor({ nominalOhms: 120, strainEpsilon: 0.02 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "strainEpsilon" }] },
      ok: false,
    });
  });

  it("guards the direct helper against out-of-range gauge factors", () => {
    expect(() =>
      calculateStrainGaugeFactor({
        gaugeFactorNumber: 500,
        nominalOhms: 120,
        strainEpsilon: 0.001,
      }),
    ).toThrowError();
  });

  it("rejects non-positive nominal resistance with a stable code", () => {
    expect(
      runStrainGaugeFactor({ nominalOhms: 0, strainEpsilon: 0.001 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_resistance", field: "nominalOhms" }] },
      ok: false,
    });
  });
});

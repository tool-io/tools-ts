import { describe, expect, it } from "vitest";
import {
  seismicAcousticImpedanceExample,
  runSeismicAcousticImpedance,
} from "./tool.js";

describe("geology/seismic-acoustic-impedance", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runSeismicAcousticImpedance(seismicAcousticImpedanceExample.input),
    ).toEqual({ ok: true, output: seismicAcousticImpedanceExample.output });
  });

  it("doubles when velocity doubles at fixed density", () => {
    const base = runSeismicAcousticImpedance({
      pVelocityMPers: 2000,
      bulkDensityKgPerM3: 2500,
    });
    const fast = runSeismicAcousticImpedance({
      pVelocityMPers: 4000,
      bulkDensityKgPerM3: 2500,
    });
    if (!base.ok || !fast.ok) throw new Error("expected success");
    expect(
      (fast.output.acousticImpedancePascalSecondPerMeter as number) /
        (base.output.acousticImpedancePascalSecondPerMeter as number),
    ).toBe(2);
  });

  it("rejects non-positive velocity and density", () => {
    expect(
      runSeismicAcousticImpedance({
        pVelocityMPers: 0,
        bulkDensityKgPerM3: 2300,
      }).ok,
    ).toBe(false);
    expect(
      runSeismicAcousticImpedance({
        pVelocityMPers: 3000,
        bulkDensityKgPerM3: 0,
      }).ok,
    ).toBe(false);
  });
});

import { describe, expect, it } from "vitest";
import {
  seismicNmoCorrectionExample,
  runSeismicNmoCorrection,
} from "./tool.js";

describe("geology/seismic-nmo-correction", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runSeismicNmoCorrection(seismicNmoCorrectionExample.input)).toEqual({
      ok: true,
      output: seismicNmoCorrectionExample.output,
    });
  });

  it("grows moveout with offset and shrinks it with velocity", () => {
    const near = runSeismicNmoCorrection({
      zeroOffsetTimeS: 1.0,
      offsetM: 1000,
      velocityMPers: 2000,
    });
    const far = runSeismicNmoCorrection({
      zeroOffsetTimeS: 1.0,
      offsetM: 3000,
      velocityMPers: 2000,
    });
    const fast = runSeismicNmoCorrection({
      zeroOffsetTimeS: 1.0,
      offsetM: 1000,
      velocityMPers: 4000,
    });
    if (!near.ok || !far.ok || !fast.ok) throw new Error("expected success");
    expect(far.output.nmoCorrectionS as number).toBeGreaterThan(
      near.output.nmoCorrectionS as number,
    );
    expect(fast.output.nmoCorrectionS as number).toBeLessThan(
      near.output.nmoCorrectionS as number,
    );
  });

  it("rejects non-positive times and velocities", () => {
    expect(
      runSeismicNmoCorrection({
        zeroOffsetTimeS: 0,
        offsetM: 1000,
        velocityMPers: 2000,
      }).ok,
    ).toBe(false);
    expect(
      runSeismicNmoCorrection({
        zeroOffsetTimeS: 1.0,
        offsetM: 1000,
        velocityMPers: -5,
      }).ok,
    ).toBe(false);
  });
});

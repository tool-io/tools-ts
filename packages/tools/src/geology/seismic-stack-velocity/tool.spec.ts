import { describe, expect, it } from "vitest";
import {
  calculateSeismicStackVelocity,
  seismicStackVelocityExample,
  runSeismicStackVelocity,
} from "./tool.js";

describe("geology/seismic-stack-velocity", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runSeismicStackVelocity(seismicStackVelocityExample.input)).toEqual({
      ok: true,
      output: seismicStackVelocityExample.output,
    });
  });

  it("round-trips with the normal-moveout hyperbola", () => {
    const recovered = calculateSeismicStackVelocity({
      zeroOffsetTimeS: 0.8,
      offsetM: 1500,
      timeAtOffsetS: Math.sqrt(0.8 ** 2 + (1500 / 2400) ** 2),
    });
    expect(recovered.stackVelocityMPers).toBeCloseTo(2400, 12);
  });

  it("rejects arrival times not later than t0 and zero offsets", () => {
    expect(
      runSeismicStackVelocity({
        zeroOffsetTimeS: 1.0,
        offsetM: 2000,
        timeAtOffsetS: 1.0,
      }).ok,
    ).toBe(false);
    expect(
      runSeismicStackVelocity({
        zeroOffsetTimeS: 1.0,
        offsetM: 0,
        timeAtOffsetS: 1.5,
      }).ok,
    ).toBe(false);
  });
});

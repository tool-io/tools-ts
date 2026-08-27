import { describe, expect, it } from "vitest";
import {
  seismicIntervalVelocityDixExample,
  runSeismicIntervalVelocityDix,
} from "./tool.js";

describe("geology/seismic-interval-velocity-dix", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runSeismicIntervalVelocityDix(seismicIntervalVelocityDixExample.input),
    ).toEqual({ ok: true, output: seismicIntervalVelocityDixExample.output });
  });

  it("returns the constant interval velocity for a uniform half-space", () => {
    const result = runSeismicIntervalVelocityDix({
      rmsVelocity1MPers: 2000,
      rmsVelocity2MPers: 2000,
      twoWayTime1S: 0.5,
      twoWayTime2S: 1.5,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.intervalVelocityMPers).toBe(2000);
  });

  it("rejects inverted times and non-real Dix solutions", () => {
    expect(
      runSeismicIntervalVelocityDix({
        rmsVelocity1MPers: 1800,
        rmsVelocity2MPers: 2400,
        twoWayTime1S: 1.0,
        twoWayTime2S: 0.5,
      }).ok,
    ).toBe(false);
    expect(
      runSeismicIntervalVelocityDix({
        rmsVelocity1MPers: 3000,
        rmsVelocity2MPers: 1000,
        twoWayTime1S: 0.5,
        twoWayTime2S: 1.0,
      }).ok,
    ).toBe(false);
  });
});

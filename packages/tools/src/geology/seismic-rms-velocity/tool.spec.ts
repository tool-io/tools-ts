import { describe, expect, it } from "vitest";
import {
  calculateSeismicRmsVelocity,
  seismicRmsVelocityExample,
  runSeismicRmsVelocity,
} from "./tool.js";

describe("geology/seismic-rms-velocity", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runSeismicRmsVelocity(seismicRmsVelocityExample.input)).toEqual({
      ok: true,
      output: seismicRmsVelocityExample.output,
    });
  });

  it("equals the interval velocity for a single layer", () => {
    const result = calculateSeismicRmsVelocity({
      layerVelocitiesMPers: [3400],
      layerIntervalTimesS: [0.5],
    });
    expect(result.rmsVelocityMPers).toBe(3400);
  });

  it("rejects mismatched lists and non-positive values", () => {
    expect(
      runSeismicRmsVelocity({
        layerVelocitiesMPers: [1500, 2200],
        layerIntervalTimesS: [0.4],
      }).ok,
    ).toBe(false);
    expect(
      runSeismicRmsVelocity({
        layerVelocitiesMPers: [1500, 0],
        layerIntervalTimesS: [0.4, 0.6],
      }).ok,
    ).toBe(false);
  });
});

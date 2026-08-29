import { describe, expect, it } from "vitest";
import {
  timeBandwidthCheck,
  timeBandwidthExample as example,
  runTimeBandwidth,
} from "./tool.js";

describe("time–bandwidth product checker", () => {
  it("reproduces its canonical example exactly", () =>
    expect(runTimeBandwidth(example.input)).toEqual({
      ok: true,
      output: example.output,
    }));
  it("recognizes a 100 fs Gaussian needing ~9.4 nm at 800 nm", () => {
    const out = timeBandwidthCheck({
      pulseDurationFs: 100,
      spectralWidthNm: 9.408,
      centerWavelengthNm: 800,
      pulseShape: "gaussian",
    });
    expect(out.timeBandwidthProduct).toBeCloseTo(0.4407, 4);
    expect(out.consistentWithTransformLimit).toBe(true);
  });
  it("flags chirped pulses above the sech limit", () => {
    const out = timeBandwidthCheck({
      pulseDurationFs: 200,
      spectralWidthNm: 9.408,
      centerWavelengthNm: 800,
      pulseShape: "sech-squared",
    });
    expect(out.timeBandwidthProduct).toBeGreaterThan(0.315);
    expect(out.consistentWithTransformLimit).toBe(false);
    expect(out.ratioToTransformLimit).toBeGreaterThan(1);
  });
  it("rejects non-positive durations and widths", () => {
    expect(
      runTimeBandwidth({
        pulseDurationFs: 0,
        spectralWidthNm: 9.408,
        centerWavelengthNm: 800,
        pulseShape: "gaussian",
      }).ok,
    ).toBe(false);
    expect(
      runTimeBandwidth({
        pulseDurationFs: 100,
        spectralWidthNm: -1,
        centerWavelengthNm: 800,
        pulseShape: "gaussian",
      }).ok,
    ).toBe(false);
  });
});

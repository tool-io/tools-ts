import { describe, expect, it } from "vitest";
import {
  calculateRiseTimeFromBandwidth,
  riseTimeFromBandwidthExample,
  runRiseTimeFromBandwidth,
} from "./tool.js";

describe("Rise Time From BW", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runRiseTimeFromBandwidth(riseTimeFromBandwidthExample.input),
    ).toEqual({
      ok: true,
      output: riseTimeFromBandwidthExample.output,
    });
  });

  it("applies the documented Gaussian 350 MHz-ns product", () => {
    expect(
      calculateRiseTimeFromBandwidth({ bandwidthMhz: 350 }).riseTimeNs,
    ).toBe(1);
  });

  it("gives the classic oscilloscope one gigahertz rise time", () => {
    expect(
      calculateRiseTimeFromBandwidth({ bandwidthMhz: 1000 }).riseTimeNs,
    ).toBeCloseTo(0.35);
  });

  it("lengthens rise time as bandwidth narrows", () => {
    const wide = calculateRiseTimeFromBandwidth({
      bandwidthMhz: 100,
    }).riseTimeNs;
    const narrow = calculateRiseTimeFromBandwidth({
      bandwidthMhz: 10,
    }).riseTimeNs;
    expect(narrow).toBe(wide * 10);
  });

  it("accepts fractional bandwidths", () => {
    expect(
      calculateRiseTimeFromBandwidth({ bandwidthMhz: 17.5 }).riseTimeNs,
    ).toBe(20);
  });

  it("rejects zero bandwidth", () => {
    expect(runRiseTimeFromBandwidth({ bandwidthMhz: 0 })).toMatchObject({
      error: { issues: [{ code: "invalid_bandwidth" }] },
      ok: false,
    });
  });

  it("rejects negative bandwidth", () => {
    expect(runRiseTimeFromBandwidth({ bandwidthMhz: -70 })).toMatchObject({
      error: { issues: [{ code: "invalid_bandwidth" }] },
      ok: false,
    });
  });
});

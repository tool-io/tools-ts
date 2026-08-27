import { describe, expect, it } from "vitest";
import {
  bandwidthFromRiseTimeExample,
  calculateBandwidthFromRiseTime,
  runBandwidthFromRiseTime,
} from "./tool.js";

describe("BW From Rise Time", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runBandwidthFromRiseTime(bandwidthFromRiseTimeExample.input),
    ).toEqual({
      ok: true,
      output: bandwidthFromRiseTimeExample.output,
    });
  });

  it("applies the documented Gaussian 350 MHz-ns product", () => {
    expect(calculateBandwidthFromRiseTime({ riseTimeNs: 1 }).bandwidthMhz).toBe(
      350,
    );
  });

  it("gives the classic one nanosecond edge bandwidth", () => {
    expect(
      calculateBandwidthFromRiseTime({ riseTimeNs: 0.35 }).bandwidthMhz,
    ).toBeCloseTo(1000);
  });

  it("widens bandwidth as edges get faster", () => {
    const slow = calculateBandwidthFromRiseTime({
      riseTimeNs: 70,
    }).bandwidthMhz;
    const fast = calculateBandwidthFromRiseTime({ riseTimeNs: 7 }).bandwidthMhz;
    expect(fast).toBe(slow * 10);
  });

  it("accepts fractional rise times", () => {
    expect(
      calculateBandwidthFromRiseTime({ riseTimeNs: 3.5 }).bandwidthMhz,
    ).toBe(100);
  });

  it("rejects zero rise time", () => {
    expect(runBandwidthFromRiseTime({ riseTimeNs: 0 })).toMatchObject({
      error: { issues: [{ code: "invalid_rise_time" }] },
      ok: false,
    });
  });

  it("rejects negative rise time", () => {
    expect(runBandwidthFromRiseTime({ riseTimeNs: -35 })).toMatchObject({
      error: { issues: [{ code: "invalid_rise_time" }] },
      ok: false,
    });
  });
});

import { describe, expect, it } from "vitest";
import {
  runSlewRateBandwidthLimit,
  slewRateBandwidthLimitExample,
} from "./tool.js";
describe("Slew Limited Bandwidth", () => {
  it("publishes an executable example", () =>
    expect(
      runSlewRateBandwidthLimit(slewRateBandwidthLimitExample.input),
    ).toEqual({ ok: true, output: slewRateBandwidthLimitExample.output }));
  it("doubles bandwidth when amplitude halves", () => {
    const result = runSlewRateBandwidthLimit({
      slewRateVPerSecond: 1000000,
      peakVolts: 2.5,
    });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.maxFrequencyHz).toBeCloseTo(63661.97723675814, 6);
  });
  it("rejects zero slew rate", () =>
    expect(
      runSlewRateBandwidthLimit({ slewRateVPerSecond: 0, peakVolts: 1 }).ok,
    ).toBe(false));
  it("rejects zero peak voltage", () =>
    expect(
      runSlewRateBandwidthLimit({ slewRateVPerSecond: 1, peakVolts: 0 }).ok,
    ).toBe(false));
});

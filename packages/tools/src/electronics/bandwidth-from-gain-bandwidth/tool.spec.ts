import { describe, expect, it } from "vitest";
import {
  bandwidthFromGainBandwidthExample,
  calculateBandwidthFromGainBandwidth,
  runBandwidthFromGainBandwidth,
} from "./tool.js";

describe("Bandwidth From GBW", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runBandwidthFromGainBandwidth(bandwidthFromGainBandwidthExample.input),
    ).toEqual({
      ok: true,
      output: bandwidthFromGainBandwidthExample.output,
    });
  });

  it("rejects zero closed-loop gain", () => {
    expect(
      runBandwidthFromGainBandwidth({ closedLoopGain: 0, gbpHz: 1000000 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_gain" }] },
      ok: false,
    });
  });

  it("returns the full gain-bandwidth product at unity gain", () => {
    expect(
      calculateBandwidthFromGainBandwidth({
        closedLoopGain: 1,
        gbpHz: 1000000,
      }).bandwidthHz,
    ).toBe(1000000);
  });
});

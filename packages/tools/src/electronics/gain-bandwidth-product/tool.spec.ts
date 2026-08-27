import { describe, expect, it } from "vitest";
import {
  calculateGainBandwidthProduct,
  gainBandwidthProductExample,
  runGainBandwidthProduct,
} from "./tool.js";

describe("GBW Required", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runGainBandwidthProduct(gainBandwidthProductExample.input)).toEqual({
      ok: true,
      output: gainBandwidthProductExample.output,
    });
  });

  it("rejects non-positive bandwidth", () => {
    expect(
      runGainBandwidthProduct({ bandwidthHz: 0, closedLoopGain: 100 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_bandwidth" }] },
      ok: false,
    });
  });

  it("scales linearly with closed-loop gain", () => {
    expect(
      calculateGainBandwidthProduct({
        bandwidthHz: 20000,
        closedLoopGain: 200,
      }).gainBandwidthProductHz,
    ).toBe(gainBandwidthProductExample.output.gainBandwidthProductHz * 2);
  });
});

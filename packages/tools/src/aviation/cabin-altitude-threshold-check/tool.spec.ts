import { describe, expect, it } from "vitest";
import {
  cabinAltitudeThresholdCheckExample,
  runCabinAltitudeThresholdCheck,
} from "./tool.js";

describe("cabin altitude threshold checker", () => {
  it("reproduces its canonical example", () => {
    expect(
      runCabinAltitudeThresholdCheck(cabinAltitudeThresholdCheckExample.input),
    ).toEqual({ ok: true, output: cabinAltitudeThresholdCheckExample.output });
  });
  it("does not flag the exact threshold", () => {
    expect(runCabinAltitudeThresholdCheck({ cabinAltitudeFt: 12500 })).toEqual({
      ok: true,
      output: { exceedsThreshold: false, thresholdFt: 12500 },
    });
  });
  it("honors a custom comparison threshold", () => {
    expect(
      runCabinAltitudeThresholdCheck({
        cabinAltitudeFt: 11000,
        thresholdFt: 10000,
      }),
    ).toEqual({
      ok: true,
      output: { exceedsThreshold: true, thresholdFt: 10000 },
    });
  });
});

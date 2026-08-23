import { describe, expect, it } from "vitest";
import { cabinAltitudeRateExample, runCabinAltitudeRate } from "./tool.js";

describe("cabin altitude change rate calculator", () => {
  it("reproduces its canonical example", () => {
    expect(runCabinAltitudeRate(cabinAltitudeRateExample.input)).toEqual({
      ok: true,
      output: cabinAltitudeRateExample.output,
    });
  });
  it("returns a negative rate during descent", () => {
    expect(
      runCabinAltitudeRate({
        elapsedMinutes: 10,
        endingCabinAltitudeFt: 3000,
        startingCabinAltitudeFt: 8000,
      }),
    ).toEqual({ ok: true, output: { cabinAltitudeRateFpm: -500 } });
  });
  it("rejects non-positive elapsed time", () => {
    expect(
      runCabinAltitudeRate({
        elapsedMinutes: 0,
        endingCabinAltitudeFt: 8000,
        startingCabinAltitudeFt: 2000,
      }).ok,
    ).toBe(false);
  });
});

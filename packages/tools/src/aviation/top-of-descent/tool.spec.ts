import { describe, expect, it } from "vitest";
import { runTopOfDescent } from "./tool.js";

describe("top of descent calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runTopOfDescent(topOfDescentInput())).toEqual({
      ok: true,
      output: { distanceNm: 40 },
    });
  });

  function topOfDescentInput() {
    return {
      currentAltitudeFt: 10000,
      descentRateFpm: 500,
      groundSpeedKt: 120,
      targetAltitudeFt: 0,
    };
  }

  it("rejects climbs and bad rates through execution", () => {
    expect(
      runTopOfDescent({
        currentAltitudeFt: 5000,
        descentRateFpm: 500,
        groundSpeedKt: 120,
        targetAltitudeFt: 9000,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_altitudes" }] },
      ok: false,
    });
    expect(
      runTopOfDescent({
        currentAltitudeFt: 10000,
        descentRateFpm: 0,
        groundSpeedKt: 120,
        targetAltitudeFt: 0,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_rate" }] },
      ok: false,
    });
  });
});

import { describe, expect, it } from "vitest";
import { runStallSpeedAltitude, stallSpeedAltitudeExample } from "./tool.js";

describe("stall speed altitude correction calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runStallSpeedAltitude(stallSpeedAltitudeExample.input)).toEqual({
      ok: true,
      output: stallSpeedAltitudeExample.output,
    });
  });

  it("equals sea level speed at zero altitude", () => {
    expect(
      runStallSpeedAltitude({
        pressureAltitudeFt: 0,
        seaLevelStallSpeedKt: 55,
      }),
    ).toEqual({ ok: true, output: { stallSpeedKt: 55 } });
  });

  it("rejects non-positive speeds through execution", () => {
    for (const bad of [
      { pressureAltitudeFt: 5000, seaLevelStallSpeedKt: 0 },
      { pressureAltitudeFt: -100, seaLevelStallSpeedKt: 50 },
    ])
      expect(runStallSpeedAltitude(bad).ok).toBe(false);
  });
});

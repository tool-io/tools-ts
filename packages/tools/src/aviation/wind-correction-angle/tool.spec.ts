import { describe, expect, it } from "vitest";
import {
  calculateWindCorrectionAngle,
  runWindCorrectionAngle,
  windCorrectionAngleExample,
} from "./tool.js";

describe("wind correction angle calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runWindCorrectionAngle(windCorrectionAngleExample.input)).toEqual(
      { ok: true, output: windCorrectionAngleExample.output },
    );
  });

  it("is zero in still air and for pure headwinds or tailwinds", () => {
    for (const windAngleDeg of [0, 180]) {
      expect(
        calculateWindCorrectionAngle({
          trueAirspeedKt: 100,
          windAngleDeg,
          windSpeedKt: 25,
        }),
      ).toEqual({ wcaDeg: 0 });
    }
    expect(
      calculateWindCorrectionAngle({
        trueAirspeedKt: 100,
        windAngleDeg: 90,
        windSpeedKt: 0,
      }),
    ).toEqual({ wcaDeg: 0 });
  });

  it("flips sign with the wind side", () => {
    const right = calculateWindCorrectionAngle({
      trueAirspeedKt: 120,
      windAngleDeg: 90,
      windSpeedKt: 30,
    });
    const left = calculateWindCorrectionAngle({
      trueAirspeedKt: 120,
      windAngleDeg: -90,
      windSpeedKt: 30,
    });
    expect(right.wcaDeg).toBeGreaterThan(0);
    expect(left.wcaDeg).toBeLessThan(0);
    expect(left.wcaDeg).toBeCloseTo(-right.wcaDeg, 12);
  });

  it("rejects crosswinds beyond TAS through execution", () => {
    expect(
      runWindCorrectionAngle({
        trueAirspeedKt: 20,
        windAngleDeg: 90,
        windSpeedKt: 30,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "wind_exceeds_airspeed" }] },
      ok: false,
    });
  });
});

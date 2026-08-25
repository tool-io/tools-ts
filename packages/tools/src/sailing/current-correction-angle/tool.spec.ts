import { describe, expect, it } from "vitest";
import {
  currentCorrectionAngleExample,
  runCurrentCorrectionAngle,
} from "./tool.js";

describe("Current Correction Angle Calculator", () => {
  it("calculates the canonical example", () =>
    expect(
      runCurrentCorrectionAngle(currentCorrectionAngleExample.input),
    ).toEqual({
      ok: true,
      output: currentCorrectionAngleExample.output,
    }));
  it("needs no correction with slack water", () =>
    expect(
      runCurrentCorrectionAngle({
        boatSpeedKt: 10,
        currentSpeedKt: 0,
        relativeAngleDeg: 90,
      }),
    ).toEqual({ ok: true, output: { correctionDeg: 0 } }));
  it("needs no correction for head-on or following flow", () => {
    expect(
      runCurrentCorrectionAngle({
        boatSpeedKt: 10,
        currentSpeedKt: 5,
        relativeAngleDeg: 0,
      }),
    ).toEqual({ ok: true, output: { correctionDeg: 0 } });
    const following = runCurrentCorrectionAngle({
      boatSpeedKt: 10,
      currentSpeedKt: 5,
      relativeAngleDeg: 180,
    });
    if (!following.ok) throw new Error("expected success");
    expect(Number(following.output.correctionDeg)).toBeCloseTo(0, 12);
  });
  it("corrects to port when the current sets from starboard", () =>
    expect(
      runCurrentCorrectionAngle({
        boatSpeedKt: 10,
        currentSpeedKt: 5,
        relativeAngleDeg: 270,
      }),
    ).toEqual({ ok: true, output: { correctionDeg: 30.000000000000004 } }));
  it("scales symmetrically around ninety and two-seventy", () => {
    expect(
      runCurrentCorrectionAngle({
        boatSpeedKt: 10,
        currentSpeedKt: 5,
        relativeAngleDeg: 30,
      }),
    ).toEqual({
      ok: true,
      output: { correctionDeg: -14.477512185929921 },
    });
    expect(
      runCurrentCorrectionAngle({
        boatSpeedKt: 10,
        currentSpeedKt: 5,
        relativeAngleDeg: 150,
      }),
    ).toEqual({
      ok: true,
      output: { correctionDeg: -14.477512185929921 },
    });
  });
  it("rejects a cross-current stronger than the boat", () => {
    expect(
      runCurrentCorrectionAngle({
        boatSpeedKt: 5,
        currentSpeedKt: 10,
        relativeAngleDeg: 90,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "current_exceeds_boat_speed" }] },
      ok: false,
    });
    expect(
      runCurrentCorrectionAngle({
        boatSpeedKt: 10,
        currentSpeedKt: 15,
        relativeAngleDeg: 270,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "current_exceeds_boat_speed" }] },
      ok: false,
    });
  });
  it("rejects non-positive boat speed with invalid_speed", () => {
    const result = runCurrentCorrectionAngle({
      boatSpeedKt: 0,
      currentSpeedKt: 5,
      relativeAngleDeg: 90,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_speed");
  });
  it("rejects out-of-range angles and negative currents", () => {
    expect(
      runCurrentCorrectionAngle({
        boatSpeedKt: 10,
        currentSpeedKt: 5,
        relativeAngleDeg: -1,
      }).ok,
    ).toBe(false);
    expect(
      runCurrentCorrectionAngle({
        boatSpeedKt: 10,
        currentSpeedKt: 5,
        relativeAngleDeg: 361,
      }).ok,
    ).toBe(false);
    expect(
      runCurrentCorrectionAngle({
        boatSpeedKt: 10,
        currentSpeedKt: -1,
        relativeAngleDeg: 90,
      }).ok,
    ).toBe(false);
  });
  it("rejects malformed input", () => {
    expect(runCurrentCorrectionAngle(null).ok).toBe(false);
    expect(runCurrentCorrectionAngle({}).ok).toBe(false);
    expect(
      runCurrentCorrectionAngle({
        boatSpeedKt: "fast",
        currentSpeedKt: 5,
        relativeAngleDeg: 90,
      }).ok,
    ).toBe(false);
  });
});

import { describe, expect, it } from "vitest";
import {
  calculateStartLineFavoredEnd,
  runStartLineFavoredEnd,
  startLineFavoredEndExample,
} from "./tool.js";

describe("Favored End Calculator", () => {
  it("publishes an executable example", () =>
    expect(runStartLineFavoredEnd(startLineFavoredEndExample.input)).toEqual({
      ok: true,
      output: startLineFavoredEndExample.output,
    }));

  it.each([
    [1, 6, 90, 90, "pin", 600],
    [1, 6, 0, 180, "committee-boat", -600],
    [1, 6, 180, 90, "even", 3.6739403974420595e-14],
    [1, 3600, 270, 90, "committee-boat", -1],
  ])(
    "classifies the favored end",
    (
      lineLengthNm,
      boatSpeedKt,
      lineBearingDeg,
      trueWindFromDeg,
      favoredEnd,
      biasSeconds,
    ) => {
      expect(
        calculateStartLineFavoredEnd({
          lineBearingDeg,
          lineLengthNm,
          boatSpeedKt,
          trueWindFromDeg,
        }),
      ).toEqual({ biasSeconds, favoredEnd });
    },
  );

  it("treats a bias of exactly one second as a favored end", () =>
    expect(
      runStartLineFavoredEnd({
        lineBearingDeg: 90,
        lineLengthNm: 1,
        boatSpeedKt: 3600,
        trueWindFromDeg: 90,
      }),
    ).toEqual({
      ok: true,
      output: { biasSeconds: 1, favoredEnd: "pin" },
    }));

  it("treats a bias of minus one second as committee-boat favored", () =>
    expect(
      runStartLineFavoredEnd({
        lineBearingDeg: 270,
        lineLengthNm: 1,
        boatSpeedKt: 3600,
        trueWindFromDeg: 90,
      }),
    ).toEqual({
      ok: true,
      output: { biasSeconds: -1, favoredEnd: "committee-boat" },
    }));

  it("grows the bias linearly with line length", () => {
    const short = calculateStartLineFavoredEnd({
      lineBearingDeg: 90,
      lineLengthNm: 0.5,
      boatSpeedKt: 6,
      trueWindFromDeg: 90,
    });
    const long = calculateStartLineFavoredEnd({
      lineBearingDeg: 90,
      lineLengthNm: 1,
      boatSpeedKt: 6,
      trueWindFromDeg: 90,
    });
    expect(long.biasSeconds).toBe(short.biasSeconds * 2);
  });

  it("rejects non-positive line lengths", () => {
    const result = runStartLineFavoredEnd({
      lineBearingDeg: 90,
      lineLengthNm: 0,
      boatSpeedKt: 6,
      trueWindFromDeg: 90,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_length");
  });

  it("rejects non-positive boat speeds", () => {
    const result = runStartLineFavoredEnd({
      lineBearingDeg: 90,
      lineLengthNm: 1,
      boatSpeedKt: -3,
      trueWindFromDeg: 90,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_speed");
  });

  it("rejects non-finite and malformed input", () => {
    expect(
      runStartLineFavoredEnd({
        lineBearingDeg: Number.NaN,
        lineLengthNm: 1,
        boatSpeedKt: 6,
        trueWindFromDeg: 90,
      }).ok,
    ).toBe(false);
    expect(
      runStartLineFavoredEnd({
        lineBearingDeg: 90,
        lineLengthNm: 1,
        boatSpeedKt: 6,
      }).ok,
    ).toBe(false);
  });
});

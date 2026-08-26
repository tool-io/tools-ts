import { describe, expect, it } from "vitest";
import { phrfTimeOnTimeExample, runPhrfTimeOnTime } from "./tool.js";

describe("PHRF Time on Time Calculator", () => {
  it("calculates the canonical example exactly", () => {
    expect(runPhrfTimeOnTime(phrfTimeOnTimeExample.input)).toEqual({
      ok: true,
      output: {
        correctedTimeSeconds: 5192.307692307692,
        timeOnTimeCoefficient: 0.9615384615384616,
      },
    });
  });

  it("yields a unit coefficient for a rating of one hundred thirty", () => {
    expect(
      runPhrfTimeOnTime({ elapsedSeconds: 7200, ratingSecondsPerHour: 130 }),
    ).toEqual({
      ok: true,
      output: { correctedTimeSeconds: 7200, timeOnTimeCoefficient: 1 },
    });
  });

  it("scales faster-rated boats below the elapsed time", () => {
    expect(
      runPhrfTimeOnTime({ elapsedSeconds: 3600, ratingSecondsPerHour: 260 }),
    ).toEqual({
      ok: true,
      output: {
        correctedTimeSeconds: 3000,
        timeOnTimeCoefficient: 0.8333333333333334,
      },
    });
  });

  it("scales slower-rated boats above the elapsed time", () => {
    expect(
      runPhrfTimeOnTime({ elapsedSeconds: 3600, ratingSecondsPerHour: 0 }),
    ).toEqual({
      ok: true,
      output: { correctedTimeSeconds: 4500, timeOnTimeCoefficient: 1.25 },
    });
  });

  it("accepts the schema minimum rating of minus five hundred nineteen", () => {
    expect(
      runPhrfTimeOnTime({ elapsedSeconds: 2, ratingSecondsPerHour: -519 }),
    ).toEqual({
      ok: true,
      output: { correctedTimeSeconds: 1300, timeOnTimeCoefficient: 650 },
    });
  });

  it("rejects zero elapsed time with a stable error", () => {
    expect(
      runPhrfTimeOnTime({ elapsedSeconds: 0, ratingSecondsPerHour: 156 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_input", field: "elapsedSeconds" }] },
      ok: false,
    });
  });

  it("rejects negative elapsed time", () => {
    expect(
      runPhrfTimeOnTime({ elapsedSeconds: -1, ratingSecondsPerHour: 156 }).ok,
    ).toBe(false);
  });

  it("rejects a rating at the forbidden value of minus five hundred twenty", () => {
    expect(
      runPhrfTimeOnTime({ elapsedSeconds: 3600, ratingSecondsPerHour: -520 }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "ratingSecondsPerHour" }],
      },
      ok: false,
    });
  });

  it("rejects a non-finite elapsed time", () => {
    expect(
      runPhrfTimeOnTime({
        elapsedSeconds: Number.POSITIVE_INFINITY,
        ratingSecondsPerHour: 156,
      }).ok,
    ).toBe(false);
  });

  it("rejects unknown fields", () => {
    expect(
      runPhrfTimeOnTime({
        distanceNm: 10,
        elapsedSeconds: 5400,
        ratingSecondsPerHour: 156,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "distanceNm" }] },
      ok: false,
    });
  });

  it("rejects a null input object and missing fields", () => {
    expect(runPhrfTimeOnTime(null).ok).toBe(false);
    expect(runPhrfTimeOnTime({ ratingSecondsPerHour: 156 }).ok).toBe(false);
  });
});

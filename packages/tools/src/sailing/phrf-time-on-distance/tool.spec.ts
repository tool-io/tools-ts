import { describe, expect, it } from "vitest";
import { phrfTimeOnDistanceExample, runPhrfTimeOnDistance } from "./tool.js";

describe("PHRF Time on Distance Calculator", () => {
  it("calculates the canonical example exactly", () => {
    expect(runPhrfTimeOnDistance(phrfTimeOnDistanceExample.input)).toEqual({
      ok: true,
      output: { correctedTimeSeconds: 3200 },
    });
  });

  it("returns the elapsed time for a zero rating", () => {
    expect(
      runPhrfTimeOnDistance({
        distanceNm: 5,
        elapsedSeconds: 3600,
        ratingSecondsPerNauticalMile: 0,
      }),
    ).toEqual({ ok: true, output: { correctedTimeSeconds: 3600 } });
  });

  it("subtracts a heavy-boat allowance over the full distance", () => {
    expect(
      runPhrfTimeOnDistance({
        distanceNm: 3,
        elapsedSeconds: 7200,
        ratingSecondsPerNauticalMile: 250,
      }),
    ).toEqual({ ok: true, output: { correctedTimeSeconds: 6450 } });
  });

  it("handles fractional elapsed times", () => {
    expect(
      runPhrfTimeOnDistance({
        distanceNm: 6,
        elapsedSeconds: 3675.5,
        ratingSecondsPerNauticalMile: 155,
      }),
    ).toEqual({ ok: true, output: { correctedTimeSeconds: 2745.5 } });
  });

  it("rejects zero elapsed time with a stable error", () => {
    expect(
      runPhrfTimeOnDistance({
        distanceNm: 10,
        elapsedSeconds: 0,
        ratingSecondsPerNauticalMile: 180,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_input", field: "elapsedSeconds" }] },
      ok: false,
    });
  });

  it("rejects negative course distance", () => {
    expect(
      runPhrfTimeOnDistance({
        distanceNm: -1,
        elapsedSeconds: 5000,
        ratingSecondsPerNauticalMile: 180,
      }).ok,
    ).toBe(false);
  });

  it("accepts a negative rating used by fast boats", () => {
    expect(
      runPhrfTimeOnDistance({
        distanceNm: 10,
        elapsedSeconds: 5000,
        ratingSecondsPerNauticalMile: -30,
      }),
    ).toEqual({ ok: true, output: { correctedTimeSeconds: 5300 } });
  });

  it("rejects an allowance that would make corrected time non-positive", () => {
    expect(
      runPhrfTimeOnDistance({
        distanceNm: 10,
        elapsedSeconds: 5000,
        ratingSecondsPerNauticalMile: 500,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_rating" }] },
      ok: false,
    });
  });

  it("rejects a non-finite rating", () => {
    expect(
      runPhrfTimeOnDistance({
        distanceNm: 10,
        elapsedSeconds: 5000,
        ratingSecondsPerNauticalMile: Number.NaN,
      }).ok,
    ).toBe(false);
  });

  it("rejects unknown fields", () => {
    expect(
      runPhrfTimeOnDistance({
        boatLengthFt: 30,
        distanceNm: 10,
        elapsedSeconds: 5000,
        ratingSecondsPerNauticalMile: 180,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "boatLengthFt" }] },
      ok: false,
    });
  });

  it("rejects a null input object", () => {
    expect(runPhrfTimeOnDistance(null)).toMatchObject({
      error: { issues: [{ code: "object_required", field: "" }] },
      ok: false,
    });
  });

  it("rejects missing fields", () => {
    expect(runPhrfTimeOnDistance({ elapsedSeconds: 5000 }).ok).toBe(false);
  });
});

import { describe, expect, it } from "vitest";
import { handicapPerMileExample, runHandicapPerMile } from "./tool.js";

describe("Handicap Allowance Calculator", () => {
  it("calculates the canonical example exactly", () => {
    expect(runHandicapPerMile(handicapPerMileExample.input)).toEqual({
      ok: true,
      output: { allowanceSecondsPerMile: 25 },
    });
  });

  it("returns a signed negative value when you are the faster boat", () => {
    expect(
      runHandicapPerMile({
        opponentRatingSecondsPerMile: 630,
        yourRatingSecondsPerMile: 600,
      }),
    ).toEqual({ ok: true, output: { allowanceSecondsPerMile: -30 } });
  });

  it("returns zero for equal ratings", () => {
    expect(
      runHandicapPerMile({
        opponentRatingSecondsPerMile: 615,
        yourRatingSecondsPerMile: 615,
      }),
    ).toEqual({ ok: true, output: { allowanceSecondsPerMile: 0 } });
  });

  it("accepts fractional ratings", () => {
    expect(
      runHandicapPerMile({
        opponentRatingSecondsPerMile: 602.5,
        yourRatingSecondsPerMile: 631.25,
      }),
    ).toEqual({ ok: true, output: { allowanceSecondsPerMile: 28.75 } });
  });

  it("accepts zero ratings at the inclusive lower bound", () => {
    expect(
      runHandicapPerMile({
        opponentRatingSecondsPerMile: 0,
        yourRatingSecondsPerMile: 0,
      }),
    ).toEqual({ ok: true, output: { allowanceSecondsPerMile: 0 } });
  });

  it("scales the allowance with miles sailed externally", () => {
    const result = runHandicapPerMile({
      opponentRatingSecondsPerMile: 600,
      yourRatingSecondsPerMile: 630,
    });
    if (!result.ok) throw new Error("expected success");
    expect(Number(result.output.allowanceSecondsPerMile) * 12).toBe(360);
  });

  it("rejects negative ratings with schema errors", () => {
    expect(
      runHandicapPerMile({
        opponentRatingSecondsPerMile: -1,
        yourRatingSecondsPerMile: 630,
      }),
    ).toMatchObject({
      error: {
        issues: [
          { code: "invalid_field", field: "opponentRatingSecondsPerMile" },
        ],
      },
      ok: false,
    });
    expect(
      runHandicapPerMile({
        opponentRatingSecondsPerMile: 605,
        yourRatingSecondsPerMile: -630,
      }).ok,
    ).toBe(false);
  });

  it("rejects unknown fields", () => {
    expect(
      runHandicapPerMile({
        courseMiles: 12,
        opponentRatingSecondsPerMile: 605,
        yourRatingSecondsPerMile: 630,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "courseMiles" }] },
      ok: false,
    });
  });

  it("rejects null input and missing fields", () => {
    expect(runHandicapPerMile(null).ok).toBe(false);
    expect(runHandicapPerMile({}).ok).toBe(false);
  });
});

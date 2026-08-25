import { describe, expect, it } from "vitest";
import { leadPercentageExample, runLeadPercentage } from "./tool.js";

describe("Lead Percentage Calculator", () => {
  it("calculates the canonical example", () =>
    expect(runLeadPercentage(leadPercentageExample.input)).toEqual({
      ok: true,
      output: leadPercentageExample.output,
    }));
  it("returns negative lead for an aft centroid", () =>
    expect(
      runLeadPercentage({
        centroidDistanceMeters: -0.75,
        waterlineLengthMeters: 10,
      }),
    ).toEqual({ ok: true, output: { leadPercent: -7.5 } }));
  it("returns zero for coincident points", () =>
    expect(
      runLeadPercentage({
        centroidDistanceMeters: 0,
        waterlineLengthMeters: 10,
      }),
    ).toEqual({ ok: true, output: { leadPercent: 0 } }));
  it("dilutes with longer waterline length", () =>
    expect(
      runLeadPercentage({
        centroidDistanceMeters: 0.75,
        waterlineLengthMeters: 15,
      }),
    ).toEqual({ ok: true, output: { leadPercent: 5 } }));
  it("handles large forward leads", () =>
    expect(
      runLeadPercentage({
        centroidDistanceMeters: 1.5,
        waterlineLengthMeters: 10,
      }),
    ).toEqual({ ok: true, output: { leadPercent: 15 } }));
  it("rejects zero waterline length", () => {
    const result = runLeadPercentage({
      centroidDistanceMeters: 0.75,
      waterlineLengthMeters: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_lwl");
  });
  it("rejects negative waterline length", () =>
    expect(
      runLeadPercentage({
        centroidDistanceMeters: 0.75,
        waterlineLengthMeters: -10,
      }).ok,
    ).toBe(false));
  it("rejects missing and malformed input", () => {
    expect(runLeadPercentage({}).ok).toBe(false);
    expect(
      runLeadPercentage({
        centroidDistanceMeters: NaN,
        waterlineLengthMeters: 10,
      }).ok,
    ).toBe(false);
    expect(runLeadPercentage(null).ok).toBe(false);
  });
});

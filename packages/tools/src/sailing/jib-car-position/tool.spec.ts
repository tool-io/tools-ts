import { describe, expect, it } from "vitest";
import { jibCarPositionExample, runJibCarPosition } from "./tool.js";

describe("Jib Car Position Calculator", () => {
  it("calculates the canonical example exactly", () => {
    expect(runJibCarPosition(jibCarPositionExample.input)).toEqual({
      ok: true,
      output: { carPositionCm: 120 },
    });
  });

  it("defaults the lead percentage to thirty when omitted", () => {
    expect(runJibCarPosition({ jibFootLengthMeters: 1.11 })).toEqual({
      ok: true,
      output: { carPositionCm: 33.3 },
    });
  });

  it("places the car at ten percent for the minimum lead", () => {
    expect(
      runJibCarPosition({ jibFootLengthMeters: 4, leadPercentage: 10 }),
    ).toEqual({ ok: true, output: { carPositionCm: 40 } });
  });

  it("places the car at fifty percent for the maximum lead", () => {
    expect(
      runJibCarPosition({ jibFootLengthMeters: 4, leadPercentage: 50 }),
    ).toEqual({ ok: true, output: { carPositionCm: 200 } });
  });

  it("preserves fractional centimeter positions", () => {
    expect(
      runJibCarPosition({ jibFootLengthMeters: 3.33, leadPercentage: 35 }),
    ).toEqual({ ok: true, output: { carPositionCm: 116.55 } });
  });

  it("accepts a percentage below ten", () => {
    expect(
      runJibCarPosition({ jibFootLengthMeters: 4, leadPercentage: 5 }),
    ).toEqual({ ok: true, output: { carPositionCm: 20 } });
  });

  it("rejects a percentage above one hundred", () => {
    expect(
      runJibCarPosition({ jibFootLengthMeters: 4, leadPercentage: 101 }).ok,
    ).toBe(false);
  });

  it("rejects zero foot length with a stable error", () => {
    expect(
      runJibCarPosition({ jibFootLengthMeters: 0, leadPercentage: 30 }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_input", field: "jibFootLengthMeters" }],
      },
      ok: false,
    });
  });

  it("rejects unknown fields", () => {
    expect(
      runJibCarPosition({
        jibFootLengthMeters: 4,
        luffLengthMeters: 9,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "luffLengthMeters" }] },
      ok: false,
    });
  });

  it("rejects null input and missing fields", () => {
    expect(runJibCarPosition(null).ok).toBe(false);
    expect(runJibCarPosition({}).ok).toBe(false);
  });
});

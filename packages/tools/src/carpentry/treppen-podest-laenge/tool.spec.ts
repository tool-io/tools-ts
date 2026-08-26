import { describe, expect, it } from "vitest";
import { landingLengthRuleExample, runLandingLengthRule } from "./tool.js";

describe("Landing Length Rule", () => {
  it("computes the canonical example", () =>
    expect(runLandingLengthRule(landingLengthRuleExample.input)).toEqual({
      ok: true,
      output: { landingLengthCm: 100 },
    }));

  it("matches the minimum flight width of sixty centimeters", () =>
    expect(runLandingLengthRule({ flightWidthCm: 60 })).toEqual({
      ok: true,
      output: { landingLengthCm: 60 },
    }));

  it("matches the maximum flight width of two hundred centimeters", () =>
    expect(runLandingLengthRule({ flightWidthCm: 200 })).toEqual({
      ok: true,
      output: { landingLengthCm: 200 },
    }));

  it("accepts fractional flight widths", () =>
    expect(runLandingLengthRule({ flightWidthCm: 85.5 })).toEqual({
      ok: true,
      output: { landingLengthCm: 85.5 },
    }));

  it("keeps the landing length equal to the flight width", () =>
    expect(runLandingLengthRule({ flightWidthCm: 120 })).toEqual({
      ok: true,
      output: { landingLengthCm: 120 },
    }));

  it("rejects flight widths just below sixty", () =>
    expect(runLandingLengthRule({ flightWidthCm: 59.9 }).ok).toBe(false));

  it("rejects flight widths just above two hundred", () =>
    expect(runLandingLengthRule({ flightWidthCm: 200.1 }).ok).toBe(false));

  it("rejects non-finite flight widths", () =>
    expect(
      runLandingLengthRule({ flightWidthCm: Number.POSITIVE_INFINITY }).ok,
    ).toBe(false));

  it("rejects a missing flight width", () => {
    const result = runLandingLengthRule({});
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toEqual({
        code: "invalid_field",
        field: "flightWidthCm",
        message: "Flight width is invalid.",
      });
  });

  it("rejects unknown input fields", () => {
    const result = runLandingLengthRule({
      landingLengthCm: 100,
    } as never);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("unknown_field");
  });
});

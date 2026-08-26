import { describe, expect, it } from "vitest";
import { treadThicknessRuleExample, runTreadThicknessRule } from "./tool.js";

describe("Tread Thickness Rule", () => {
  it("computes the canonical example", () =>
    expect(runTreadThicknessRule(treadThicknessRuleExample.input)).toEqual({
      ok: true,
      output: { recommendedTreadThicknessMm: 40 },
    }));

  it("recommends 40 millimeters exactly at the 90 centimeter threshold", () =>
    expect(runTreadThicknessRule({ spanBetweenStringsCm: 90 })).toEqual({
      ok: true,
      output: { recommendedTreadThicknessMm: 40 },
    }));

  it("recommends 50 millimeters just above the threshold", () =>
    expect(runTreadThicknessRule({ spanBetweenStringsCm: 90.5 })).toEqual({
      ok: true,
      output: { recommendedTreadThicknessMm: 50 },
    }));

  it("recommends 40 millimeters for very small spans", () =>
    expect(runTreadThicknessRule({ spanBetweenStringsCm: 0.5 })).toEqual({
      ok: true,
      output: { recommendedTreadThicknessMm: 40 },
    }));

  it("recommends 50 millimeters at the maximum span of two hundred", () =>
    expect(runTreadThicknessRule({ spanBetweenStringsCm: 200 })).toEqual({
      ok: true,
      output: { recommendedTreadThicknessMm: 50 },
    }));

  it("accepts fractional spans", () =>
    expect(runTreadThicknessRule({ spanBetweenStringsCm: 85.5 })).toEqual({
      ok: true,
      output: { recommendedTreadThicknessMm: 40 },
    }));

  it("rejects a zero span", () => {
    const result = runTreadThicknessRule({ spanBetweenStringsCm: 0 });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toEqual({
        code: "must_be_positive",
        field: "spanBetweenStringsCm",
        message: "Span between strings must be greater than zero.",
      });
  });

  it("rejects negative spans", () =>
    expect(runTreadThicknessRule({ spanBetweenStringsCm: -80 }).ok).toBe(
      false,
    ));

  it("rejects spans above two hundred", () =>
    expect(runTreadThicknessRule({ spanBetweenStringsCm: 200.1 }).ok).toBe(
      false,
    ));

  it("rejects a missing span", () => {
    const result = runTreadThicknessRule({});
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.field).toBe("spanBetweenStringsCm");
  });

  it("rejects unknown input fields", () => {
    const result = runTreadThicknessRule({
      recommendedTreadThicknessMm: 40,
    } as never);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("unknown_field");
  });
});

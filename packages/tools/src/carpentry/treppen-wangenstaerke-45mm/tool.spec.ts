import { describe, expect, it } from "vitest";
import { stringThicknessRuleExample, runStringThicknessRule } from "./tool.js";

describe("String Thickness Rule", () => {
  it("computes the canonical example", () =>
    expect(runStringThicknessRule(stringThicknessRuleExample.input)).toEqual({
      ok: true,
      output: { recommendedStringThicknessMm: 45 },
    }));

  it("recommends 45 millimeters exactly at the 26 centimeter threshold", () =>
    expect(runStringThicknessRule({ treadDepthCm: 26 })).toEqual({
      ok: true,
      output: { recommendedStringThicknessMm: 45 },
    }));

  it("recommends 40 millimeters just below the threshold", () =>
    expect(runStringThicknessRule({ treadDepthCm: 25.5 })).toEqual({
      ok: true,
      output: { recommendedStringThicknessMm: 40 },
    }));

  it("recommends 40 millimeters at the minimum tread depth", () =>
    expect(runStringThicknessRule({ treadDepthCm: 20 })).toEqual({
      ok: true,
      output: { recommendedStringThicknessMm: 40 },
    }));

  it("recommends 45 millimeters at the maximum tread depth", () =>
    expect(runStringThicknessRule({ treadDepthCm: 35 })).toEqual({
      ok: true,
      output: { recommendedStringThicknessMm: 45 },
    }));

  it("keeps the recommendation constant across deep treads", () =>
    expect(runStringThicknessRule({ treadDepthCm: 32 })).toEqual({
      ok: true,
      output: { recommendedStringThicknessMm: 45 },
    }));

  it("rejects tread depths just below twenty", () =>
    expect(runStringThicknessRule({ treadDepthCm: 19.9 }).ok).toBe(false));

  it("rejects tread depths just above thirty-five", () =>
    expect(runStringThicknessRule({ treadDepthCm: 35.1 }).ok).toBe(false));

  it("rejects non-finite tread depths", () =>
    expect(runStringThicknessRule({ treadDepthCm: Number.NaN }).ok).toBe(
      false,
    ));

  it("rejects a missing tread depth", () => {
    const result = runStringThicknessRule({});
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.field).toBe("treadDepthCm");
  });

  it("rejects unknown input fields", () => {
    const result = runStringThicknessRule({
      recommendedStringThicknessMm: 45,
    } as never);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("unknown_field");
  });
});

import { describe, expect, it } from "vitest";
import { runTitrationCurveSlope } from "./tool.js";

describe("Titration Curve Slope Calculator", () => {
  it("calculates a valid result", () => {
    const result = runTitrationCurveSlope({ deltaPh: 1, deltaVolumeML: 1 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.slope).toBeDefined();
  });
  it("rejects invalid input", () =>
    expect(runTitrationCurveSlope(null).ok).toBe(false));
});

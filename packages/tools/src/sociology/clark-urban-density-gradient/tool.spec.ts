import { describe, expect, it } from "vitest";
import {
  calculateClarkGradient,
  clarkUrbanDensityGradientExample,
  clarkUrbanDensityGradientTool,
  runClarkUrbanDensityGradient,
} from "./tool.js";

describe("clarkUrbanDensityGradientTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(
      runClarkUrbanDensityGradient(clarkUrbanDensityGradientExample.input),
    ).toEqual({
      ok: true,
      output: clarkUrbanDensityGradientExample.output,
    });
  });

  it("recovers an exponential decay coefficient and rejects reversed radii", () => {
    expect(
      calculateClarkGradient({
        density1: 1000,
        density2: 1000 * Math.exp(-0.2 * 4),
        distance1Km: 1,
        distance2Km: 5,
      }).gradientCoefficient,
    ).toBeCloseTo(0.2, 14);
    const result = runClarkUrbanDensityGradient({
      density1: 1000,
      density2: 500,
      distance1Km: 5,
      distance2Km: 2,
    });
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected failure");
    expect(result.error.issues[0].field).toBe("distance2Km");
  });

  it("keeps the example portable across JSON", () => {
    expect(
      JSON.parse(JSON.stringify(clarkUrbanDensityGradientExample)),
    ).toEqual(clarkUrbanDensityGradientExample);
    expect(clarkUrbanDensityGradientTool.contractVersion).toBe(1);
    expect(clarkUrbanDensityGradientTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runClarkUrbanDensityGradient(null).ok).toBe(false);
    expect(
      runClarkUrbanDensityGradient({
        ...clarkUrbanDensityGradientExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });
});

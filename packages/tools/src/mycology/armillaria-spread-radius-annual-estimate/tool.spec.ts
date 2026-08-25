import { describe, expect, it } from "vitest";
import {
  armillariaSpreadEstimatorExample,
  armillariaSpreadEstimatorTool,
  runArmillariaSpreadEstimator,
} from "./tool.js";

describe("Armillaria Annual Spread", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(
      runArmillariaSpreadEstimator(armillariaSpreadEstimatorExample.input),
    ).toEqual({
      ok: true,
      output: armillariaSpreadEstimatorExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(
      JSON.parse(JSON.stringify(armillariaSpreadEstimatorExample)),
    ).toEqual(armillariaSpreadEstimatorExample);
    expect(armillariaSpreadEstimatorTool.contractVersion).toBe(1);
    expect(armillariaSpreadEstimatorTool.execution).toEqual({ kind: "pure" });
  });

  it("reports a zero radius for a dormant genet", () => {
    const result = runArmillariaSpreadEstimator({
      observationYears: 3,
      radiusExtensionM: 0,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.annualSpreadRadiusM).toBe(0);
  });

  it("divides seasonal extension by elapsed years", () => {
    const result = runArmillariaSpreadEstimator({
      observationYears: 6,
      radiusExtensionM: 4.2,
    });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.annualSpreadRadiusM).toBeCloseTo(0.7, 12);
  });

  it("accepts a single year of growth", () => {
    const result = runArmillariaSpreadEstimator({
      observationYears: 1,
      radiusExtensionM: 1.1,
    });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.annualSpreadRadiusM).toBeCloseTo(1.1, 12);
  });

  it("rejects negative extension and fewer than one year", () => {
    expect(
      runArmillariaSpreadEstimator({
        observationYears: 2,
        radiusExtensionM: -1,
      }).ok,
    ).toBe(false);
    expect(
      runArmillariaSpreadEstimator({ observationYears: 0, radiusExtensionM: 3 })
        .ok,
    ).toBe(false);
  });

  it("returns structured errors for malformed input", () => {
    expect(runArmillariaSpreadEstimator(null).ok).toBe(false);
    expect(runArmillariaSpreadEstimator({ radiusExtensionM: 3 }).ok).toBe(
      false,
    );
    expect(
      runArmillariaSpreadEstimator({
        ...armillariaSpreadEstimatorExample.input,
        radius: 1,
      }).ok,
    ).toBe(false);
  });
});

import { describe, expect, it } from "vitest";
import {
  adjustTrendImpactStrength,
  runTrendImpact,
  trendImpactExample,
} from "./tool.js";

describe("trend impact event strength adjuster", () => {
  it("reproduces its canonical example", () => {
    expect(runTrendImpact(trendImpactExample.input)).toEqual({
      ok: true,
      output: trendImpactExample.output,
    });
  });

  it("returns the base impact when no adjuster is present", () => {
    expect(
      adjustTrendImpactStrength({
        adjusterWeights: [0.2],
        baseImpact: 50,
        presentAdjusterFlags: [0],
        trendMultiplier: 1,
      }).adjustedImpact,
    ).toBe(50);
  });

  it("adds selected adjuster weights", () => {
    expect(
      adjustTrendImpactStrength({
        adjusterWeights: [0.2, 0.3],
        baseImpact: 100,
        presentAdjusterFlags: [1, 1],
        trendMultiplier: 1,
      }).totalAdjusterWeight,
    ).toBeCloseTo(0.5, 12);
  });

  it("rejects a non-binary presence flag", () => {
    expect(
      runTrendImpact({
        adjusterWeights: [0.2],
        baseImpact: 100,
        presentAdjusterFlags: [2],
        trendMultiplier: 1,
      }),
    ).toMatchObject({
      error: {
        issues: [
          { code: "invalid_adjuster_flag", field: "presentAdjusterFlags.0" },
        ],
      },
      ok: false,
    });
  });
});

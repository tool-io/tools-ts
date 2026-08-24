import { describe, expect, it } from "vitest";
import {
  calculatePseudomorphicCriticalThicknessMatthewsBlakeslee,
  pseudomorphicCriticalThicknessMatthewsBlakesleeExample,
  runPseudomorphicCriticalThicknessMatthewsBlakeslee,
} from "./tool.js";

const run = runPseudomorphicCriticalThicknessMatthewsBlakeslee;
const zincBlende = pseudomorphicCriticalThicknessMatthewsBlakesleeExample.input;

describe("Matthews-Blakeslee Critical Thickness Calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(run(zincBlende)).toEqual({
      ok: true,
      output: pseudomorphicCriticalThicknessMatthewsBlakesleeExample.output,
    });
  });

  it("is independent of the mismatch sign", () => {
    expect(run({ ...zincBlende, mismatchFraction: 0.01 })).toEqual(
      run(zincBlende),
    );
  });

  it("grows as the mismatch shrinks", () => {
    const onePercent =
      calculatePseudomorphicCriticalThicknessMatthewsBlakeslee(zincBlende);
    const halfPercent =
      calculatePseudomorphicCriticalThicknessMatthewsBlakeslee({
        ...zincBlende,
        mismatchFraction: 0.005,
      });
    expect(halfPercent.criticalThicknessNm).toBeGreaterThan(
      onePercent.criticalThicknessNm,
    );
  });

  it("scales with the Burgers-vector magnitude", () => {
    const base =
      calculatePseudomorphicCriticalThicknessMatthewsBlakeslee(
        zincBlende,
      ).criticalThicknessNm;
    const doubled = calculatePseudomorphicCriticalThicknessMatthewsBlakeslee({
      ...zincBlende,
      burgersVectorNm: 0.8,
    }).criticalThicknessNm;
    expect(doubled).toBeCloseTo(2 * base, 12);
  });

  it("rejects a parameter set with no continuum root above the core", () => {
    expect(run({ ...zincBlende, mismatchFraction: 0.15 })).toMatchObject({
      error: { issues: [{ code: "no_continuum_solution" }] },
      ok: false,
    });
  });

  it("rejects zero mismatch and invalid elastic parameters", () => {
    expect(run({ ...zincBlende, mismatchFraction: 0 }).ok).toBe(false);
    expect(run({ ...zincBlende, poissonRatio: 0.5 }).ok).toBe(false);
    expect(run({ ...zincBlende, slipDirectionAngleDegrees: 90 }).ok).toBe(
      false,
    );
  });

  it("requires every material and geometry input", () => {
    expect(run({ mismatchFraction: 0.01 }).ok).toBe(false);
  });
});

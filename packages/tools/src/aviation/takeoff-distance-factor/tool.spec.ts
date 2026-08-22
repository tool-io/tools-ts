import { describe, expect, it } from "vitest";
import {
  calculateTakeoffDistanceFactor,
  runTakeoffDistanceFactor,
  takeoffDistanceFactorExample,
} from "./tool.js";

describe("takeoff distance factor calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runTakeoffDistanceFactor(takeoffDistanceFactorExample.input),
    ).toEqual({
      ok: true,
      output: takeoffDistanceFactorExample.output,
    });
  });

  it("is neutral for a paved sea-level no-wind runway", () => {
    const result = runTakeoffDistanceFactor({ densityAltitudeFt: 0 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.factor).toBe(1);
  });

  it("grows with every adverse condition", () => {
    const base = factorFor({ densityAltitudeFt: 0 });
    expect(factorFor({ densityAltitudeFt: 2000 })).toBeGreaterThan(base);
    expect(
      factorFor({ densityAltitudeFt: 0, surface: "dry-grass" }),
    ).toBeGreaterThan(base);
    expect(factorFor({ densityAltitudeFt: 0, tailwindKt: 10 })).toBeGreaterThan(
      base,
    );
    expect(
      factorFor({ densityAltitudeFt: 0, upslopePercent: 2 }),
    ).toBeGreaterThan(base);
  });

  function factorFor(
    input: Parameters<typeof runTakeoffDistanceFactor>[0],
  ): number {
    const result = runTakeoffDistanceFactor(input);
    if (!result.ok) throw new Error("expected success");
    return result.output.factor as number;
  }
});

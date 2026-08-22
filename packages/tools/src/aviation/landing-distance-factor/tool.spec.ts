import { describe, expect, it } from "vitest";
import {
  calculateLandingDistanceFactor,
  landingDistanceFactorExample,
  runLandingDistanceFactor,
} from "./tool.js";

describe("landing distance factor calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runLandingDistanceFactor(landingDistanceFactorExample.input),
    ).toEqual({
      ok: true,
      output: landingDistanceFactorExample.output,
    });
  });

  it("is milder than the takeoff factors at altitude", () => {
    const landingResult = runLandingDistanceFactor({ densityAltitudeFt: 3000 });
    if (!landingResult.ok) throw new Error("expected success");
    const landing = landingResult.output.factor;
    expect(landing).toBeCloseTo(1.05 ** 3, 9);
  });

  it("penalizes wet grass more than dry grass", () => {
    const wetResult = runLandingDistanceFactor({
      densityAltitudeFt: 0,
      surface: "wet-grass",
    });
    const dryResult = runLandingDistanceFactor({
      densityAltitudeFt: 0,
      surface: "dry-grass",
    });
    if (!wetResult.ok || !dryResult.ok) throw new Error("expected success");
    const wet = wetResult.output.factor as number;
    const dry = dryResult.output.factor as number;
    expect(wet).toBeGreaterThan(dry);
  });
});

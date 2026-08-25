import { describe, expect, it } from "vitest";
import {
  calculateTiHiPatternStabilityChecker,
  tiHiPatternStabilityCheckerExample,
  runTiHiPatternStabilityChecker,
} from "./tool.js";

describe("ti-hi-pattern-stability-checker", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runTiHiPatternStabilityChecker(tiHiPatternStabilityCheckerExample.input),
    ).toEqual({
      ok: true,
      output: tiHiPatternStabilityCheckerExample.output,
    });
  });

  it("flags tall narrow stacks for review", () => {
    const result = runTiHiPatternStabilityChecker({
      cartonLengthCm: 40,
      cartonWidthCm: 30,
      cartonHeightCm: 25,
      layerCount: 6,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.stabilityClassification).toBe("reviewRecommended");
    expect(result.output.stackHeightCm as number).toBe(150);
  });
  it("rejects zero layers", () => {
    expect(
      runTiHiPatternStabilityChecker({
        cartonLengthCm: 40,
        cartonWidthCm: 30,
        cartonHeightCm: 25,
        layerCount: 0,
      }).ok,
    ).toBe(false);
  });

  it("rejects non-finite dimensions and overflowing stacks", () => {
    expect(() =>
      calculateTiHiPatternStabilityChecker({
        cartonHeightCm: Number.NaN,
        cartonLengthCm: 40,
        cartonWidthCm: 30,
        layerCount: 2,
      }),
    ).toThrow("must be finite");
    expect(() =>
      calculateTiHiPatternStabilityChecker({
        cartonHeightCm: Number.MAX_VALUE,
        cartonLengthCm: 40,
        cartonWidthCm: 30,
        layerCount: 2,
      }),
    ).toThrow("outside the representable range");
  });
});

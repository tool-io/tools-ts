import { describe, expect, it } from "vitest";
import {
  calculateDirectStandardizedRateSdr,
  runDirectStandardizedRateSdr,
  directStandardizedRateSdrExample,
} from "./tool.js";

describe("demography/direct-standardized-rate-sdr", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runDirectStandardizedRateSdr(directStandardizedRateSdrExample.input),
    ).toEqual({ ok: true, output: directStandardizedRateSdrExample.output });
  });

  it("reproduces the crude rate under identical composition", () => {
    const result = calculateDirectStandardizedRateSdr({
      ageSpecificRates: [0.02, 0.06],
      standardWeights: [500, 500],
    });
    expect(result.standardizedRate).toBe(0.04);
  });

  it("rejects mismatched lists and zero weights", () => {
    expect(
      runDirectStandardizedRateSdr({
        ageSpecificRates: [0.01],
        standardWeights: [1, 2],
      }).ok,
    ).toBe(false);
    expect(
      runDirectStandardizedRateSdr({
        ageSpecificRates: [-0.01, 0.05],
        standardWeights: [1, 1],
      }).ok,
    ).toBe(false);
    expect(
      runDirectStandardizedRateSdr({
        ageSpecificRates: [0.01, 0.05],
        standardWeights: [0, 0],
      }).ok,
    ).toBe(false);
  });
});

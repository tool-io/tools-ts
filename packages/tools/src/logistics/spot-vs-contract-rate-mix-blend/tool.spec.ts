import { describe, expect, it } from "vitest";
import {
  calculateSpotVsContractRateMixBlend,
  spotVsContractRateMixBlendExample,
  runSpotVsContractRateMixBlend,
} from "./tool.js";

describe("spot-vs-contract-rate-mix-blend", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runSpotVsContractRateMixBlend(spotVsContractRateMixBlendExample.input),
    ).toEqual({
      ok: true,
      output: spotVsContractRateMixBlendExample.output,
    });
  });

  it("blends an all-spot book of business", () => {
    expect(
      runSpotVsContractRateMixBlend({
        contractRatePerMileUsd: 2,
        contractSharePercent: 0,
        spotRatePerMileUsd: 2.6,
      }),
    ).toEqual({
      ok: true,
      output: { blendedRatePerMileUsd: 2.6, spotSharePercent: 100 },
    });
  });

  it("rejects shares beyond one hundred percent", () => {
    expect(
      runSpotVsContractRateMixBlend({
        contractRatePerMileUsd: 2,
        contractSharePercent: 150,
        spotRatePerMileUsd: 2.5,
      }).ok,
    ).toBe(false);
  });

  it("rejects non-finite rates in the direct API", () => {
    expect(() =>
      calculateSpotVsContractRateMixBlend({
        contractRatePerMileUsd: Number.POSITIVE_INFINITY,
        spotRatePerMileUsd: 2.5,
      }),
    ).toThrow("contract rate");
  });
});

import { describe, expect, it } from "vitest";
import {
  betaDistributionExample,
  runBetaDistribution,
  sampleBetaDistribution,
} from "./tool.js";

describe("Beta Distribution Sampler", () => {
  it("is deterministic", () =>
    expect(sampleBetaDistribution(2, 5, 3, "same")).toEqual(
      sampleBetaDistribution(2, 5, 3, "same"),
    ));
  it("publishes an executable example", () =>
    expect(runBetaDistribution(betaDistributionExample.input)).toEqual({
      ok: true,
      output: betaDistributionExample.output,
    }));
});

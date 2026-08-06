import { describe, expect, it } from "vitest";
import {
  binomialSamplerExample,
  runBinomialSampler,
  sampleBinomial,
} from "./tool.js";

describe("Binomial Sampler", () => {
  it("handles boundary probabilities", () => {
    expect(sampleBinomial(4, 0, 2, "seed")).toEqual([0, 0]);
    expect(sampleBinomial(4, 1, 2, "seed")).toEqual([4, 4]);
  });
  it("publishes an executable example", () =>
    expect(runBinomialSampler(binomialSamplerExample.input)).toEqual({
      ok: true,
      output: binomialSamplerExample.output,
    }));
});

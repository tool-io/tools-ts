import { describe, expect, it } from "vitest";
import {
  poissonSamplerExample,
  randomPoisson,
  runPoissonSampler,
  samplePoisson,
} from "./tool.js";

describe("Poisson Sampler", () => {
  it("is deterministic", () =>
    expect(samplePoisson(4, 5, "same")).toEqual(samplePoisson(4, 5, "same")));
  it("returns zero for a zero rate", () =>
    expect(randomPoisson(0, Math.random)).toBe(0));
  it("publishes an executable example", () =>
    expect(runPoissonSampler(poissonSamplerExample.input)).toEqual({
      ok: true,
      output: poissonSamplerExample.output,
    }));
});

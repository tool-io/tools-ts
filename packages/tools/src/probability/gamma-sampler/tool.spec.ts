import { describe, expect, it } from "vitest";
import {
  gammaSamplerExample,
  randomGamma,
  runGammaSampler,
  sampleGamma,
} from "./tool.js";

describe("Gamma Sampler", () => {
  it("is deterministic", () =>
    expect(sampleGamma(2, 1, 3, "same")).toEqual(sampleGamma(2, 1, 3, "same")));
  it("rejects an invalid shape", () =>
    expect(randomGamma(0, Math.random)).toBeNull());
  it("publishes an executable example", () =>
    expect(runGammaSampler(gammaSamplerExample.input)).toEqual({
      ok: true,
      output: gammaSamplerExample.output,
    }));
});

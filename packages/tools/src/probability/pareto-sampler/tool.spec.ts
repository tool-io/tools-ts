import { describe, expect, it } from "vitest";
import {
  paretoSamplerExample,
  runParetoSampler,
  samplePareto,
} from "./tool.js";

describe("Pareto Sampler", () => {
  it("never samples below the scale", () =>
    expect(samplePareto(3, 2, 20, "seed")?.every((value) => value >= 3)).toBe(
      true,
    ));
  it("publishes an executable example", () =>
    expect(runParetoSampler(paretoSamplerExample.input)).toEqual({
      ok: true,
      output: paretoSamplerExample.output,
    }));
});

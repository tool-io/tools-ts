import { describe, expect, it } from "vitest";
import {
  rejectionSamplerExample,
  runRejectionSampler,
  sampleStandardNormalByRejection,
} from "./tool.js";

describe("Rejection Sampler", () => {
  it("keeps samples within the interval", () =>
    expect(
      sampleStandardNormalByRejection(20, -2, 2, "seed")?.samples.every(
        (value) => value >= -2 && value <= 2,
      ),
    ).toBe(true));
  it("rejects reversed intervals", () =>
    expect(
      runRejectionSampler({ count: 2, maximum: -1, minimum: 1, seed: "seed" })
        .ok,
    ).toBe(false));
  it("publishes an executable example", () =>
    expect(runRejectionSampler(rejectionSamplerExample.input)).toEqual({
      ok: true,
      output: rejectionSamplerExample.output,
    }));
});

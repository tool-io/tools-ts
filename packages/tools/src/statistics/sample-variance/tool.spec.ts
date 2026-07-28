import { describe, expect, it } from "vitest";
import { calculateSampleVariance, sampleVarianceExample } from "./tool.js";
describe("sample variance", () => {
  it("uses the n-1 denominator", () =>
    expect(calculateSampleVariance({ values: [1, 2, 3] })).toEqual({
      ok: true,
      output: { sampleVariance: 1 },
    }));
  it("rejects one observation", () =>
    expect(calculateSampleVariance({ values: [1] }).ok).toBe(false));
  it("publishes an executable example", () =>
    expect(calculateSampleVariance(sampleVarianceExample.input).ok).toBe(true));
});

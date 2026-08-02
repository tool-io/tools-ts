import { describe, expect, it } from "vitest";
import { runSampleCovariance, sampleCovarianceExample } from "./tool.js";
describe("Sample Covariance Calculator", () => {
  it("calculates a valid result", () => {
    expect(
      runSampleCovariance({ first: [1, 2, 3], second: [2, 4, 6] }),
    ).toEqual({ ok: true, output: { covariance: 2 } });
  });
  it("rejects invalid input", () =>
    expect(runSampleCovariance(null).ok).toBe(false));
  it("publishes an executable example", () =>
    expect(runSampleCovariance(sampleCovarianceExample.input).ok).toBe(true));
});

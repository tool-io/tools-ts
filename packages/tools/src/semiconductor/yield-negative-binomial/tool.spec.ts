import { describe, expect, it } from "vitest";
import {
  runYieldNegativeBinomial,
  yieldNegativeBinomialExample,
} from "./tool.js";

describe("negative-binomial die yield", () => {
  it("reproduces the documented example", () =>
    expect(
      runYieldNegativeBinomial(yieldNegativeBinomialExample.input),
    ).toEqual({ ok: true, output: yieldNegativeBinomialExample.output }));
  it("returns perfect yield at zero defect exposure", () =>
    expect(
      runYieldNegativeBinomial({
        clusterFactorAlpha: 2,
        defectDensityPerCm2: 0,
        dieAreaCm2: 1,
      }),
    ).toEqual({ ok: true, output: { yieldPercent: 100 } }));
  it("converges toward Poisson yield for very large alpha", () => {
    const result = runYieldNegativeBinomial({
      clusterFactorAlpha: 1e12,
      defectDensityPerCm2: 0.1,
      dieAreaCm2: 1,
    });
    expect(result.ok && result.output.yieldPercent).toBeCloseTo(
      Math.exp(-0.1) * 100,
      10,
    );
  });
});

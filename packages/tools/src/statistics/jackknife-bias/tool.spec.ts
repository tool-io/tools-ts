import { describe, expect, it } from "vitest";
import { calculateJackknifeBias, jackknifeBiasExample } from "./tool.js";

describe("jackknife bias", () => {
  it("finds zero bias for the sample mean", () => {
    expect(calculateJackknifeBias({ values: [1, 2, 10] })).toMatchObject({
      ok: true,
      output: { bias: 0, statistic: "mean" },
    });
  });

  it("estimates median bias", () => {
    const result = calculateJackknifeBias({
      statistic: "median",
      values: [1, 2, 10],
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.bias).toBeCloseTo(4.66666666667);
  });

  it("rejects an undersized sample", () => {
    expect(calculateJackknifeBias({ values: [1] })).toMatchObject({
      error: { code: "invalid_input" },
      ok: false,
    });
  });

  it("publishes an executable example", () => {
    expect(calculateJackknifeBias(jackknifeBiasExample.input).ok).toBe(true);
  });
});

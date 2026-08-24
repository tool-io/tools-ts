import { describe, expect, it } from "vitest";
import {
  calculateLoadFactorWeightUtilizationPercent,
  loadFactorWeightUtilizationPercentExample,
  runLoadFactorWeightUtilizationPercent,
} from "./tool.js";

describe("load-factor-weight-utilization-percent", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runLoadFactorWeightUtilizationPercent(
        loadFactorWeightUtilizationPercentExample.input,
      ),
    ).toEqual({
      ok: true,
      output: loadFactorWeightUtilizationPercentExample.output,
    });
  });

  it("flags overloading above one hundred percent", () => {
    expect(
      runLoadFactorWeightUtilizationPercent({
        loadedWeightLbs: 48000,
        maxPayloadWeightLbs: 45000,
      }),
    ).toEqual({ ok: true, output: { loadFactorPercent: 106.66666666666667 } });
  });

  it("rejects zero payload capacity", () => {
    const result = runLoadFactorWeightUtilizationPercent({
      loadedWeightLbs: 1000,
      maxPayloadWeightLbs: 0,
    });
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected failure");
    expect(result.error.issues[0]).toMatchObject({
      code: "invalid_field",
      field: "maxPayloadWeightLbs",
    });
  });

  it("rejects non-finite weights and overflowing load factors", () => {
    expect(() =>
      calculateLoadFactorWeightUtilizationPercent({
        loadedWeightLbs: Number.NaN,
        maxPayloadWeightLbs: 100,
      }),
    ).toThrow("must be finite");
    expect(() =>
      calculateLoadFactorWeightUtilizationPercent({
        loadedWeightLbs: Number.MAX_VALUE,
        maxPayloadWeightLbs: Number.MIN_VALUE,
      }),
    ).toThrow("too large to represent");
  });
});

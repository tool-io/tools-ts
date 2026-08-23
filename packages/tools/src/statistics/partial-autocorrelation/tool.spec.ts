import { describe, expect, it } from "vitest";
import {
  partialAutocorrelationExample,
  calculatePartialAutocorrelation,
  runPartialAutocorrelation,
} from "./tool.js";

describe("statistics/partial-autocorrelation", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runPartialAutocorrelation(partialAutocorrelationExample.input),
    ).toEqual({
      ok: true,
      output: partialAutocorrelationExample.output,
    });
  });
  it("rejects invalid input (constant_series)", () => {
    expect(runPartialAutocorrelation({ values: [5, 5, 5] }).ok).toBe(false);
  });
  it("rejects invalid input (insufficient_values)", () => {
    expect(runPartialAutocorrelation({ values: [5] }).ok).toBe(false);
  });
  it("rejects invalid input (invalid_lag_count)", () => {
    expect(
      runPartialAutocorrelation({
        values: [3, 5, 6, 4, 7, 8, 5, 6, 9, 8],
        maxLag: 10,
      }).ok,
    ).toBe(false);
  });
  it("honors an explicit lag cap", () => {
    const result = runPartialAutocorrelation({
      values: [3, 5, 6, 4, 7, 8, 5, 6, 9, 8],
      maxLag: 2,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.output.lagCount).toBe(2);
    expect(result.output.coefficients).toEqual([
      0.206382978723, -0.235608134625,
    ]);
  });
});

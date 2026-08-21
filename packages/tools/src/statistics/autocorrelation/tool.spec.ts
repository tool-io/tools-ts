import { describe, expect, it } from "vitest";
import {
  autocorrelationExample,
  calculateAutocorrelation,
  runAutocorrelation,
} from "./tool.js";

describe("autocorrelation calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runAutocorrelation(autocorrelationExample.input)).toEqual({
      ok: true,
      output: autocorrelationExample.output,
    });
  });

  it("caps the default lag count for long series", () => {
    const values = Array.from({ length: 60 }, (_, index) => index % 7);
    const output = calculateAutocorrelation({ values });
    expect(output.lagCount).toBe(40);
    expect(output.coefficients).toHaveLength(40);
  });

  it("reports a negative first lag for alternating series", () => {
    const output = calculateAutocorrelation({
      values: [1, -1, 1, -1, 1, -1],
    });
    expect(output.coefficients[0]).toBeCloseTo(-5 / 6, 11);
    expect(output.criticalBound).toBeCloseTo(1.96 / Math.sqrt(6), 11);
    expect(output.lagCount).toBe(5);
  });

  it("supports an explicit lag below the default cap", () => {
    const output = calculateAutocorrelation({
      maxLag: 2,
      values: [2, 4, 6, 8, 10],
    });
    expect(output.coefficients).toEqual([0.4, -0.1]);
    expect(output.lagCount).toBe(2);
  });

  it("rejects constant series and invalid lag counts through execution", () => {
    expect(runAutocorrelation({ values: [3, 3, 3] })).toMatchObject({
      error: { issues: [{ code: "constant_series" }] },
      ok: false,
    });
    expect(
      runAutocorrelation({ maxLag: 3, values: [1, 2, 3] }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_lag_count" }] },
      ok: false,
    });
    expect(runAutocorrelation({ maxLag: 0, values: [1, 2, 3] }).ok).toBe(
      false,
    );
    expect(runAutocorrelation({ values: [] })).toMatchObject({
      error: { issues: [{ code: "insufficient_values" }] },
      ok: false,
    });
  });
});

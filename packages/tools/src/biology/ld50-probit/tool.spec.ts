import { describe, expect, it } from "vitest";
import { runLd50Probit } from "./tool.js";

describe("Probit LD50 Estimate", () => {
  it("calculates a valid result", () =>
    expect(runLd50Probit({ intercept: 3, slope: 2 })).toEqual({
      ok: true,
      output: { ld50Estimate: 10 },
    }));
  it("returns one dose unit when the intercept is probit five", () =>
    expect(runLd50Probit({ intercept: 5, slope: 1.5 })).toEqual({
      ok: true,
      output: { ld50Estimate: 1 },
    }));
  it("supports LD50 below one dose unit", () => {
    const result = runLd50Probit({ intercept: 8, slope: 1 });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.ld50Estimate).toBe(0.001);
  });
  it("supports large fitted doses", () => {
    const result = runLd50Probit({ intercept: 0, slope: 1 });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.ld50Estimate).toBe(100000);
  });
  it("rejects zero slope", () => {
    const result = runLd50Probit({ intercept: 3, slope: 0 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_slope");
  });
  it("rejects negative slope", () =>
    expect(runLd50Probit({ intercept: 3, slope: -2 }).ok).toBe(false));
  it("rejects non-finite coefficients", () =>
    expect(runLd50Probit({ intercept: Number.NaN, slope: 1 }).ok).toBe(false));
});

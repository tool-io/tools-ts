import { describe, expect, it } from "vitest";
import { runAdditiveGeneticVariance } from "./tool.js";

describe("Additive Variance Component", () => {
  it("calculates a valid result", () =>
    expect(
      runAdditiveGeneticVariance({
        dominanceVariance: 0.125,
        epistaticVariance: 0.125,
        totalGeneticVariance: 0.5,
      }),
    ).toEqual({
      ok: true,
      output: { additiveVariance: 0.25 },
    }));
  it("equals the total with zero components", () =>
    expect(
      runAdditiveGeneticVariance({
        dominanceVariance: 0,
        epistaticVariance: 0,
        totalGeneticVariance: 0.5,
      }),
    ).toEqual({
      ok: true,
      output: { additiveVariance: 0.5 },
    }));
  it("allows a zero additive component", () =>
    expect(
      runAdditiveGeneticVariance({
        dominanceVariance: 0.25,
        epistaticVariance: 0.25,
        totalGeneticVariance: 0.5,
      }),
    ).toEqual({
      ok: true,
      output: { additiveVariance: 0 },
    }));
  it("rejects components exceeding the total", () => {
    const result = runAdditiveGeneticVariance({
      dominanceVariance: 0.6,
      epistaticVariance: 0.5,
      totalGeneticVariance: 0.5,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].code).toBe("negative_components");
  });
  it("rejects negative variance inputs", () =>
    expect(
      runAdditiveGeneticVariance({
        dominanceVariance: -0.125,
        epistaticVariance: 0.125,
        totalGeneticVariance: 0.5,
      }).ok,
    ).toBe(false));
});

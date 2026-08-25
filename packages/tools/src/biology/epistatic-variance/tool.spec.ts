import { describe, expect, it } from "vitest";
import { runEpistaticVariance } from "./tool.js";

describe("Epistasis Variance Share", () => {
  it("calculates a valid result", () =>
    expect(
      runEpistaticVariance({
        epistaticVariance: 0.125,
        totalGeneticVariance: 0.5,
      }),
    ).toEqual({
      ok: true,
      output: { epistaticSharePercent: 25 },
    }));
  it("returns one hundred when epistasis explains all variance", () =>
    expect(
      runEpistaticVariance({
        epistaticVariance: 0.5,
        totalGeneticVariance: 0.5,
      }),
    ).toEqual({
      ok: true,
      output: { epistaticSharePercent: 100 },
    }));
  it("returns zero with no epistatic variance", () =>
    expect(
      runEpistaticVariance({
        epistaticVariance: 0,
        totalGeneticVariance: 0.5,
      }),
    ).toEqual({
      ok: true,
      output: { epistaticSharePercent: 0 },
    }));
  it("rejects a zero total", () => {
    const result = runEpistaticVariance({
      epistaticVariance: 0.125,
      totalGeneticVariance: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].code).toBe("invalid_components");
  });
  it("rejects epistasis exceeding the total", () => {
    const result = runEpistaticVariance({
      epistaticVariance: 0.9,
      totalGeneticVariance: 0.5,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].code).toBe("invalid_components");
  });
  it("rejects negative epistatic variance", () =>
    expect(
      runEpistaticVariance({
        epistaticVariance: -0.125,
        totalGeneticVariance: 0.5,
      }).ok,
    ).toBe(false));
});

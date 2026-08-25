import { describe, expect, it } from "vitest";
import { runDominanceVariance } from "./tool.js";

describe("Dominance Variance Share", () => {
  it("calculates a valid result", () =>
    expect(
      runDominanceVariance({
        dominanceVariance: 0.125,
        totalGeneticVariance: 0.5,
      }),
    ).toEqual({
      ok: true,
      output: { dominanceSharePercent: 25 },
    }));
  it("returns one hundred when dominance explains all variance", () =>
    expect(
      runDominanceVariance({
        dominanceVariance: 0.5,
        totalGeneticVariance: 0.5,
      }),
    ).toEqual({
      ok: true,
      output: { dominanceSharePercent: 100 },
    }));
  it("returns zero with no dominance variance", () =>
    expect(
      runDominanceVariance({
        dominanceVariance: 0,
        totalGeneticVariance: 0.5,
      }),
    ).toEqual({
      ok: true,
      output: { dominanceSharePercent: 0 },
    }));
  it("rejects a zero total", () => {
    const result = runDominanceVariance({
      dominanceVariance: 0.125,
      totalGeneticVariance: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].code).toBe("invalid_components");
  });
  it("rejects dominance exceeding the total", () => {
    const result = runDominanceVariance({
      dominanceVariance: 0.75,
      totalGeneticVariance: 0.5,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].code).toBe("invalid_components");
  });
  it("rejects negative dominance variance", () =>
    expect(
      runDominanceVariance({
        dominanceVariance: -0.125,
        totalGeneticVariance: 0.5,
      }).ok,
    ).toBe(false));
});

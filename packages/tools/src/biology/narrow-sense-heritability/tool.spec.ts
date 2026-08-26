import { describe, expect, it } from "vitest";
import { runNarrowSenseHeritability } from "./tool.js";

describe("Narrow-Sense Heritability", () => {
  it("computes a quarter heritability", () =>
    expect(
      runNarrowSenseHeritability({
        additiveGeneticVariance: 2,
        phenotypicVariance: 8,
      }),
    ).toEqual({ ok: true, output: { narrowSenseHeritability: 0.25 } }));
  it("handles small variance components", () =>
    expect(
      runNarrowSenseHeritability({
        additiveGeneticVariance: 0.5,
        phenotypicVariance: 2,
      }),
    ).toEqual({ ok: true, output: { narrowSenseHeritability: 0.25 } }));
  it("computes strongly heritable traits", () =>
    expect(
      runNarrowSenseHeritability({
        additiveGeneticVariance: 6,
        phenotypicVariance: 8,
      }),
    ).toEqual({ ok: true, output: { narrowSenseHeritability: 0.75 } }));
  it("allows additive variance equal to the total", () =>
    expect(
      runNarrowSenseHeritability({
        additiveGeneticVariance: 5,
        phenotypicVariance: 5,
      }),
    ).toEqual({ ok: true, output: { narrowSenseHeritability: 1 } }));
  it("rejects a zero phenotypic variance", () => {
    const result = runNarrowSenseHeritability({
      additiveGeneticVariance: 2,
      phenotypicVariance: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].code).toBe("invalid_variances");
  });
  it("rejects a zero additive variance", () => {
    const result = runNarrowSenseHeritability({
      additiveGeneticVariance: 0,
      phenotypicVariance: 8,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].code).toBe("invalid_variances");
  });
  it("rejects additive variance exceeding phenotypic variance", () => {
    const result = runNarrowSenseHeritability({
      additiveGeneticVariance: 9,
      phenotypicVariance: 8,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].code).toBe("invalid_variances");
  });
});

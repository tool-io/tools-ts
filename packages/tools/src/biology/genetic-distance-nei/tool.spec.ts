import { describe, expect, it } from "vitest";
import { geneticDistanceNeiExample, runGeneticDistanceNei } from "./tool.js";

describe("Nei Genetic Distance", () => {
  it("matches the canonical example", () => {
    const result = runGeneticDistanceNei(geneticDistanceNeiExample.input);
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.neiDistance).toBeCloseTo(0.060024021143617684, 12);
  });
  it("returns near zero for identical populations", () => {
    const result = runGeneticDistanceNei({
      px1: 0.7,
      px2: 0.3,
      py1: 0.7,
      py2: 0.3,
    });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(Math.abs(Number(result.output.neiDistance))).toBeLessThan(1e-15);
  });
  it("is symmetric when populations are exchanged", () => {
    const forward = runGeneticDistanceNei({
      px1: 0.7,
      px2: 0.3,
      py1: 0.3,
      py2: 0.7,
    });
    const reverse = runGeneticDistanceNei({
      px1: 0.3,
      px2: 0.7,
      py1: 0.7,
      py2: 0.3,
    });
    expect(forward.ok && reverse.ok).toBe(true);
    if (forward.ok && reverse.ok)
      expect(reverse.output.neiDistance).toBeCloseTo(
        Number(forward.output.neiDistance),
        12,
      );
  });
  it("grows with divergence", () => {
    const near = runGeneticDistanceNei({
      px1: 0.9,
      px2: 0.1,
      py1: 0.8,
      py2: 0.2,
    });
    const far = runGeneticDistanceNei({
      px1: 0.9,
      px2: 0.1,
      py1: 0.1,
      py2: 0.9,
    });
    expect(near.ok && far.ok).toBe(true);
    if (near.ok && far.ok)
      expect(Number(far.output.neiDistance)).toBeGreaterThan(
        Number(near.output.neiDistance),
      );
  });
  it("errors with invalid_frequencies when population X does not sum to one", () => {
    const result = runGeneticDistanceNei({
      px1: 0.6,
      px2: 0.2,
      py1: 0.5,
      py2: 0.5,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("invalid_frequencies");
  });
  it("errors with invalid_frequencies when population Y does not sum to one", () => {
    const result = runGeneticDistanceNei({
      px1: 0.5,
      px2: 0.5,
      py1: 1,
      py2: 0.4,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("invalid_frequencies");
  });
  it("errors with no_shared_alleles when no alleles are shared", () => {
    const result = runGeneticDistanceNei({
      px1: 0,
      px2: 1,
      py1: 1,
      py2: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("no_shared_alleles");
  });
  it("accepts harmless floating-point sum noise", () =>
    expect(
      runGeneticDistanceNei({
        px1: 0.1 + 0.2,
        px2: 0.7,
        py1: 0.4,
        py2: 0.6,
      }).ok,
    ).toBe(true));
  it("rejects negative frequencies", () =>
    expect(
      runGeneticDistanceNei({ px1: -0.5, px2: 1.5, py1: 0.5, py2: 0.5 }).ok,
    ).toBe(false));
});

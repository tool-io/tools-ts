import { describe, expect, it } from "vitest";
import {
  erf,
  erfc,
  inverseNormalCdf,
  logGamma,
  lowerRegularizedGamma,
  matchCandidate,
  meanAbsoluteConsecutiveDelta,
  medianFromSorted,
  normalCdf,
  percentileFromSorted,
} from "./stats.js";

describe("core statistics helpers", () => {
  it("computes medians for odd and even counts", () => {
    expect(medianFromSorted([1, 2, 3])).toBe(2);
    expect(medianFromSorted([1, 2, 3, 4])).toBe(2.5);
    expect(medianFromSorted([7])).toBe(7);
  });

  it("uses nearest-rank percentiles", () => {
    expect(percentileFromSorted([10, 20, 30, 40], 50)).toBe(20);
    expect(percentileFromSorted([10, 20, 30, 40], 100)).toBe(40);
    expect(percentileFromSorted([5], 10)).toBe(5);
  });

  it("averages absolute consecutive deltas", () => {
    expect(meanAbsoluteConsecutiveDelta([])).toBeNull();
    expect(meanAbsoluteConsecutiveDelta([4])).toBeNull();
    expect(meanAbsoluteConsecutiveDelta([12, 15, 12, 18, 12])).toBe(4.5);
  });

  it("matches candidates within tolerance", () => {
    const rates = [125, 250, 500, 1000];
    expect(matchCandidate(125, rates, 0.02)).toBe(125);
    expect(matchCandidate(124, rates, 0.02)).toBe(125);
    expect(matchCandidate(25, rates, 0.02)).toBeNull();
    expect(matchCandidate(999, [1000], 0.001)).toBe(1000);
    expect(matchCandidate(998, [1000], 0.001)).toBeNull();
  });
});

describe("portable numeric functions", () => {
  it("computes the error function across regimes", () => {
    expect(erf(0)).toBe(0);
    expect(Math.abs(erf(1) - 0.8427007929497149)).toBeLessThan(5e-13);
    expect(Math.abs(erf(-0.5) + 0.5204998778130465)).toBeLessThan(5e-13);
    expect(Math.abs(erf(3) - 0.9999779095030014)).toBeLessThan(5e-13);
  });

  it("keeps erf and erfc complementary in both series and fraction regimes", () => {
    for (const value of [-4, -2, -0.5, 0, 0.5, 1.5, 2, 2.5, 6])
      expect(Math.abs(erf(value) + erfc(value) - 1)).toBeLessThan(1e-12);
    for (const value of [-4, -0.5, 0.5, 6])
      expect(Math.abs(erfc(-value) + erfc(value) - 2)).toBeLessThan(1e-15);
  });

  it("evaluates the standard normal distribution", () => {
    expect(normalCdf(0)).toBe(0.5);
    expect(
      Math.abs(normalCdf(1.959963984540054) - 0.975),
    ).toBeLessThan(1e-9);
    for (const value of [-3, -1, 0, 0.25, 4])
      expect(normalCdf(-value)).toBeCloseTo(1 - normalCdf(value), 14);
    let previous = Number.NEGATIVE_INFINITY;
    for (let z = -5; z <= 5; z += 0.5) {
      const cumulative = normalCdf(z);
      expect(cumulative).toBeGreaterThan(previous);
      previous = cumulative;
    }
  });

  it("inverts the standard normal distribution", () => {
    expect(inverseNormalCdf(0.5)).toBe(0);
    expect(
      Math.abs(inverseNormalCdf(0.975) - 1.959963984540054),
    ).toBeLessThan(1e-9);
    for (const probability of [
      0.0005, 0.01, 0.025, 0.3, 0.5, 0.7, 0.95, 0.9995,
    ]) {
      const quantile = inverseNormalCdf(probability);
      expect(normalCdf(quantile)).toBeCloseTo(probability, 11);
    }
    for (const invalid of [0, 1, -0.5, 1.5])
      expect(Number.isNaN(inverseNormalCdf(invalid))).toBe(true);
  });

  it("computes log-gamma and respects the gamma recurrence", () => {
    expect(Math.abs(logGamma(1))).toBeLessThan(1e-12);
    expect(Math.abs(logGamma(0.5) - 0.5723649429247001)).toBeLessThan(1e-12);
    for (const value of [0.3, 0.5, 1.7, 4.2])
      expect(logGamma(value + 1) - logGamma(value)).toBeCloseTo(
        Math.log(value),
        12,
      );
    expect(Number.isNaN(logGamma(-1))).toBe(true);
    expect(Number.isFinite(logGamma(-0.5))).toBe(true);
  });

  it("evaluates the regularized lower incomplete gamma function", () => {
    expect(lowerRegularizedGamma(0.5, 0)).toBe(0);
    for (const value of [0.5, 2, 9]) {
      const expected = erf(Math.sqrt(value));
      expect(Math.abs(lowerRegularizedGamma(0.5, value) - expected))
        .toBeLessThan(1e-12);
    }
    expect(
      Math.abs(lowerRegularizedGamma(1, 2) - (1 - Math.exp(-2))),
    ).toBeLessThan(1e-13);
    expect(lowerRegularizedGamma(2.5, 30)).toBeGreaterThan(1 - 2e-11);
    // Chi-square survival anchors: df = 1 at the 0.05 critical value, df = 2 closed form.
    expect(
      Math.abs(
        1 -
          lowerRegularizedGamma(0.5, 3.841458820694123 / 2) -
          0.05,
      ),
    ).toBeLessThan(1e-9);
    expect(
      Math.abs(
        1 - lowerRegularizedGamma(1, 3.5) - Math.exp(-3.5),
      ),
    ).toBeLessThan(1e-13);
    for (const [shape, value] of [
      [0, 1],
      [-2, 1],
      [1, -1],
    ])
      expect(Number.isNaN(lowerRegularizedGamma(shape, value))).toBe(true);
  });
});

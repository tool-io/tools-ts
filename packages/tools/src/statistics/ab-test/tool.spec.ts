import { describe, expect, it } from "vitest";
import {
  abTestExample,
  calculateAbTest,
  runAbTest,
} from "./tool.js";

describe("A/B test result analyzer", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runAbTest(abTestExample.input)).toEqual({
      ok: true,
      output: abTestExample.output,
    });
  });

  it("is symmetric for identical variants", () => {
    const output = calculateAbTest({
      conversionsA: 50,
      conversionsB: 50,
      visitorsA: 900,
      visitorsB: 900,
    });
    expect(output.difference).toBe(0);
    expect(output.zScore).toBe(0);
    expect(output.pValue).toBe(1);
    expect(output.significant).toBe(false);
    expect(output.ciLow).toBeLessThanOrEqual(0);
    expect(output.ciHigh).toBeGreaterThanOrEqual(0);
  });

  it("flags a clear lift as significant", () => {
    const output = calculateAbTest({
      conversionsA: 100,
      conversionsB: 200,
      visitorsA: 1000,
      visitorsB: 1000,
    });
    expect(output.significant).toBe(true);
    expect(output.pValue).toBeLessThan(0.001);
  });

  it("widens the interval as the confidence level rises", () => {
    const lenient = calculateAbTest({
      confidenceLevel: 0.8,
      conversionsA: 110,
      conversionsB: 130,
      visitorsA: 1000,
      visitorsB: 1000,
    });
    const strict = calculateAbTest({
      confidenceLevel: 0.999,
      conversionsA: 110,
      conversionsB: 130,
      visitorsA: 1000,
      visitorsB: 1000,
    });
    expect(strict.ciHigh - strict.ciLow).toBeGreaterThan(
      lenient.ciHigh - lenient.ciLow,
    );
  });

  it("handles fully saturated variants", () => {
    const output = calculateAbTest({
      conversionsA: 0,
      conversionsB: 500,
      visitorsA: 500,
      visitorsB: 500,
    });
    expect(output.significant).toBe(true);
    expect(output.rateA).toBe(0);
    expect(output.rateB).toBe(1);
    expect(output.ciHigh).toBe(1);
    expect(output.pValue).toBeLessThan(1e-100);
  });

  it("rejects impossible conversion counts through execution", () => {
    const result = runAbTest({
      conversionsA: 1001,
      conversionsB: 10,
      visitorsA: 1000,
      visitorsB: 1000,
    });
    expect(result).toMatchObject({
      error: {
        code: "invalid_input",
        issues: [
          { code: "conversions_exceed_visitors", field: "conversionsA" },
        ],
      },
      ok: false,
    });
  });

  it("enforces schema constraints during execution", () => {
    expect(
      runAbTest({
        conversionsA: 1,
        conversionsB: 1,
        visitorsA: 0,
        visitorsB: 5,
      }).ok,
    ).toBe(false);
    expect(
      runAbTest({
        confidenceLevel: 1.5,
        conversionsA: 1,
        conversionsB: 1,
        visitorsA: 2,
        visitorsB: 2,
      }).ok,
    ).toBe(false);
  });
});

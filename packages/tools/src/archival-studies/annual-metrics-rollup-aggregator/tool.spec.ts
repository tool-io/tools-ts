import { describe, expect, it } from "vitest";
import {
  annualMetricsRollupAggregatorExample,
  calculateAnnualMetricsRollupAggregator,
  runAnnualMetricsRollupAggregator,
} from "./tool.js";

describe("archival-studies/annual-metrics-rollup-aggregator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runAnnualMetricsRollupAggregator(
        annualMetricsRollupAggregatorExample.input,
      ),
    ).toEqual({
      ok: true,
      output: annualMetricsRollupAggregatorExample.output,
    });
  });

  it("computes total, mean, min, max via independent sum", () => {
    const input = { periodValues: [2, 4, 4, 4, 5, 5, 7, 9] as const };
    // Hand: total 40, mean 5, min 2, max 9, count 8
    const result = calculateAnnualMetricsRollupAggregator({
      periodValues: [...input.periodValues],
    });
    expect(result).toEqual({
      periodCount: 8,
      total: 40,
      mean: 5,
      minimum: 2,
      maximum: 9,
    });
    expect(
      runAnnualMetricsRollupAggregator({
        periodValues: [...input.periodValues],
      }),
    ).toEqual({
      ok: true,
      output: { periodCount: 8, total: 40, mean: 5, minimum: 2, maximum: 9 },
    });
  });

  it("property: total = sum, mean = total/count, min ≤ mean ≤ max, count = length", () => {
    const values = [120, 180, 150, 210] as const;
    const result = calculateAnnualMetricsRollupAggregator({
      periodValues: [...values],
    });
    const total = values.reduce((a, b) => a + b, 0);
    expect(result.total).toBe(total);
    expect(result.mean).toBeCloseTo(total / values.length, 12);
    expect(result.minimum).toBe(Math.min(...values));
    expect(result.maximum).toBe(Math.max(...values));
    expect(result.periodCount).toBe(values.length);
    expect(result.minimum).toBeLessThanOrEqual(result.mean);
    expect(result.mean).toBeLessThanOrEqual(result.maximum);
  });

  it("rolls up a single period to itself and handles negative zero", () => {
    const single = calculateAnnualMetricsRollupAggregator({
      periodValues: [7.5],
    });
    expect(single.total).toBe(7.5);
    expect(single.mean).toBe(7.5);
    expect(single.minimum).toBe(single.maximum);
    const negZero = calculateAnnualMetricsRollupAggregator({
      periodValues: [-0],
    });
    expect(Object.is(negZero.total, -0)).toBe(false);
    expect(negZero.total).toBe(0);
  });

  it("rejects empty list via runner and direct with field/code", () => {
    const runner = runAnnualMetricsRollupAggregator({ periodValues: [] });
    expect(runner.ok).toBe(false);
    if (!runner.ok) {
      expect(runner.error.issues[0].field).toBe("periodValues");
      expect(runner.error.issues[0].code).toBe("invalid_periods");
    }
    let e: unknown = null;
    try {
      calculateAnnualMetricsRollupAggregator({ periodValues: [] });
    } catch (err) {
      e = err;
    }
    expect((e as { code: string }).code).toBe("invalid_periods");
  });

  it("rejects non-finite period values via runner and direct", () => {
    const runner = runAnnualMetricsRollupAggregator({
      periodValues: [1, Number.NaN, 3],
    });
    expect(runner.ok).toBe(false);
    if (!runner.ok) expect(runner.error.issues[0].field).toBe("periodValues");
    let e: unknown = null;
    try {
      calculateAnnualMetricsRollupAggregator({
        periodValues: [1, Number.POSITIVE_INFINITY, 3],
      });
    } catch (err) {
      e = err;
    }
    expect((e as { code: string }).code).toBe("invalid_period_value");
  });

  it("reports overflow for sum beyond finite range", () => {
    let e: unknown = null;
    try {
      calculateAnnualMetricsRollupAggregator({
        periodValues: [Number.MAX_VALUE, Number.MAX_VALUE],
      });
    } catch (err) {
      e = err;
    }
    expect((e as { code: string }).code).toBe("numeric_overflow");
    const runner = runAnnualMetricsRollupAggregator({
      periodValues: [Number.MAX_VALUE, Number.MAX_VALUE],
    });
    expect(runner.ok).toBe(false);
    if (!runner.ok)
      expect(runner.error.issues[0].code).toBe("numeric_overflow");
  });

  it("rejects missing, wrong type, unknown, non-object", () => {
    expect(runAnnualMetricsRollupAggregator({} as any).ok).toBe(false);
    expect(
      runAnnualMetricsRollupAggregator({ periodValues: "120,180" } as any).ok,
    ).toBe(false);
    const unk = runAnnualMetricsRollupAggregator({
      periodValues: [1, 2],
      extra: 1,
    } as any);
    expect(unk.ok).toBe(false);
    if (!unk.ok) expect(unk.error.issues[0].code).toBe("unknown_field");
    expect(runAnnualMetricsRollupAggregator(null as any).ok).toBe(false);
    if (!runAnnualMetricsRollupAggregator(null as any).ok) {
      expect(
        (runAnnualMetricsRollupAggregator(null as any) as any).error.issues[0]
          .code,
      ).toBe("object_required");
    }
  });
});

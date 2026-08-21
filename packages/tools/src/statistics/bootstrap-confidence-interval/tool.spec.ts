import { describe, expect, it } from "vitest";
import {
  bootstrapConfidenceIntervalExample,
  calculateBootstrapConfidenceInterval,
} from "./tool.js";

describe("bootstrap confidence interval", () => {
  it("publishes an executable example", () => {
    expect(
      calculateBootstrapConfidenceInterval(
        bootstrapConfidenceIntervalExample.input,
      ).ok,
    ).toBe(true);
  });

  it("returns a degenerate interval for a constant sample", () => {
    expect(
      calculateBootstrapConfidenceInterval({
        resamples: 100,
        values: [4, 4, 4],
      }),
    ).toMatchObject({
      ok: true,
      output: { estimate: 4, high: 4, level: 0.95, low: 4 },
    });
  });

  it("is deterministic for an explicit seed", () => {
    const input = {
      level: 0.9,
      resamples: 200,
      seed: 42,
      values: [1, 2, 4, 8],
    };
    const progress: unknown[] = [];
    const first = calculateBootstrapConfidenceInterval(input, {
      reportProgress: (event) => progress.push(event),
    });
    expect(first).toEqual(calculateBootstrapConfidenceInterval(input));
    expect(progress.length).toBeGreaterThan(0);
  });

  it("brackets the point estimate and widens with the level", () => {
    const narrow = calculateBootstrapConfidenceInterval({
      level: 0.6,
      resamples: 400,
      seed: 7,
      values: [1, 2, 3, 4],
    });
    const wide = calculateBootstrapConfidenceInterval({
      level: 0.99,
      resamples: 400,
      seed: 7,
      values: [1, 2, 3, 4],
    });
    if (!narrow.ok || !wide.ok) throw new Error("Expected success.");
    expect(narrow.output.low).toBeLessThanOrEqual(narrow.output.estimate);
    expect(narrow.output.estimate).toBeLessThanOrEqual(narrow.output.high);
    expect(wide.output.high - wide.output.low).toBeGreaterThanOrEqual(
      narrow.output.high - narrow.output.low,
    );
  });

  it("supports the median statistic", () => {
    const result = calculateBootstrapConfidenceInterval({
      resamples: 150,
      seed: 5,
      statistic: "median",
      values: [2, 3, 5, 7, 11],
    });
    expect(result).toMatchObject({
      ok: true,
      output: { estimate: 5, statistic: "median" },
    });
  });

  it("rejects too few resamples and invalid levels", () => {
    expect(
      calculateBootstrapConfidenceInterval({ resamples: 1, values: [1, 2] }),
    ).toMatchObject({
      error: { code: "invalid_input" },
      ok: false,
    });
    for (const level of [0, 1, 1.5])
      expect(
        calculateBootstrapConfidenceInterval({
          level,
          resamples: 50,
          values: [1, 2],
        }).ok,
      ).toBe(false);
  });

  it("reports bounded progress through completion", () => {
    const progress: { completed: number; total?: number }[] = [];
    const result = calculateBootstrapConfidenceInterval(
      { resamples: 250, seed: 42, values: [1, 2, 4, 8] },
      { reportProgress: (event) => progress.push(event) },
    );

    expect(result.ok).toBe(true);
    expect(progress[0]).toMatchObject({ completed: 0, total: 250 });
    expect(progress.at(-1)).toMatchObject({ completed: 250, total: 250 });
    expect(progress.length).toBeLessThanOrEqual(102);
  });

  it("stops when cancellation is requested during resampling", () => {
    const signal = { aborted: false };
    let randomCalls = 0;
    const result = calculateBootstrapConfidenceInterval(
      { resamples: 1_000, values: [1, 2, 4, 8] },
      {
        random: () => {
          randomCalls += 1;
          return 0.5;
        },
        reportProgress: ({ completed }) => {
          if (completed >= 10) signal.aborted = true;
        },
        signal,
      },
    );

    expect(result).toMatchObject({
      error: { code: "execution_cancelled" },
      ok: false,
    });
    expect(randomCalls).toBeLessThan(1_000 * 4);
  });
});

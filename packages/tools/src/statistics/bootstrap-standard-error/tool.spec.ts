import { describe, expect, it } from "vitest";
import {
  bootstrapStandardErrorExample,
  calculateBootstrapStandardError,
} from "./tool.js";

describe("bootstrap standard error", () => {
  it("returns zero for a constant sample", () => {
    expect(
      calculateBootstrapStandardError({ resamples: 100, values: [4, 4, 4] }),
    ).toMatchObject({ ok: true, output: { estimate: 4, standardError: 0 } });
  });

  it("is deterministic for an explicit seed", () => {
    const input = { resamples: 200, seed: 42, values: [1, 2, 4, 8] };
    const progress: unknown[] = [];
    expect(
      calculateBootstrapStandardError(input, {
        reportProgress: (event) => progress.push(event),
      }),
    ).toEqual(calculateBootstrapStandardError(input));
    expect(progress.length).toBeGreaterThan(0);
  });

  it("publishes an executable example", () => {
    expect(
      calculateBootstrapStandardError(bootstrapStandardErrorExample.input).ok,
    ).toBe(true);
  });

  it("rejects too few resamples", () => {
    expect(
      calculateBootstrapStandardError({ resamples: 1, values: [1, 2] }),
    ).toMatchObject({ error: { code: "invalid_input" }, ok: false });
  });

  it("reports bounded progress through completion", () => {
    const progress: { completed: number; total?: number }[] = [];
    const result = calculateBootstrapStandardError(
      { resamples: 250, seed: 42, values: [1, 2, 4, 8] },
      { reportProgress: (event) => progress.push(event) },
    );

    expect(result.ok).toBe(true);
    expect(progress[0]).toMatchObject({ completed: 0, total: 250 });
    expect(progress.at(-1)).toMatchObject({
      completed: 250,
      total: 250,
    });
    expect(progress.length).toBeLessThanOrEqual(102);
  });

  it("stops when cancellation is requested during resampling", () => {
    const signal = { aborted: false };
    let randomCalls = 0;
    const result = calculateBootstrapStandardError(
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

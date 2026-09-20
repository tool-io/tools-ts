import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  heavyTailComparisonExperimentExample as example,
  calculateHeavyTailComparisonExperiment,
} from "./tool.js";

describe("Random Heavy-Tail Comparison Experiment Generator", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculateHeavyTailComparisonExperiment(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(matchesToolJsonSchema(example.input, tool.inputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, tool.outputSchema)).toBe(true);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("is immutable and reproducible, with explicit seed precedence", () => {
    const input = JSON.parse(
      JSON.stringify(example.input),
    ) as typeof example.input;
    expect(tool.execute(input)).toEqual(tool.execute(example.input));
    expect(input).toEqual(example.input);
    expect(
      tool.execute(example.input, {
        random: () => {
          throw new Error("Seed must win");
        },
      }),
    ).toEqual({ ok: true, output: example.output });
    const { seed, ...unseeded } = example.input;
    expect(tool.execute(unseeded)).toEqual(tool.execute(unseeded));
  });
  it("rejects invalid or failing injected sources", () => {
    const { seed, ...input } = example.input;
    for (const value of [-0.1, 1, NaN, Infinity])
      expect(tool.execute(input, { random: () => value })).toMatchObject({
        ok: false,
        error: { issues: [{ field: "random", code: "invalid_random_source" }] },
      });
    expect(
      tool.execute(input, {
        random: () => {
          throw new Error("Failed");
        },
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "random", code: "invalid_random_source" }] },
    });
  });
  it("rejects malformed data without coercion", () => {
    expect(tool.execute(null)).toMatchObject({ ok: false });
    expect(tool.execute({})).toMatchObject({ ok: false });
    expect(tool.execute({ ...example.input, extra: 1 })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "extra", code: "unknown_field" }] },
    });
    expect(tool.execute({ ...example.input, seed: NaN })).toMatchObject({
      ok: false,
    });
  });
  it("computes ordered empirical quantiles and original-sample extremes without theoretical moment claims", () => {
    const result = tool.execute({
      ...example.input,
      count: 99,
      percentiles: [0, 25, 50, 75, 100],
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    for (const batch of [result.output.cauchy, result.output.pareto]) {
      const ordered = [...batch.samples].sort((a, b) => a - b);
      expect(batch.samples).toHaveLength(99);
      expect(batch.minimum).toBe(ordered[0]);
      expect(batch.maximum).toBe(ordered.at(-1));
      expect(batch.median).toBeCloseTo(ordered[49], 10);
      expect(batch.quantiles[0].value).toBeCloseTo(batch.minimum, 10);
      expect(batch.quantiles.at(-1)?.value).toBeCloseTo(batch.maximum, 10);
      for (let i = 1; i < batch.quantiles.length; i += 1)
        expect(batch.quantiles[i].value).toBeGreaterThanOrEqual(
          batch.quantiles[i - 1].value,
        );
      expect(batch).not.toHaveProperty("mean");
      expect(batch).not.toHaveProperty("variance");
    }
    expect(result.output.pareto.samples.every((value) => value >= 1)).toBe(
      true,
    );
  });
  it("supports one observation and reports actual numerical overflow", () => {
    const result = tool.execute({ ...example.input, count: 1 });
    expect(result.ok).toBe(true);
    if (result.ok)
      for (const batch of [result.output.cauchy, result.output.pareto]) {
        expect(batch.minimum).toBe(batch.maximum);
        expect(batch.median).toBeCloseTo(batch.samples[0], 12);
      }
    expect(
      tool.execute({ ...example.input, paretoShape: Number.MIN_VALUE }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ code: "sampler_failed" }] },
    });
  });
  it("rejects invalid shapes, scales, quantile ranges, and resource excess", () => {
    for (const change of [
      { cauchyScale: 0 },
      { paretoShape: -1 },
      { paretoScale: 0 },
      { count: 2049 },
      { percentiles: [-1] },
      { percentiles: [101] },
      { percentiles: [50, 50] },
    ])
      expect(tool.execute({ ...example.input, ...change })).toMatchObject({
        ok: false,
      });
  });
});

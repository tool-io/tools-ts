import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  overdispersedCountExperimentExample as example,
  calculateOverdispersedCountExperiment,
} from "./tool.js";

describe("Random Overdispersed Count Experiment Generator", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculateOverdispersedCountExperiment(example.input)).toEqual({
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
  it("keeps integer support, exact batch sizes, separate streams, and analytic model variance", () => {
    const result = tool.execute({
      ...example.input,
      trials: 10,
      alpha: 2,
      beta: 3,
      count: 128,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.output.model.meanProbability).toBeCloseTo(0.4, 14);
    expect(result.output.binomial.theoreticalVariance).toBeCloseTo(2.4, 12);
    expect(result.output.betaBinomial.theoreticalVariance).toBeCloseTo(6, 12);
    expect(result.output.binomial.samplerSeed).not.toBe(
      result.output.betaBinomial.samplerSeed,
    );
    for (const batch of [result.output.binomial, result.output.betaBinomial]) {
      expect(batch.samples).toHaveLength(128);
      expect(
        batch.samples.every(
          (value) => Number.isInteger(value) && value >= 0 && value <= 10,
        ),
      ).toBe(true);
      const mean =
        batch.samples.reduce((sum, value) => sum + value, 0) /
        batch.samples.length;
      const variance =
        batch.samples.reduce((sum, value) => sum + (value - mean) ** 2, 0) /
        batch.samples.length;
      expect(batch.observedMean).toBeCloseTo(mean, 12);
      expect(batch.observedVariance).toBeCloseTo(variance, 12);
    }
  });
  it("handles zero trials and count-one population summaries", () => {
    const result = tool.execute({ ...example.input, trials: 0, count: 1 });
    expect(result).toMatchObject({
      ok: true,
      output: {
        binomial: { samples: [0], observedVariance: 0, theoreticalVariance: 0 },
        betaBinomial: {
          samples: [0],
          observedVariance: 0,
          theoreticalVariance: 0,
        },
      },
    });
  });
  it("rejects work excess, nonpositive shapes, and numerical sampler failure", () => {
    for (const change of [
      { trials: -1 },
      { count: 0 },
      { trials: 1000000, count: 2 },
      { alpha: 0 },
      { beta: -1 },
      { count: 513 },
    ])
      expect(tool.execute({ ...example.input, ...change })).toMatchObject({
        ok: false,
      });
    expect(
      tool.execute({
        ...example.input,
        alpha: Number.MIN_VALUE,
        beta: Number.MIN_VALUE,
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ code: "sampler_failed" }] },
    });
  });
});

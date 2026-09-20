import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  bootstrapIntervalExperimentExample as example,
  calculateBootstrapIntervalExperiment,
} from "./tool.js";

describe("Random Bootstrap Interval Experiment Generator", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculateBootstrapIntervalExperiment(example.input)).toEqual({
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
  it("matches a hand-worked two-sided nearest-rank resampling fixture", () => {
    const draws = [
      Math.exp(-0.5),
      0,
      Math.exp(-0.5),
      0.5,
      0.1,
      0.1,
      0.1,
      0.9,
      0.9,
      0.9,
      0.9,
      0.1,
    ];
    let cursor = 0;
    const { seed, ...base } = example.input;
    const result = tool.execute(
      { ...base, sampleCount: 2 },
      { random: () => draws[cursor++] },
    );
    expect(result).toMatchObject({
      ok: true,
      output: {
        experiments: [
          {
            values: [1, -1],
            interval: { estimate: 0, low: -1, high: 0, confidenceLevel: 0.5 },
          },
        ],
      },
    });
    expect(cursor).toBe(12);
  });
  it("supports median statistics and deterministic zero-spread source datasets", () => {
    const result = tool.execute({
      ...example.input,
      datasetCount: 3,
      statistic: "median",
      mean: 4,
      standardDeviation: 0,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.output.experiments).toHaveLength(3);
    for (const experiment of result.output.experiments)
      expect(experiment).toEqual({
        values: [4, 4, 4],
        interval: {
          estimate: 4,
          low: 4,
          high: 4,
          confidenceLevel: 0.5,
          resamples: 4,
          statistic: "median",
        },
      });
  });
  it("rejects work excess, unsupported statistics, and unrepresentable confidence tails", () => {
    for (const change of [
      { datasetCount: 32, sampleCount: 128, resamples: 4096 },
      { sampleCount: 1 },
      { standardDeviation: -1 },
      { statistic: "mode" },
      { confidenceLevel: 0 },
      { confidenceLevel: 1 },
      { confidenceLevel: Number.MIN_VALUE },
      { confidenceLevel: 1 - Number.EPSILON / 2 },
    ])
      expect(tool.execute({ ...example.input, ...change })).toMatchObject({
        ok: false,
      });
    expect(
      tool.execute({
        ...example.input,
        mean: Number.MAX_VALUE,
        standardDeviation: 0,
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ code: "numeric_overflow" }] },
    });
  });
});

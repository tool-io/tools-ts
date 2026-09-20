import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  densityClusteringNoiseBenchmarkExample as example,
  calculateDensityClusteringNoiseBenchmark,
} from "./tool.js";

describe("Random Density Clustering Noise Benchmark Generator", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculateDensityClusteringNoiseBenchmark(example.input)).toEqual({
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
  it("retains duplicate-group zero distances, component starts and an isolated noise point", () => {
    const result = tool.execute(example.input);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const out = result.output;
    expect(out.ordering.map((row) => row.index)).toEqual([0, 4, 1, 3, 2]);
    expect(
      out.ordering.filter((row) => row.reachabilityDistance === null),
    ).toHaveLength(3);
    expect(out.ordering.filter((row) => row.injectedNoise)).toEqual([
      {
        coreDistance: null,
        index: 2,
        point: [8.865474648308009],
        reachabilityDistance: null,
        sourceLabel: -1,
        injectedNoise: true,
      },
    ]);
    expect(out.ordering.map((row) => row.index).sort((a, b) => a - b)).toEqual([
      0, 1, 2, 3, 4,
    ]);
  });
  it("does not label a supplied noise-origin point algorithmically noisy when it lies inside a dense group", () => {
    const result = tool.execute({
      ...example.input,
      noiseLower: [0],
      noiseUpper: [0],
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const injected = result.output.ordering.find((row) => row.injectedNoise);
    if (!injected)
      throw new Error("Expected the one generated noise-origin point.");
    expect(injected.point).toEqual([0]);
    expect(injected.coreDistance).toBe(0);
    expect(
      result.output.sourceLabels.filter((label) => label === -1),
    ).toHaveLength(1);
  });
  it("preserves nonzero Gaussian groups and rejects shape, neighborhood and representability failures", () => {
    expect(
      tool.execute({
        ...example.input,
        clusters: [{ center: [0], standardDeviation: 0.3, pointCount: 6 }],
        noiseCount: 0,
      }),
    ).toMatchObject({ ok: true });
    for (const change of [
      { noiseLower: [9], noiseUpper: [8] },
      { minimumPoints: 6 },
      { noiseUpper: [8, 9] },
      { epsilon: 0 },
    ])
      expect(tool.execute({ ...example.input, ...change })).toMatchObject({
        ok: false,
      });
    expect(
      tool.execute({
        ...example.input,
        clusters: [
          { center: [-Number.MAX_VALUE], standardDeviation: 0, pointCount: 2 },
          { center: [Number.MAX_VALUE], standardDeviation: 0, pointCount: 2 },
        ],
        noiseCount: 0,
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ code: "distance_overflow" }] },
    });
  });
});

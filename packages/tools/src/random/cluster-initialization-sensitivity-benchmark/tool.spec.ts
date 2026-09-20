import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  clusterInitializationSensitivityBenchmarkExample as example,
  calculateClusterInitializationSensitivityBenchmark,
} from "./tool.js";

describe("Random Cluster Initialization Sensitivity Benchmark Generator", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(
      calculateClusterInitializationSensitivityBenchmark(example.input),
    ).toEqual({ ok: true, output: example.output });
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
  it("retains independently hand-computable 128 versus 8 starting-center costs", () => {
    const result = tool.execute(example.input);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const out = result.output;
    expect(
      out.runs.map((run) =>
        Math.round(run.normalizedSse * out.distanceScale ** 2),
      ),
    ).toEqual([128, 8, 8]);
    for (const run of out.runs) {
      expect(new Set(run.centroidIndices).size).toBe(2);
      expect(run.centroids).toEqual(
        run.centroidIndices.map((index) => out.points[index]),
      );
      const costs = out.points.map((point) =>
        Math.min(
          ...run.centroids.map((center) =>
            point.reduce(
              (sum, value, i) =>
                sum + ((value - center[i]) / out.distanceScale) ** 2,
              0,
            ),
          ),
        ),
      );
      costs.forEach((cost, i) =>
        expect(run.squaredDistances[i]).toBeCloseTo(cost, 14),
      );
    }
  });
  it("reuses one dataset for every requested initialization, including repeated seeds and duplicate-valued points", () => {
    const result = tool.execute({
      ...example.input,
      initializationSeeds: [7, 7],
      centerCount: 8,
      clusters: [{ center: [3, -4], standardDeviation: 0, pointCount: 8 }],
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.output.runs[0]).toEqual(result.output.runs[1]);
    expect(result.output.runs[0].normalizedSse).toBe(0);
    expect(new Set(result.output.runs[0].centroidIndices).size).toBe(8);
  });
  it("keeps Gaussian generating labels distinct from fitted-center choices and rejects bad shapes/work", () => {
    const result = tool.execute({
      ...example.input,
      clusters: [
        { center: [0, 0], standardDeviation: 0.3, pointCount: 4 },
        { center: [3, 4], standardDeviation: 0.2, pointCount: 4 },
      ],
    });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(
        result.output.sourceLabels.filter((label) => label === 0),
      ).toHaveLength(4);
    for (const change of [
      { centerCount: 7 },
      { initializationSeeds: [1.5] },
      {
        clusters: [
          { center: [0], standardDeviation: 1, pointCount: 1 },
          { center: [1, 2], standardDeviation: 1, pointCount: 1 },
        ],
      },
    ])
      expect(tool.execute({ ...example.input, ...change })).toMatchObject({
        ok: false,
      });
  });
});

import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  streamingMicroclusterBenchmarkExample as example,
  calculateStreamingMicroclusterBenchmark,
} from "./tool.js";

describe("Random Streaming Microcluster Benchmark Generator", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculateStreamingMicroclusterBenchmark(example.input)).toEqual({
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
  it("retains exact duplicate-point prefix counts in hand-known zero-radius clusters", () => {
    const result = tool.execute(example.input);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(
      result.output.snapshots.map((s) => s.clusters.map((c) => c.count)),
    ).toEqual([
      [1, 1],
      [2, 2],
    ]);
    for (const snapshot of result.output.snapshots) {
      expect(snapshot.clusters.reduce((sum, c) => sum + c.count, 0)).toBe(
        snapshot.throughIndex,
      );
      expect(snapshot.clusterCount).toBe(snapshot.clusters.length);
    }
  });
  it("reports grouped order explicitly and preserves batch boundaries without pretending to carry core state", () => {
    const result = tool.execute({
      ...example.input,
      shuffle: false,
      batchSizes: [1, 1, 2],
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.output.points).toEqual([[0], [0], [10], [10]]);
    expect(result.output.sourceLabels).toEqual([0, 0, 1, 1]);
    expect(result.output.snapshots.map((s) => s.pointCount)).toEqual([1, 2, 4]);
    expect(result.output.snapshots[1].clusters).toEqual([
      { centroid: [0], count: 2 },
    ]);
  });
  it("retains finite noisy groups and rejects misaligned or excessive prefix work", () => {
    const result = tool.execute({
      ...example.input,
      clusters: [{ center: [0, 1], standardDeviation: 0.2, pointCount: 4 }],
    });
    expect(result.ok).toBe(true);
    for (const change of [
      { batchSizes: [1, 2] },
      { batchSizes: [0, 4] },
      { normalizedRadiusThreshold: -1 },
    ])
      expect(tool.execute({ ...example.input, ...change })).toMatchObject({
        ok: false,
      });
    expect(
      tool.execute({
        ...example.input,
        clusters: [{ center: [0], standardDeviation: 0, pointCount: 128 }],
        batchSizes: [128],
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "batchSizes", code: "resource_limit" }] },
    });
  });
});

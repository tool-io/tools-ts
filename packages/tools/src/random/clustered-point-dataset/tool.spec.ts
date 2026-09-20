import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  clusteredPointDatasetExample as example,
  calculateClusteredPointDataset,
} from "./tool.js";

describe("Random Clustered Point Dataset Generator", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculateClusteredPointDataset(example.input)).toEqual({
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
  it("has independently known zero-spread groups and exact generating labels", () => {
    const result = tool.execute({
      clusters: [
        { center: [-2], standardDeviation: 0, pointCount: 2 },
        { center: [3], standardDeviation: 0, pointCount: 3 },
      ],
      maximumIterations: 20,
      seed: 42,
    });
    if (!result.ok) throw new Error("Expected success");
    const out = result.output;
    expect(
      out.clustering.centroids.map((c) => c[0]).sort((a, b) => a - b),
    ).toEqual([-2, 3]);
    expect(out.sourceLabels.filter((label) => label === 0)).toHaveLength(2);
    expect(out.sourceLabels.filter((label) => label === 1)).toHaveLength(3);
    out.points.forEach((point, i) => {
      expect(point[0]).toBe(out.sourceLabels[i] === 0 ? -2 : 3);
      expect(out.clustering.centroids[out.clustering.labels[i]][0]).toBeCloseTo(
        point[0],
        12,
      );
    });
    expect(out.clustering.fixedPointVerified).toBe(true);
  });
  it("keeps distinct source and fitted labels and verifies each converged centroid's mean independently", () => {
    const result = tool.execute(example.input);
    if (!result.ok) throw new Error("Expected success");
    const out = result.output;
    expect(out.points).toHaveLength(6);
    expect(out.clustering.fixedPointVerified).toBe(true);
    for (let label = 0; label < 2; label += 1) {
      const group = out.points.filter(
        (_, i) => out.clustering.labels[i] === label,
      );
      for (let axis = 0; axis < 2; axis += 1)
        expect(out.clustering.centroids[label][axis]).toBeCloseTo(
          group.reduce((sum, p) => sum + p[axis], 0) / group.length,
          12,
        );
    }
  });
  it("rejects impossible realized cluster counts, ragged centers and excessive work", () => {
    expect(
      tool.execute({
        clusters: [
          { center: [0], standardDeviation: 0, pointCount: 2 },
          { center: [0], standardDeviation: 0, pointCount: 2 },
        ],
        maximumIterations: 20,
        seed: 42,
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "clusters", code: "clustering_failed" }] },
    });
    expect(
      tool.execute({
        clusters: [
          { center: [0], standardDeviation: 1, pointCount: 2 },
          { center: [0, 1], standardDeviation: 1, pointCount: 2 },
        ],
        maximumIterations: 20,
      }),
    ).toMatchObject({
      ok: false,
      error: {
        issues: [
          { field: "clusters", code: "inconsistent_cluster_dimensions" },
        ],
      },
    });
    expect(
      tool.execute({
        ...example.input,
        clusters: [
          { ...example.input.clusters[0], pointCount: 128 },
          { ...example.input.clusters[1], pointCount: 128 },
        ],
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "clusters", code: "resource_limit" }] },
    });
  });
});

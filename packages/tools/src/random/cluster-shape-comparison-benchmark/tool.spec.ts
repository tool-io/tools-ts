import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  clusterShapeComparisonBenchmarkExample as example,
  calculateClusterShapeComparisonBenchmark,
} from "./tool.js";

describe("Random Cluster Shape Comparison Benchmark Generator", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculateClusterShapeComparisonBenchmark(example.input)).toEqual({
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
  it("has hand-known one-center and all-neighbor means for the same nontrivial point set", () => {
    const result = tool.execute(example.input);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const out = result.output,
      average = [0, 1].map(
        (d) =>
          out.points.reduce(
            (sum, point) => sum + point[d] / out.distanceScale,
            0,
          ) / out.points.length,
      );
    expect(out.runs[0].kMeans.centroids).toEqual([average]);
    expect(out.runs[0].meanShift.modes).toEqual([average]);
    out.points.forEach((point, i) => {
      if (out.sourceLabels[i] === 1)
        expect(Math.hypot(point[0] + 4, point[1])).toBeCloseTo(2, 12);
    });
  });
  it("preserves source counts and models compact and rotated elongated shapes without treating labels as truth", () => {
    const result = tool.execute({
      ...example.input,
      shapes: [
        {
          kind: "compact",
          center: [0, 0],
          pointCount: 4,
          rotationDegrees: 0,
          standardDeviation: 0.2,
        },
        {
          kind: "elongated",
          center: [4, 0],
          pointCount: 4,
          rotationDegrees: 90,
          majorDeviation: 1,
          minorDeviation: 0.1,
        },
      ],
      settings: [{ centerCount: 2, normalizedBandwidth: 3 }],
      maximumIterations: 10,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(
      result.output.sourceLabels.filter((label) => label === 0),
    ).toHaveLength(4);
    expect(result.output.runs[0].kMeans.labels).toHaveLength(8);
    expect(result.output.runs[0].meanShift.labels).toHaveLength(8);
  });
  it("rejects malformed variants, unordered axes, impossible centers and nonfinite generation", () => {
    for (const change of [
      {
        shapes: [
          {
            kind: "compact",
            center: [0, 0],
            pointCount: 2,
            rotationDegrees: 0,
            standardDeviation: -1,
          },
        ],
      },
      {
        shapes: [
          {
            kind: "elongated",
            center: [0, 0],
            pointCount: 2,
            rotationDegrees: 0,
            majorDeviation: 0.1,
            minorDeviation: 1,
          },
        ],
      },
      { settings: [{ centerCount: 5, normalizedBandwidth: 3 }] },
      { settings: [{ centerCount: 1, normalizedBandwidth: 0 }] },
    ])
      expect(tool.execute({ ...example.input, ...change })).toMatchObject({
        ok: false,
      });
    const input = {
      shapes: [
        {
          kind: "compact",
          center: [Number.MAX_VALUE, 0],
          pointCount: 2,
          rotationDegrees: 0,
          standardDeviation: Number.MAX_VALUE,
        },
      ],
      settings: [{ centerCount: 1, normalizedBandwidth: 3 }],
      maximumIterations: 1,
    };
    expect(tool.execute(input, { random: () => 0 })).toMatchObject({
      ok: false,
      error: { issues: [{ code: "numeric_overflow" }] },
    });
  });
});

import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  fuzzyClusterMembershipBenchmarkExample as example,
  calculateFuzzyClusterMembershipBenchmark,
} from "./tool.js";

describe("Random Fuzzy Cluster Membership Benchmark Generator", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculateFuzzyClusterMembershipBenchmark(example.input)).toEqual({
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
  it("retains hand-known last-update weights without recomputing them at the returned centroids", () => {
    const result = tool.execute(example.input);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const run = result.output.runs[0];
    expect(run.fuzzy.memberships[0]).toEqual([1, 0]);
    expect(run.fuzzy.memberships[2]).toEqual([0, 1]);
    expect(run.fuzzy.memberships[3][0]).toBeCloseTo(25 / 26, 14);
    expect(run.fuzzy.memberships[3][1]).toBeCloseTo(1 / 26, 14);
    expect(run.possibilistic.typicalities[3][0]).toBeCloseTo(25 / 26, 14);
    expect(run.possibilistic.typicalities[3][1]).toBe(0.5);
    expect(
      run.possibilistic.typicalities[0].reduce((sum, value) => sum + value, 0),
    ).toBeGreaterThan(1);
    expect(run.fuzzy.centroids[0][0]).not.toBe(0.2);
  });
  it("returns normalized membership rows and independent typicalities for every repeated setting", () => {
    const result = tool.execute({
      ...example.input,
      settings: [
        { fuzzifier: 2, typicalityScale: 1 },
        { fuzzifier: 2, typicalityScale: 1 },
      ],
      maximumIterations: 10,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.output.runs[0]).toEqual(result.output.runs[1]);
    for (const row of result.output.runs[0].fuzzy.memberships)
      expect(row.reduce((s, v) => s + v, 0)).toBeCloseTo(1, 12);
  });
  it("rejects impossible distinct centers, invalid parameters and excessive work", () => {
    expect(
      tool.execute({
        ...example.input,
        clusters: [{ center: [0], standardDeviation: 0, pointCount: 4 }],
      }),
    ).toMatchObject({ ok: false });
    for (const change of [
      { centerCount: 7 },
      { settings: [{ fuzzifier: 1, typicalityScale: 1 }] },
      { settings: [{ fuzzifier: 2, typicalityScale: 0 }] },
      { maximumIterations: 1001 },
    ])
      expect(tool.execute({ ...example.input, ...change })).toMatchObject({
        ok: false,
      });
  });
});

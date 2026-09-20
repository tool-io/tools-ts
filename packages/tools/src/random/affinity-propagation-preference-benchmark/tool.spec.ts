import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  affinityPropagationPreferenceBenchmarkExample as example,
  calculateAffinityPropagationPreferenceBenchmark,
} from "./tool.js";

describe("Random Affinity Propagation Preference Benchmark Generator", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(
      calculateAffinityPropagationPreferenceBenchmark(example.input),
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
  it("retains the hand-derived one-update fallback exemplar change without a convergence claim", () => {
    const result = tool.execute(example.input);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(
      result.output.runs.map((run) => run.result.clusters[0].exemplar),
    ).toEqual([0, 1]);
    expect(
      result.output.runs.every(
        (run) => run.result.iterations === 1 && !run.convergenceAssessed,
      ),
    ).toBe(true);
  });
  it("partitions all point indices and preserves the full requested iteration budget", () => {
    const result = tool.execute({
      ...example.input,
      maximumIterations: 30,
      clusters: [
        { center: [0, 0], standardDeviation: 0.2, pointCount: 3 },
        { center: [4, 4], standardDeviation: 0.2, pointCount: 3 },
      ],
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    for (const run of result.output.runs) {
      expect(run.result.iterations).toBe(30);
      expect(
        run.result.clusters
          .flatMap((cluster) => cluster.members)
          .sort((a, b) => a - b),
      ).toEqual([0, 1, 2, 3, 4, 5]);
      run.result.clusters.forEach((cluster, label) =>
        cluster.members.forEach((index) =>
          expect(run.labels[index]).toBe(label),
        ),
      );
    }
  });
  it("retains deterministic coincident-point fallback and rejects unsupported settings/work", () => {
    expect(
      tool.execute({
        ...example.input,
        clusters: [{ center: [7], standardDeviation: 0, pointCount: 3 }],
      }),
    ).toMatchObject({
      ok: true,
      output: {
        runs: [
          { result: { clusters: [{ exemplar: 0, members: [0, 1, 2] }] } },
          { result: { clusters: [{ exemplar: 0, members: [0, 1, 2] }] } },
        ],
      },
    });
    for (const change of [
      { clusters: [{ center: [0], standardDeviation: 0, pointCount: 1 }] },
      { settings: [{ preference: "maximum", damping: 0.5 }] },
      { settings: [{ preference: "median", damping: 1 }] },
    ])
      expect(tool.execute({ ...example.input, ...change })).toMatchObject({
        ok: false,
      });
  });
});

import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  confidenceIntervalCoverageExperimentExample as example,
  calculateConfidenceIntervalCoverageExperiment,
} from "./tool.js";

describe("Random Confidence Interval Coverage Experiment Generator", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(
      calculateConfidenceIntervalCoverageExperiment(example.input),
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
  it("agrees with the closed-form df=1 t critical value and fixed known-sigma z critical", () => {
    const result = tool.execute(example.input);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    for (const experiment of result.output.experiments) {
      const [a, b] = experiment.values,
        center = (a + b) / 2,
        sd = Math.abs(a - b) / Math.SQRT2;
      const tMargin = sd / Math.SQRT2 / Math.tan(Math.PI * 0.1),
        zMargin = 1.2815515655446004 / Math.SQRT2;
      expect(experiment.sampleMean).toBeCloseTo(center, 10);
      expect(experiment.sampleStandardDeviation).toBeCloseTo(sd, 10);
      expect(experiment.tInterval.lower).toBeCloseTo(center - tMargin, 9);
      expect(experiment.tInterval.upper).toBeCloseTo(center + tMargin, 9);
      expect(experiment.zInterval.lower).toBeCloseTo(center - zMargin, 10);
      expect(experiment.zInterval.upper).toBeCloseTo(center + zMargin, 10);
    }
    expect(result.output.coverage.tCount).toBe(
      result.output.experiments.filter(
        (experiment) => experiment.tInterval.coversMean,
      ).length,
    );
    expect(result.output.coverage.zCount).toBe(
      result.output.experiments.filter(
        (experiment) => experiment.zInterval.coversMean,
      ).length,
    );
  });
  it("keeps zero-spread coverage explicit and handles large finite constant means by normalization", () => {
    expect(
      tool.execute({ ...example.input, mean: 4, standardDeviation: 0 }),
    ).toMatchObject({
      ok: true,
      output: {
        coverage: { tCount: 2, zCount: 2, tFraction: 1, zFraction: 1 },
        experiments: [
          {
            sampleMean: 4,
            sampleStandardDeviation: 0,
            tInterval: { lower: 4, upper: 4, coversMean: true },
            zInterval: { lower: 4, upper: 4, coversMean: true },
          },
          { sampleMean: 4 },
        ],
      },
    });
    expect(
      tool.execute({
        ...example.input,
        mean: Number.MAX_VALUE,
        standardDeviation: 0,
      }),
    ).toMatchObject({
      ok: true,
      output: { coverage: { tFraction: 1, zFraction: 1 } },
    });
  });
  it("rejects unsupported confidence levels, sample counts, work excess, and actual endpoint overflow", () => {
    for (const change of [
      { confidenceLevel: 97 },
      { sampleCount: 1 },
      { standardDeviation: -1 },
      { experimentCount: 128, sampleCount: 128 },
    ])
      expect(tool.execute({ ...example.input, ...change })).toMatchObject({
        ok: false,
      });
    expect(
      tool.execute({
        ...example.input,
        mean: Number.MAX_VALUE,
        standardDeviation: Number.MAX_VALUE,
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ code: "numeric_overflow" }] },
    });
  });
});

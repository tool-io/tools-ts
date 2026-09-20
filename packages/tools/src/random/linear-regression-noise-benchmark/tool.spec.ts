import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  linearRegressionNoiseBenchmarkExample as example,
  calculateLinearRegressionNoiseBenchmark,
} from "./tool.js";

describe("Random Linear Regression Noise Benchmark Generator", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculateLinearRegressionNoiseBenchmark(example.input)).toEqual({
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
  it("recovers a noiseless varied line and keeps source parameters separate from fitted parameters", () => {
    const result = tool.execute({
      ...example.input,
      count: 9,
      minimumX: -2,
      maximumX: 2,
      intercept: -3,
      slope: 4,
      noiseStandardDeviation: 0,
    });
    expect(result).toMatchObject({
      ok: true,
      output: {
        fit: {
          status: "finite",
          result: { intercept: -3, slope: 4, rSquared: 1 },
        },
      },
    });
    if (result.ok)
      expect(result.output.fit.predictions).toEqual(
        result.output.observations.map((observation) => observation.target),
      );
    const noisy = tool.execute(example.input);
    expect(noisy.ok).toBe(true);
    if (noisy.ok)
      expect(noisy.output.fit.result?.slope).not.toBe(noisy.output.model.slope);
  });
  it("has approximately orthogonal OLS residuals after documented coefficient rounding", () => {
    const result = tool.execute({
      ...example.input,
      count: 30,
      minimumX: -5,
      maximumX: 5,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.output.fit.status).toBe("finite");
    const residuals = result.output.observations.map(
      (observation, i) =>
        observation.observed - result.output.fit.predictions[i],
    );
    expect(residuals.reduce((sum, value) => sum + value, 0)).toBeCloseTo(0, 8);
    expect(
      residuals.reduce(
        (sum, value, i) => sum + value * result.output.observations[i].x,
        0,
      ),
    ).toBeCloseTo(0, 8);
  });
  it("preserves raw targets while using the delegated12-digit coefficient for predictions", () => {
    const result = calculateLinearRegressionNoiseBenchmark({
      count: 2,
      minimumX: 0,
      maximumX: 1,
      intercept: 0,
      slope: 1.23456789012345,
      noiseStandardDeviation: 0,
      seed: 42,
    });
    if (!result.ok) throw new Error("Expected success");
    // These two points determine the source slope exactly; only the inherited fit is rounded.
    expect(result.output.model.slope).toBe(1.23456789012345);
    expect(result.output.observations).toEqual([
      { x: 0, target: 0, observed: 0 },
      { x: 1, target: 1.23456789012345, observed: 1.23456789012345 },
    ]);
    expect(result.output.fit).toEqual({
      status: "finite",
      result: { intercept: 0, slope: 1.23456789012, rSquared: 1 },
      predictions: [0, 1.23456789012],
    });
  });
  it("retains a correct horizontal fit despite overflowing predictor sums of squares", () => {
    const result = tool.execute({
      ...example.input,
      count: 2,
      minimumX: -Number.MAX_VALUE,
      maximumX: Number.MAX_VALUE,
      intercept: 1,
      slope: 0,
      noiseStandardDeviation: 0,
    });
    expect(result).toMatchObject({
      ok: true,
      output: {
        observations: [
          { x: -Number.MAX_VALUE, target: 1, observed: 1 },
          { x: Number.MAX_VALUE, target: 1, observed: 1 },
        ],
        fit: {
          status: "finite",
          result: { intercept: 1, slope: 0, rSquared: 1 },
          predictions: [1, 1],
        },
      },
    });
  });
  it("retains nonfinite delegated fits and rejects invalid grids, counts, noise, or target overflow", () => {
    // Both response and predictor now vary: covariance and variance overflow,
    // so the inherited slope is Infinity/Infinity rather than the finite0/Infinity.
    const overflow = tool.execute({
      ...example.input,
      count: 2,
      minimumX: -Number.MAX_VALUE,
      maximumX: Number.MAX_VALUE,
      intercept: 0,
      slope: 1,
      noiseStandardDeviation: 0,
    });
    expect(overflow).toMatchObject({
      ok: true,
      output: {
        observations: [
          {
            x: -Number.MAX_VALUE,
            target: -Number.MAX_VALUE,
            observed: -Number.MAX_VALUE,
          },
          {
            x: Number.MAX_VALUE,
            target: Number.MAX_VALUE,
            observed: Number.MAX_VALUE,
          },
        ],
        fit: { status: "numeric-overflow", result: null, predictions: [] },
      },
    });
    if (!overflow.ok)
      throw new Error(
        "Expected retained finite data with an overflow fit status",
      );
    expect(matchesToolJsonSchema(overflow.output, tool.outputSchema)).toBe(
      true,
    );
    expect(JSON.parse(JSON.stringify(overflow.output))).toEqual(
      overflow.output,
    );
    for (const change of [
      { minimumX: 3 },
      { maximumX: -1 },
      { count: 1 },
      { count: 1025 },
      { noiseStandardDeviation: -1 },
      { count: 4, minimumX: 1, maximumX: 1 + Number.EPSILON },
    ])
      expect(tool.execute({ ...example.input, ...change })).toMatchObject({
        ok: false,
      });
    expect(
      tool.execute({
        ...example.input,
        slope: Number.MAX_VALUE,
        noiseStandardDeviation: 0,
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ code: "numeric_overflow" }] },
    });
  });
});

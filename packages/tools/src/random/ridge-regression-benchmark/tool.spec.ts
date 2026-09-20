import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  ridgeRegressionBenchmarkExample as example,
  calculateRidgeRegressionBenchmark,
} from "./tool.js";

describe("Random Ridge Regression Benchmark Generator", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculateRidgeRegressionBenchmark(example.input)).toEqual({
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
  it("reuses one dataset and matches the centered closed-form ridge normal equation", () => {
    const result = tool.execute({ ...example.input, lambdas: [0, 1, 10, 100] });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const xs = result.output.observations.map((point) => point.x),
      ys = result.output.observations.map((point) => point.observed),
      meanX = xs.reduce((sum, value) => sum + value, 0) / xs.length,
      meanY = ys.reduce((sum, value) => sum + value, 0) / ys.length;
    const sxx = xs.reduce((sum, x) => sum + (x - meanX) ** 2, 0),
      sxy = xs.reduce((sum, x, i) => sum + (x - meanX) * (ys[i] - meanY), 0);
    for (const model of result.output.ridge) {
      expect(model.status).toBe("finite");
      expect(model.result).not.toBeNull();
      if (!model.result)
        throw new Error(
          "Expected a finite ridge model for this bounded dataset",
        );
      expect(model.result.slope).toBeCloseTo(sxy / (sxx + model.lambda), 8);
      expect(model.result.intercept).toBeCloseTo(
        meanY - (sxy / (sxx + model.lambda)) * meanX,
        8,
      );
      expect(model.result.predictions).toHaveLength(xs.length);
    }
    const ordinary = result.output.ordinaryLeastSquares.result,
      unpenalized = result.output.ridge[0].result;
    if (!ordinary || !unpenalized)
      throw new Error(
        "Expected finite ordinary and unpenalized ridge models for this bounded dataset",
      );
    expect(unpenalized.slope).toBeCloseTo(ordinary.slope, 8);
    for (let i = 1; i < result.output.ridge.length; i += 1) {
      const current = result.output.ridge[i].result,
        previous = result.output.ridge[i - 1].result;
      if (!current || !previous)
        throw new Error(
          "Expected finite ridge models for the shrinkage comparison",
        );
      expect(Math.abs(current.slope)).toBeLessThanOrEqual(
        Math.abs(previous.slope),
      );
    }
  });
  it("fits a horizontal response finitely even when the predictor variance overflows", () => {
    expect(
      tool.execute({
        ...example.input,
        count: 2,
        minimumX: -Number.MAX_VALUE,
        maximumX: Number.MAX_VALUE,
        intercept: 1,
        slope: 0,
        noiseStandardDeviation: 0,
      }),
    ).toMatchObject({
      ok: true,
      output: {
        ordinaryLeastSquares: {
          status: "finite",
          result: { intercept: 1, slope: 0, rSquared: 1 },
          predictions: [1, 1],
        },
        ridge: [
          {
            lambda: 0,
            status: "finite",
            result: { lambda: 0, intercept: 1, slope: 0, predictions: [1, 1] },
          },
          {
            lambda: 5,
            status: "finite",
            result: { lambda: 5, intercept: 1, slope: 0, predictions: [1, 1] },
          },
        ],
      },
    });
  });
  it("preserves genuine nonfinite delegated outcomes as portable null result records", () => {
    const result = tool.execute({
      ...example.input,
      count: 2,
      minimumX: -Number.MAX_VALUE,
      maximumX: Number.MAX_VALUE,
      intercept: 0,
      slope: 1,
      noiseStandardDeviation: 0,
    });
    expect(result).toMatchObject({
      ok: true,
      output: {
        ordinaryLeastSquares: {
          status: "numeric-overflow",
          result: null,
          predictions: [],
        },
        ridge: [
          { lambda: 0, status: "not-finite", result: null },
          { lambda: 5, status: "not-finite", result: null },
        ],
      },
    });
    if (!result.ok)
      throw new Error("Expected retained data and explicit fit failures");
    expect(result.output.observations.map((point) => point.observed)).toEqual([
      -Number.MAX_VALUE,
      Number.MAX_VALUE,
    ]);
    expect(matchesToolJsonSchema(result.output, tool.outputSchema)).toBe(true);
    expect(JSON.parse(JSON.stringify(result.output))).toEqual(result.output);
  });
  it("retains the core's raw-coefficient prediction convention and unpenalized intercept", () => {
    const result = calculateRidgeRegressionBenchmark({
      count: 2,
      minimumX: 0,
      maximumX: 1,
      intercept: 0,
      slope: 1,
      noiseStandardDeviation: 0,
      lambdas: [0, 1],
      seed: 42,
    });
    if (!result.ok) throw new Error("Expected success");
    // Centered Sxx=Sxy=1/2; lambda1 gives slope1/3 and intercept1/3.
    // Each prediction is rounded AFTER adding those unrounded coefficients.
    expect(result.output.ridge).toEqual([
      {
        lambda: 0,
        status: "finite",
        result: { lambda: 0, intercept: 0, slope: 1, predictions: [0, 1] },
      },
      {
        lambda: 1,
        status: "finite",
        result: {
          lambda: 1,
          intercept: 0.3333333333,
          slope: 0.3333333333,
          predictions: [0.3333333333, 0.6666666667],
        },
      },
    ]);
    const penalized = result.output.ridge[1].result;
    if (!penalized) throw new Error("Expected a finite penalized fit");
    expect(penalized.predictions[1]).not.toBe(
      penalized.intercept + penalized.slope,
    );
    expect(result.output.ordinaryLeastSquares.result).toEqual({
      intercept: 0,
      slope: 1,
      rSquared: 1,
    });
  });
  it("rejects negative or duplicate penalties and forwards dataset validation", () => {
    for (const change of [
      { lambdas: [-1] },
      { lambdas: [1, 1] },
      { lambdas: [] },
      { lambdas: Array.from({ length: 17 }, (_, i) => i) },
      { count: 1 },
      { minimumX: 3 },
      { noiseStandardDeviation: -1 },
    ])
      expect(tool.execute({ ...example.input, ...change })).toMatchObject({
        ok: false,
      });
  });
});

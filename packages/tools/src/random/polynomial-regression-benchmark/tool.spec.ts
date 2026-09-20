import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  polynomialRegressionBenchmarkExample as example,
  calculatePolynomialRegressionBenchmark,
} from "./tool.js";

describe("Random Polynomial Regression Benchmark Generator", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculatePolynomialRegressionBenchmark(example.input)).toEqual({
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
  it("keeps generating and fitted ascending-coefficient conventions consistent", () => {
    const result = tool.execute({
      ...example.input,
      coefficients: [1, 3, 2],
      count: 5,
      minimumX: -2,
      maximumX: 2,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    for (const point of result.output.observations)
      expect(point.target).toBe(1 + 3 * point.x + 2 * point.x ** 2);
    const quadratic = result.output.fits[1];
    expect(quadratic.status).toBe("finite");
    expect(quadratic.result).not.toBeNull();
    if (quadratic.result) {
      quadratic.result.coefficients.forEach((value, i) =>
        expect(value).toBeCloseTo([1, 3, 2][i], 10),
      );
      expect(quadratic.result.rSquared).toBeCloseTo(1, 12);
    }
    expect(quadratic.predictions).toHaveLength(5);
    quadratic.predictions.forEach((value, i) =>
      expect(value).toBeCloseTo(result.output.observations[i].target, 10),
    );
  });
  it("retains singular/overflow fitting outcomes rather than silently changing solver or degree", () => {
    const singular = tool.execute({
      ...example.input,
      minimumX: 0,
      maximumX: 1e-20,
    });
    expect(singular).toMatchObject({
      ok: true,
      output: {
        fits: [
          { degree: 1, status: "singular", result: null },
          { degree: 2, status: "singular", result: null },
        ],
      },
    });
    const overflow = tool.execute({
      ...example.input,
      coefficients: [1],
      count: 7,
      minimumX: 1e60,
      maximumX: 2e60,
      fittingDegrees: [6],
    });
    expect(overflow).toMatchObject({
      ok: true,
      output: {
        fits: [{ degree: 6, status: "numeric-overflow", result: null }],
      },
    });
  });
  it("rejects unsupported degrees, insufficient distinct points, invalid bounds/spread, and target overflow", () => {
    for (const change of [
      { fittingDegrees: [0] },
      { fittingDegrees: [7] },
      { fittingDegrees: [1, 1] },
      { count: 2 },
      { coefficients: [] },
      { minimumX: 1 },
      { noiseStandardDeviation: -1 },
    ])
      expect(tool.execute({ ...example.input, ...change })).toMatchObject({
        ok: false,
      });
    expect(
      tool.execute({
        ...example.input,
        coefficients: [0, Number.MAX_VALUE],
        minimumX: 2,
        maximumX: 3,
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ code: "result_not_finite" }] },
    });
  });
});

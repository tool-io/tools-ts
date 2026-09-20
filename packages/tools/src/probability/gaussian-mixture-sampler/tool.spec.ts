import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  gaussianMixtureSamplerExample as example,
  calculateGaussianMixtureSampler,
} from "./tool.js";

describe("Gaussian Mixture Model Sampler Tool", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculateGaussianMixtureSampler(example.input)).toEqual({
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
  it("selects exact weighted boundaries and delegates a known zero-normal draw", () => {
    const draws = [0, 0.5, 0.25, 0.75, 0.5, 0.25];
    let i = 0;
    const result = tool.execute(
      {
        count: 2,
        components: [
          { weight: 1, mean: 2, standardDeviation: 1 },
          { weight: 3, mean: 10, standardDeviation: 2 },
        ],
      },
      { random: () => draws[i++] },
    );
    if (!result.ok) throw new Error("Expected success");
    expect(result.output.componentIndices).toEqual([0, 1]);
    expect(result.output.componentProbabilities).toEqual([0.25, 0.75]);
    expect(result.output.samples[0]).toBeCloseTo(2, 14);
    expect(result.output.samples[1]).toBeCloseTo(10, 14);
    expect(i).toBe(6);
  });
  it("maps known positive and negative unit normals across an exact component boundary", () => {
    // Radius sqrt(-2 log(exp(-1/2))) is 1; angles 0 and pi give +1 and -1.
    const draws = [0, Math.exp(-0.5), 0, 0.25, Math.exp(-0.5), 0.5];
    let i = 0;
    const result = tool.execute(
      {
        count: 2,
        components: [
          { weight: 1, mean: 2, standardDeviation: 3 },
          { weight: 3, mean: 10, standardDeviation: 2 },
        ],
      },
      { random: () => draws[i++] },
    );
    expect(result).toEqual({
      ok: true,
      output: {
        samples: [5, 8],
        componentIndices: [0, 1],
        componentProbabilities: [0.25, 0.75],
        randomness: { seed: null, source: "context" },
      },
    });
    expect(i).toBe(6);
  });
  it("never chooses zero weights, scales large weights, and allows point masses", () => {
    const result = tool.execute({
      count: 3,
      components: [
        { weight: 0, mean: -20, standardDeviation: 1 },
        { weight: 1e308, mean: 7, standardDeviation: 0 },
        { weight: 0, mean: 30, standardDeviation: 2 },
      ],
      seed: 42,
    });
    if (!result.ok) throw new Error("Expected success");
    expect(result.output.componentIndices).toEqual([1, 1, 1]);
    expect(result.output.samples).toEqual([7, 7, 7]);
    expect(result.output.componentProbabilities).toEqual([0, 1, 0]);
    expect(
      tool.execute({
        count: 1,
        components: [{ weight: 0, mean: 0, standardDeviation: 1 }],
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "components", code: "zero_total_weight" }] },
    });
    expect(
      tool.execute(
        {
          count: 1,
          components: [{ weight: 1, mean: 1e308, standardDeviation: 1e308 }],
        },
        { random: () => 0.00001 },
      ),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "components", code: "numeric_overflow" }] },
    });
  });
});

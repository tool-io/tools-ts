import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  monteCarloUniformExample as example,
  calculateMonteCarloUniform,
} from "./tool.js";

describe("Monte Carlo Uniform Distribution Experiment Tool", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculateMonteCarloUniform(example.input)).toEqual({
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
  it("has an independent fixed-draw histogram and summary", () => {
    const draws = [0, 0.25, 0.5, 0.75];
    let i = 0;
    const result = tool.execute(
      { count: 4, lowerBound: 2, upperBound: 6, binCount: 2 },
      { random: () => draws[i++] },
    );
    if (!result.ok) throw new Error("Expected success");
    expect(result.output.samples).toEqual([2, 3, 4, 5]);
    expect(result.output.histogram).toEqual([2, 2]);
    expect(result.output.summary.mean).toBe(3.5);
    expect(result.output.summary.variance).toBe(1.25);
    expect(result.output.theoreticalMean).toBe(4);
    expect(result.output.theoreticalVariance).toBeCloseTo(4 / 3, 14);
  });
  it("retains all samples in the histogram and rejects invalid or overflowing ranges", () => {
    for (let seed = 0; seed < 16; seed += 1) {
      const result = tool.execute({ ...example.input, count: 100, seed });
      if (!result.ok) throw new Error("Expected success");
      expect(result.output.histogram.reduce((s, n) => s + n, 0)).toBe(100);
      for (const x of result.output.samples) {
        expect(x).toBeGreaterThanOrEqual(-2);
        expect(x).toBeLessThanOrEqual(4);
      }
    }
    expect(tool.execute({ ...example.input, upperBound: -2 })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "upperBound", code: "invalid_interval" }] },
    });
    expect(
      tool.execute({ ...example.input, lowerBound: -1e308, upperBound: 1e308 }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "upperBound" }] },
    });
    expect(
      tool.execute({ ...example.input, lowerBound: 0, upperBound: 1e200 }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ code: "numeric_overflow" }] },
    });
  });
});

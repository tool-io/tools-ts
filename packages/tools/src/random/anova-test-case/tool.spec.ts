import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  anovaTestCaseExample as example,
  calculateAnovaTestCase,
} from "./tool.js";

describe("Random ANOVA Test Case Generator", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculateAnovaTestCase(example.input)).toEqual({
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
  it("satisfies the total-sum-of-squares decomposition for unequal group sizes", () => {
    const result = tool.execute({
      groups: [
        { mean: -1, standardDeviation: 2, count: 5 },
        { mean: 3, standardDeviation: 1, count: 7 },
        { mean: 1, standardDeviation: 0.5, count: 3 },
      ],
      seed: 42,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.output.analysis.status).toBe("finite");
    expect(result.output.analysis.result).not.toBeNull();
    if (result.output.analysis.result === null) return;
    const values = result.output.groups.flat(),
      center = values.reduce((sum, value) => sum + value, 0) / values.length;
    const total = values.reduce((sum, value) => sum + (value - center) ** 2, 0),
      analysis = result.output.analysis.result;
    expect(analysis.betweenSumSquares + analysis.withinSumSquares).toBeCloseTo(
      total,
      8,
    );
    expect(analysis.betweenDegreesOfFreedom).toBe(2);
    expect(analysis.withinDegreesOfFreedom).toBe(12);
    expect(analysis.fRatio).toBeCloseTo(
      analysis.betweenSumSquares / 2 / (analysis.withinSumSquares / 12),
      9,
    );
    expect(analysis).not.toHaveProperty("pValue");
  });
  it("retains explicit equal-constant and separated-constant core conventions", () => {
    const first = { mean: 2, standardDeviation: 0, count: 3 };
    expect(tool.execute({ groups: [first, first], seed: 42 })).toMatchObject({
      ok: true,
      output: {
        analysis: {
          status: "finite",
          result: { fRatio: 0, withinSumSquares: 0, betweenSumSquares: 0 },
        },
      },
    });
    expect(
      tool.execute({ groups: [first, { ...first, mean: 3 }], seed: 42 }),
    ).toMatchObject({
      ok: true,
      output: { analysis: { status: "not-finite", result: null } },
    });
  });
  it("rejects unsupported groups, negative spreads, total-work excess, and sample overflow", () => {
    for (const groups of [
      [example.input.groups[0]],
      [{ mean: 0, standardDeviation: -1, count: 3 }, example.input.groups[1]],
      [{ mean: 0, standardDeviation: 1, count: 1 }, example.input.groups[1]],
      Array.from({ length: 16 }, () => ({
        mean: 0,
        standardDeviation: 1,
        count: 256,
      })),
    ])
      expect(tool.execute({ groups, seed: 42 })).toMatchObject({ ok: false });
    const { seed, ...base } = example.input;
    expect(
      tool.execute(
        {
          ...base,
          groups: [
            {
              mean: Number.MAX_VALUE,
              standardDeviation: Number.MAX_VALUE,
              count: 2,
            },
            base.groups[1],
          ],
        },
        { random: () => 0 },
      ),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ code: "numeric_overflow" }] },
    });
  });
});

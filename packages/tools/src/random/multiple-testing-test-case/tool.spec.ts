import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  multipleTestingTestCaseExample as example,
  calculateMultipleTestingTestCase,
} from "./tool.js";

describe("Random Multiple-Testing Test Case Generator", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculateMultipleTestingTestCase(example.input)).toEqual({
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
  it("matches an independent rankwise minimum BH formula and direct Bonferroni products", () => {
    const result = tool.execute({ ...example.input, count: 20 });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const ordered = result.output.probabilities
      .map((value, index) => ({ value, index }))
      .sort((a, b) => a.value - b.value || a.index - b.index);
    for (let i = 0; i < ordered.length; i += 1) {
      const expected = Math.min(
        1,
        ...ordered
          .slice(i)
          .map((entry, j) => (entry.value * ordered.length) / (i + j + 1)),
      );
      expect(result.output.benjaminiHochberg[ordered[i].index]).toBeCloseTo(
        expected,
        11,
      );
    }
    for (let i = 0; i < 20; i += 1) {
      expect(result.output.bonferroni[i]).toBeCloseTo(
        Math.min(1, result.output.probabilities[i] * 20),
        11,
      );
      expect(result.output.decisions.unadjusted[i]).toBe(
        result.output.probabilities[i] <= 0.2,
      );
      expect(result.output.decisions.benjaminiHochberg[i]).toBe(
        result.output.benjaminiHochberg[i] <= 0.2,
      );
      expect(result.output.decisions.bonferroni[i]).toBe(
        result.output.bonferroni[i] <= 0.2,
      );
    }
  });
  it("keeps one-comparison corrections identical and supports endpoint decision thresholds", () => {
    const result = tool.execute({
      ...example.input,
      count: 1,
      significanceLevel: 1,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.output.benjaminiHochberg).toEqual(
      result.output.probabilities,
    );
    expect(result.output.bonferroni).toEqual(result.output.probabilities);
    expect(result.output.decisions).toEqual({
      unadjusted: [true],
      benjaminiHochberg: [true],
      bonferroni: [true],
    });
  });
  it("rejects unsupported counts/shapes/thresholds and reports numerical sampler limits", () => {
    for (const change of [
      { count: 0 },
      { count: 513 },
      { betaAlpha: 0 },
      { betaBeta: -1 },
      { significanceLevel: -0.1 },
      { significanceLevel: 1.1 },
    ])
      expect(tool.execute({ ...example.input, ...change })).toMatchObject({
        ok: false,
      });
    expect(
      tool.execute({
        ...example.input,
        betaAlpha: Number.MAX_VALUE,
        betaBeta: Number.MAX_VALUE,
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ code: "numeric_overflow" }] },
    });
    expect(
      tool.execute({
        ...example.input,
        betaAlpha: Number.MIN_VALUE,
        betaBeta: Number.MIN_VALUE,
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ code: "sampler_failed" }] },
    });
  });
});

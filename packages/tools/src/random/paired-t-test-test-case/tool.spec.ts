import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  pairedTTestTestCaseExample as example,
  calculatePairedTTestTestCase,
} from "./tool.js";

describe("Random Paired T-Test Test Case Generator", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculatePairedTTestTestCase(example.input)).toEqual({
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
  it("matches a hand-worked after-minus-before statistic without inferring a p-value", () => {
    const draws = [0.5, 0, 0.5, 0, Math.exp(-0.5), 0, Math.exp(-0.5), 0.5];
    let cursor = 0;
    const result = tool.execute(
      {
        count: 2,
        beforeMean: 0,
        beforeStandardDeviation: 0,
        offset: 2,
        noiseStandardDeviation: 1,
      },
      { random: () => draws[cursor++] },
    );
    expect(result).toMatchObject({
      ok: true,
      output: {
        before: [0, 0],
        after: [3, 1],
        analysis: {
          status: "finite",
          result: {
            meanDifference: 2,
            standardDeviation: 1.41421356237,
            standardError: 1,
            tStatistic: 2,
            degreesOfFreedom: 1,
          },
        },
      },
    });
    if (result.ok)
      expect(result.output.analysis.result).not.toHaveProperty("pValue");
  });
  it("distinguishes zero differences from a nonzero constant-difference undefined statistic", () => {
    expect(
      tool.execute({
        ...example.input,
        beforeStandardDeviation: 0,
        offset: 0,
        noiseStandardDeviation: 0,
      }),
    ).toMatchObject({
      ok: true,
      output: {
        analysis: {
          status: "finite",
          result: { tStatistic: 0, meanDifference: 0 },
        },
      },
    });
    expect(
      tool.execute({
        ...example.input,
        beforeStandardDeviation: 0,
        offset: 1,
        noiseStandardDeviation: 0,
      }),
    ).toMatchObject({
      ok: true,
      output: { analysis: { status: "undefined-statistic", result: null } },
    });
  });
  it("rejects unsupported counts/spreads and actual generated overflow", () => {
    for (const change of [
      { count: 1 },
      { count: 1025 },
      { beforeStandardDeviation: -1 },
      { noiseStandardDeviation: -1 },
      { offset: Infinity },
    ])
      expect(tool.execute({ ...example.input, ...change })).toMatchObject({
        ok: false,
      });
    expect(
      tool.execute({
        ...example.input,
        beforeMean: Number.MAX_VALUE,
        beforeStandardDeviation: 0,
        offset: Number.MAX_VALUE,
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ code: "numeric_overflow" }] },
    });
  });
});

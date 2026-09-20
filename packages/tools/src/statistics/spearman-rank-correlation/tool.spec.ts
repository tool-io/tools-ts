import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  calculateSpearmanRankCorrelation,
  spearmanRankCorrelationExample as example,
} from "./tool.js";

describe("Spearman rank correlation", () => {
  it("reproduces its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(matchesToolJsonSchema(example.input, tool.inputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, tool.outputSchema)).toBe(true);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("uses average ranks for ties and agrees with a hand-derived covariance of -1.5", () => {
    const result = calculateSpearmanRankCorrelation({
      first: [10, 20, 20, 40],
      second: [4, 1, 1, 3],
    });
    if (!result.ok) throw new Error("Expected success");
    expect(result.output.firstRanks).toEqual([1, 2.5, 2.5, 4]);
    expect(result.output.secondRanks).toEqual([4, 1.5, 1.5, 3]);
    expect(result.output.correlation).toBeCloseTo(-1 / 3, 14);
  });
  it("is symmetric, monotonic-transform invariant, and leaves inputs intact", () => {
    const input = JSON.parse(
      JSON.stringify(example.input),
    ) as typeof example.input;
    expect(tool.execute(input)).toEqual(
      tool.execute({ first: [1, 4, 9], second: [9, 1, 4] }),
    );
    expect(input).toEqual(example.input);
    expect(tool.execute({ first: input.second, second: input.first })).toEqual({
      ok: true,
      output: {
        correlation: -0.5,
        firstRanks: [3, 1, 2],
        secondRanks: [1, 2, 3],
      },
    });
  });
  it("does not use rank differences without the tie correction", () => {
    expect(tool.execute({ first: [1, 1, 2], second: [5, 5, 9] })).toEqual({
      ok: true,
      output: {
        correlation: 1,
        firstRanks: [1.5, 1.5, 3],
        secondRanks: [1.5, 1.5, 3],
      },
    });
  });
  it("returns specific structured failures for degenerate or malformed data", () => {
    expect(tool.execute({ first: [2, 2], second: [3, 4] })).toMatchObject({
      ok: false,
      error: { issues: [{ code: "undefined_correlation", field: "first" }] },
    });
    expect(tool.execute({ first: [1, 2], second: [1, 2, 3] })).toMatchObject({
      ok: false,
      error: { issues: [{ code: "paired_length_mismatch", field: "second" }] },
    });
    for (const input of [
      null,
      {},
      { first: [1, Infinity], second: [2, 3] },
      { first: [1, NaN], second: [2, 3] },
      { first: [1], second: [2] },
      { ...example.input, extra: 1 },
      { first: Array(513).fill(1), second: Array(513).fill(2) },
    ])
      expect(tool.execute(input)).toMatchObject({
        ok: false,
        error: { issues: [{ code: "invalid_paired_series", field: "first" }] },
      });
  });
});

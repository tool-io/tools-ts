import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  calculateChiSquareIndependence,
  chiSquareIndependenceExample as example,
} from "./tool.js";

describe("chi-square independence", () => {
  it("has a valid contract and canonical 3x3 example", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(matchesToolJsonSchema(example.input, tool.inputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, tool.outputSchema)).toBe(true);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("agrees with the hand-counted four contributions of five for a 2x2 table", () => {
    expect(
      calculateChiSquareIndependence({
        observed: [
          [10, 0],
          [0, 10],
        ],
      }),
    ).toEqual({
      ok: true,
      output: {
        chiSquare: 20,
        degreesOfFreedom: 1,
        expected: [
          [5, 5],
          [5, 5],
        ],
        total: 20,
      },
    });
  });
  it("does not mutate input and is invariant under a category permutation", () => {
    const input = JSON.parse(
      JSON.stringify(example.input),
    ) as typeof example.input;
    tool.execute(input);
    expect(input).toEqual(example.input);
    const result = tool.execute({
      observed: [
        [10, 0, 20],
        [20, 10, 0],
        [0, 20, 10],
      ],
    });
    expect(result).toEqual({ ok: true, output: example.output });
  });
  it("reports ragged tables and zero marginals explicitly", () => {
    expect(
      tool.execute({
        observed: [
          [1, 2],
          [3, 4, 5],
        ],
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ code: "ragged_table", field: "observed" }] },
    });
    expect(
      tool.execute({
        observed: [
          [1, 0],
          [2, 0],
        ],
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ code: "zero_marginal", field: "observed" }] },
    });
    expect(
      tool.execute({
        observed: [
          [0, 0],
          [0, 0],
        ],
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ code: "zero_marginal", field: "observed" }] },
    });
  });
  it("rejects malformed counts, excess dimensions, extra fields and unsafe totals", () => {
    for (const input of [
      null,
      {},
      { observed: [[1, 2]] },
      {
        observed: [
          [1, NaN],
          [2, 3],
        ],
      },
      {
        observed: [
          [1, Infinity],
          [2, 3],
        ],
      },
      {
        observed: [
          [1, -1],
          [2, 3],
        ],
      },
      {
        observed: [
          [1, 0.5],
          [2, 3],
        ],
      },
      {
        observed: [
          [1, 2],
          [3, 4],
        ],
        extra: true,
      },
      { observed: Array.from({ length: 33 }, () => [1, 2]) },
    ])
      expect(tool.execute(input)).toMatchObject({
        ok: false,
        error: {
          issues: [{ code: "invalid_contingency_table", field: "observed" }],
        },
      });
    expect(
      tool.execute({
        observed: [
          [Number.MAX_SAFE_INTEGER, 1],
          [1, 1],
        ],
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ code: "unsafe_count_total", field: "observed" }] },
    });
  });
});

import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  calculateKendallTau,
  kendallTauExample as example,
} from "./tool.js";

describe("Kendall tau-b", () => {
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
  it("counts the three pairs of a tied three-point example by hand", () => {
    expect(
      calculateKendallTau({ first: [1, 1, 2], second: [1, 2, 2] }),
    ).toEqual({
      ok: true,
      output: {
        concordant: 1,
        discordant: 0,
        tauB: 0.5,
        tiedInBoth: 0,
        tiedInFirstOnly: 1,
        tiedInSecondOnly: 1,
      },
    });
  });
  it("excludes joint ties from both one-variable tie corrections", () => {
    expect(tool.execute({ first: [3, 3, 7], second: [10, 10, -2] })).toEqual({
      ok: true,
      output: {
        concordant: 0,
        discordant: 2,
        tauB: -1,
        tiedInBoth: 1,
        tiedInFirstOnly: 0,
        tiedInSecondOnly: 0,
      },
    });
  });
  it("preserves input, is symmetric, and accounts for every unordered pair", () => {
    const input = JSON.parse(
      JSON.stringify(example.input),
    ) as typeof example.input;
    const result = tool.execute(input);
    expect(input).toEqual(example.input);
    expect(tool.execute({ first: input.second, second: input.first })).toEqual(
      result,
    );
    if (!result.ok) throw new Error("Expected success");
    const x = result.output;
    expect(
      x.concordant +
        x.discordant +
        x.tiedInBoth +
        x.tiedInFirstOnly +
        x.tiedInSecondOnly,
    ).toBe(10);
  });
  it("distinguishes constant data, length mismatch and malformed series", () => {
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
      { first: [1, NaN], second: [2, 3] },
      { first: [1, Infinity], second: [2, 3] },
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

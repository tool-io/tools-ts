import { describe, expect, it } from "vitest";
import {
  calculateDamerauLevenshtein,
  damerauLevenshteinExample,
  runDamerauLevenshtein,
} from "./tool.js";

describe("distance/damerau-levenshtein", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runDamerauLevenshtein(damerauLevenshteinExample.input)).toEqual({
      ok: true,
      output: damerauLevenshteinExample.output,
    });
  });

  it("matches the classic Levenshtein example without transpositions", () => {
    expect(
      calculateDamerauLevenshtein({ first: "kitten", second: "sitting" }),
    ).toEqual({
      distance: 3,
    });
  });

  it("keeps identical strings at distance zero and handles empty operands", () => {
    expect(
      calculateDamerauLevenshtein({ first: "same", second: "same" }),
    ).toEqual({
      distance: 0,
    });
    expect(calculateDamerauLevenshtein({ first: "", second: "abc" })).toEqual({
      distance: 3,
    });
    expect(calculateDamerauLevenshtein({ first: "", second: "" })).toEqual({
      distance: 0,
    });
  });

  it("scores the restricted CA/ABC alignment at three operations", () => {
    expect(calculateDamerauLevenshtein({ first: "CA", second: "ABC" })).toEqual(
      {
        distance: 3,
      },
    );
  });

  it("rejects overly long inputs", () => {
    expect(
      runDamerauLevenshtein({ first: "a".repeat(2049), second: "b" }),
    ).toMatchObject({
      error: { issues: [{ code: "text_too_long" }] },
      ok: false,
    });
  });

  it("is symmetric", () => {
    expect(
      calculateDamerauLevenshtein({ first: "receive", second: "recieve" }),
    ).toEqual(
      calculateDamerauLevenshtein({ first: "recieve", second: "receive" }),
    );
  });
});

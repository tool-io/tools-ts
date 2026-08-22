import { describe, expect, it } from "vitest";
import { runTrigramCount } from "./tool.js";

describe("Trigram Count Tool", () => {
  it("calculates a valid result", () => {
    expect(runTrigramCount({ text: "a b c d c b a" })).toEqual({
      ok: true,
      output: {
        trigrams: {
          "a b c": 1,
          "b c d": 1,
          "c b a": 1,
          "c d c": 1,
          "d c b": 1,
        },
      },
    });
  });

  it("rejects invalid input", () =>
    expect(runTrigramCount(null).ok).toBe(false));
});

import { describe, expect, it } from "vitest";
import {
  calculateCharacterNGrams,
  characterNGramsExample,
  runCharacterNGrams,
} from "./tool.js";

describe("character n-gram generator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runCharacterNGrams(characterNGramsExample.input)).toEqual({
      ok: true,
      output: characterNGramsExample.output,
    });
  });

  it("defaults to trigrams and returns one gram for exact length", () => {
    expect(calculateCharacterNGrams({ text: "abcd" })).toEqual({
      grams: ["abc", "bcd"],
    });
    expect(calculateCharacterNGrams({ n: 4, text: "abcd" })).toEqual({
      grams: ["abcd"],
    });
  });

  it("rejects invalid lengths through execution", () => {
    expect(() =>
      calculateCharacterNGrams({ n: 0, text: "abc" }),
    ).toThrow(/positive integer/);
    expect(runCharacterNGrams({ n: 5, text: "abc" })).toMatchObject({
      error: { issues: [{ code: "n_exceeds_length" }] },
      ok: false,
    });
  });
});

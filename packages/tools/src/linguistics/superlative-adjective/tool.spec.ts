import { describe, expect, it } from "vitest";
import { runSuperlativeAdjective } from "./tool.js";

describe("Superlative Adjective", () => {
  it("calculates the canonical example", () =>
    expect(runSuperlativeAdjective({ word: "big" })).toEqual({
      ok: true,
      output: { superlative: "biggest" },
    }));

  it("adds st after a trailing e", () =>
    expect(runSuperlativeAdjective({ word: "wide" })).toEqual({
      ok: true,
      output: { superlative: "widest" },
    }));

  it("adds est to one syllable adjectives", () =>
    expect(runSuperlativeAdjective({ word: "tall" })).toEqual({
      ok: true,
      output: { superlative: "tallest" },
    }));

  it("turns consonant plus y into iest", () =>
    expect(runSuperlativeAdjective({ word: "happy" })).toEqual({
      ok: true,
      output: { superlative: "happiest" },
    }));

  it("doubles a final consonant after one vowel group", () =>
    expect(runSuperlativeAdjective({ word: "thin" })).toEqual({
      ok: true,
      output: { superlative: "thinnest" },
    }));

  it("uses most for longer adjectives", () =>
    expect(runSuperlativeAdjective({ word: "beautiful" })).toEqual({
      ok: true,
      output: { superlative: "most beautiful" },
    }));

  it("doubles another short consonant final", () =>
    expect(runSuperlativeAdjective({ word: "sad" })).toEqual({
      ok: true,
      output: { superlative: "saddest" },
    }));

  it("rejects an empty word", () => {
    const result = runSuperlativeAdjective({ word: "" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("empty_word");
  });

  it("rejects non-string input", () =>
    expect(runSuperlativeAdjective({ word: null }).ok).toBe(false));
});

import { describe, expect, it } from "vitest";
import { runComparativeAdjective } from "./tool.js";

describe("Comparative Adjective", () => {
  it("calculates the canonical example", () =>
    expect(runComparativeAdjective({ word: "happy" })).toEqual({
      ok: true,
      output: { comparative: "happier" },
    }));

  it("adds r after a trailing e", () =>
    expect(runComparativeAdjective({ word: "wide" })).toEqual({
      ok: true,
      output: { comparative: "wider" },
    }));

  it("adds er to one syllable adjectives", () =>
    expect(runComparativeAdjective({ word: "tall" })).toEqual({
      ok: true,
      output: { comparative: "taller" },
    }));

  it("doubles a final consonant after one vowel group", () =>
    expect(runComparativeAdjective({ word: "big" })).toEqual({
      ok: true,
      output: { comparative: "bigger" },
    }));

  it("does not double a w final", () =>
    expect(runComparativeAdjective({ word: "new" })).toEqual({
      ok: true,
      output: { comparative: "newer" },
    }));

  it("uses more for longer adjectives", () =>
    expect(runComparativeAdjective({ word: "beautiful" })).toEqual({
      ok: true,
      output: { comparative: "more beautiful" },
    }));

  it("rejects an empty word", () => {
    const result = runComparativeAdjective({ word: "" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("empty_word");
  });

  it("rejects non-string input", () =>
    expect(runComparativeAdjective({ word: 3 }).ok).toBe(false));

  it("rejects a missing field", () =>
    expect(runComparativeAdjective({}).ok).toBe(false));
});

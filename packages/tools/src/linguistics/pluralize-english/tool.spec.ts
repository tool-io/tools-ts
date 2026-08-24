import { describe, expect, it } from "vitest";
import { runPluralizeEnglish } from "./tool.js";

describe("English Pluralizer", () => {
  it("calculates the canonical example", () =>
    expect(runPluralizeEnglish({ word: "wolf" })).toEqual({
      ok: true,
      output: { plural: "wolves" },
    }));

  it("maps irregular nouns", () =>
    expect(runPluralizeEnglish({ word: "child" })).toEqual({
      ok: true,
      output: { plural: "children" },
    }));

  it("turns consonant plus y into ies", () =>
    expect(runPluralizeEnglish({ word: "baby" })).toEqual({
      ok: true,
      output: { plural: "babies" },
    }));

  it("keeps vowel plus y before s", () =>
    expect(runPluralizeEnglish({ word: "boy" })).toEqual({
      ok: true,
      output: { plural: "boys" },
    }));

  it("adds es after sibilants", () =>
    expect(runPluralizeEnglish({ word: "church" })).toEqual({
      ok: true,
      output: { plural: "churches" },
    }));

  it("adds plain s otherwise", () =>
    expect(runPluralizeEnglish({ word: "cat" })).toEqual({
      ok: true,
      output: { plural: "cats" },
    }));

  it("turns trailing f into ves", () =>
    expect(runPluralizeEnglish({ word: "elf" })).toEqual({
      ok: true,
      output: { plural: "elves" },
    }));

  it("keeps the roof exception regular", () =>
    expect(runPluralizeEnglish({ word: "roof" })).toEqual({
      ok: true,
      output: { plural: "roofs" },
    }));

  it("rejects an empty word", () => {
    const result = runPluralizeEnglish({ word: "" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("empty_word");
  });

  it("rejects non-string input", () =>
    expect(runPluralizeEnglish({ word: 7 }).ok).toBe(false));
});

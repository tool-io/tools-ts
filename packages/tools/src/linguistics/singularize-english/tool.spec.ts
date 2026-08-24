import { describe, expect, it } from "vitest";
import { runSingularizeEnglish } from "./tool.js";

describe("English Singularizer", () => {
  it("calculates the canonical example", () =>
    expect(runSingularizeEnglish({ word: "wolves" })).toEqual({
      ok: true,
      output: { singular: "wolf" },
    }));

  it("maps irregular plurals first", () =>
    expect(runSingularizeEnglish({ word: "men" })).toEqual({
      ok: true,
      output: { singular: "man" },
    }));

  it("maps ves plurals before the generic rule", () =>
    expect(runSingularizeEnglish({ word: "knives" })).toEqual({
      ok: true,
      output: { singular: "knife" },
    }));

  it("turns ies into y", () =>
    expect(runSingularizeEnglish({ word: "babies" })).toEqual({
      ok: true,
      output: { singular: "baby" },
    }));

  it("keeps ties lies and dies exceptions", () =>
    expect(runSingularizeEnglish({ word: "ties" })).toEqual({
      ok: true,
      output: { singular: "tie" },
    }));

  it("strips es after sibilants", () =>
    expect(runSingularizeEnglish({ word: "boxes" })).toEqual({
      ok: true,
      output: { singular: "box" },
    }));

  it("strips a trailing s otherwise", () =>
    expect(runSingularizeEnglish({ word: "cats" })).toEqual({
      ok: true,
      output: { singular: "cat" },
    }));

  it("leaves double s endings unchanged", () =>
    expect(runSingularizeEnglish({ word: "boss" })).toEqual({
      ok: true,
      output: { singular: "boss" },
    }));

  it("rejects an empty word", () => {
    const result = runSingularizeEnglish({ word: "" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("empty_word");
  });

  it("rejects non-string input", () =>
    expect(runSingularizeEnglish({ word: true }).ok).toBe(false));
});

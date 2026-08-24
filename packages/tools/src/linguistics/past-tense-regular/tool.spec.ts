import { describe, expect, it } from "vitest";
import { runPastTenseRegular } from "./tool.js";

describe("Regular Past Tense", () => {
  it("calculates the canonical example", () =>
    expect(runPastTenseRegular({ word: "stop" })).toEqual({
      ok: true,
      output: { pastTense: "stopped" },
    }));

  it("adds d after a trailing e", () =>
    expect(runPastTenseRegular({ word: "love" })).toEqual({
      ok: true,
      output: { pastTense: "loved" },
    }));

  it("turns consonant plus y into ied", () =>
    expect(runPastTenseRegular({ word: "study" })).toEqual({
      ok: true,
      output: { pastTense: "studied" },
    }));

  it("keeps vowel plus y before ed", () =>
    expect(runPastTenseRegular({ word: "play" })).toEqual({
      ok: true,
      output: { pastTense: "played" },
    }));

  it("doubles a short final consonant", () =>
    expect(runPastTenseRegular({ word: "hop" })).toEqual({
      ok: true,
      output: { pastTense: "hopped" },
    }));

  it("does not double w x or y finals", () =>
    expect(runPastTenseRegular({ word: "snow" })).toEqual({
      ok: true,
      output: { pastTense: "snowed" },
    }));

  it("adds plain ed for longer words", () =>
    expect(runPastTenseRegular({ word: "walk" })).toEqual({
      ok: true,
      output: { pastTense: "walked" },
    }));

  it("rejects an empty word", () => {
    const result = runPastTenseRegular({ word: "" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("empty_word");
  });

  it("rejects a missing field", () =>
    expect(runPastTenseRegular({}).ok).toBe(false));
});

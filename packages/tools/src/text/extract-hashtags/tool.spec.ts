import { describe, expect, it } from "vitest";
import { runExtractHashtags } from "./tool.js";

describe("Hashtag Extractor", () => {
  it("calculates the canonical example", () =>
    expect(
      runExtractHashtags({ text: "Loving #typescript and #node_js today!" }),
    ).toEqual({
      ok: true,
      output: { hashtags: ["typescript", "node_js"] },
    }));

  it("strips only the # symbol from each token", () =>
    expect(runExtractHashtags({ text: "#100Devs #A_B_C" })).toEqual({
      ok: true,
      output: { hashtags: ["100Devs", "A_B_C"] },
    }));

  it("extracts adjacent hashtags", () =>
    expect(runExtractHashtags({ text: "#x#y" })).toEqual({
      ok: true,
      output: { hashtags: ["x", "y"] },
    }));

  it("stops a token at punctuation", () =>
    expect(runExtractHashtags({ text: "#foo,bar! #baz?" })).toEqual({
      ok: true,
      output: { hashtags: ["foo", "baz"] },
    }));

  it("requires the # symbol", () =>
    expect(runExtractHashtags({ text: "no tags here foo bar" })).toEqual({
      ok: true,
      output: { hashtags: [] },
    }));

  it("ignores lone hash symbols", () =>
    expect(runExtractHashtags({ text: "# ## ###" })).toEqual({
      ok: true,
      output: { hashtags: [] },
    }));

  it("returns an empty array for empty text", () =>
    expect(runExtractHashtags({ text: "" })).toEqual({
      ok: true,
      output: { hashtags: [] },
    }));

  it("keeps duplicates in order of appearance", () =>
    expect(runExtractHashtags({ text: "#dup then #dup" })).toEqual({
      ok: true,
      output: { hashtags: ["dup", "dup"] },
    }));

  it("rejects a missing field", () =>
    expect(runExtractHashtags({}).ok).toBe(false));

  it("rejects non-string input", () =>
    expect(runExtractHashtags({ text: [] }).ok).toBe(false));
});

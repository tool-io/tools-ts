import { describe, expect, it } from "vitest";
import { runExtractMentions } from "./tool.js";

describe("Mention Extractor", () => {
  it("calculates the canonical example", () =>
    expect(
      runExtractMentions({ text: "Thanks @alice and @bob_x for the review!" }),
    ).toEqual({
      ok: true,
      output: { mentions: ["alice", "bob_x"] },
    }));

  it("strips only the @ symbol from each token", () =>
    expect(runExtractMentions({ text: "@User_1 @2fast" })).toEqual({
      ok: true,
      output: { mentions: ["User_1", "2fast"] },
    }));

  it("stops a token at punctuation", () =>
    expect(runExtractMentions({ text: "@alice,@bob! @carol?" })).toEqual({
      ok: true,
      output: { mentions: ["alice", "bob", "carol"] },
    }));

  it("matches repeated mentions without overlap", () =>
    expect(runExtractMentions({ text: "@@double @@triple" })).toEqual({
      ok: true,
      output: { mentions: ["double", "triple"] },
    }));

  it("requires the @ symbol", () =>
    expect(runExtractMentions({ text: "plain names only" })).toEqual({
      ok: true,
      output: { mentions: [] },
    }));

  it("ignores lone at signs", () =>
    expect(runExtractMentions({ text: "@ @ @" })).toEqual({
      ok: true,
      output: { mentions: [] },
    }));

  it("returns an empty array for empty text", () =>
    expect(runExtractMentions({ text: "" })).toEqual({
      ok: true,
      output: { mentions: [] },
    }));

  it("keeps duplicates in order of appearance", () =>
    expect(runExtractMentions({ text: "@dup and @dup" })).toEqual({
      ok: true,
      output: { mentions: ["dup", "dup"] },
    }));

  it("rejects a missing field", () =>
    expect(runExtractMentions({}).ok).toBe(false));

  it("rejects non-string input", () =>
    expect(runExtractMentions({ text: null }).ok).toBe(false));
});

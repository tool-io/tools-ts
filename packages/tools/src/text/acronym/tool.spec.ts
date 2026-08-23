import { describe, expect, it } from "vitest";
import { runAcronym } from "./tool.js";

describe("Acronym Generator", () => {
  it("calculates the canonical example", () =>
    expect(runAcronym({ text: "portable network graphics" })).toEqual({
      ok: true,
      output: { acronym: "PNG" },
    }));

  it("uppercases lowercase first letters", () =>
    expect(runAcronym({ text: "laugh out loud" })).toEqual({
      ok: true,
      output: { acronym: "LOL" },
    }));

  it("keeps already uppercase first letters", () =>
    expect(runAcronym({ text: "Central Processing Unit" })).toEqual({
      ok: true,
      output: { acronym: "CPU" },
    }));

  it("collapses multiple whitespace between words", () =>
    expect(runAcronym({ text: "  as\tsoon\nas  possible " })).toEqual({
      ok: true,
      output: { acronym: "ASAP" },
    }));

  it("uses punctuation attached to a word", () =>
    expect(runAcronym({ text: "hyper-text markup language!" })).toEqual({
      ok: true,
      output: { acronym: "HML" },
    }));

  it("returns a single letter for one word", () =>
    expect(runAcronym({ text: "typescript" })).toEqual({
      ok: true,
      output: { acronym: "T" },
    }));

  it("fails with empty_text for empty text", () =>
    expect(runAcronym({ text: "" })).toEqual({
      ok: false,
      error: {
        code: "invalid_input",
        issues: [
          {
            code: "empty_text",
            field: "text",
            message: "Text must contain at least one word.",
          },
        ],
      },
    }));

  it("fails with empty_text for whitespace-only text", () =>
    expect(runAcronym({ text: "   \t\n " }).ok).toBe(false));

  it("rejects a missing field", () => expect(runAcronym({}).ok).toBe(false));

  it("rejects non-string input", () =>
    expect(runAcronym({ text: 5 }).ok).toBe(false));
});

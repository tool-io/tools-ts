import { describe, expect, it } from "vitest";
import { runStopwordRemoval } from "./tool.js";

describe("Stopword Removal Tool", () => {
  it("calculates the canonical example", () =>
    expect(
      runStopwordRemoval({
        text: "The quick brown fox jumps over the lazy dog",
      }),
    ).toEqual({
      ok: true,
      output: { result: "quick brown fox jumps over lazy dog" },
    }));

  it("returns an empty result for all-stopword text", () =>
    expect(runStopwordRemoval({ text: "To be or not to be" })).toEqual({
      ok: true,
      output: { result: "" },
    }));

  it("preserves original casing of kept tokens", () =>
    expect(runStopwordRemoval({ text: "She SAID hello World" })).toEqual({
      ok: true,
      output: { result: "SAID hello World" },
    }));

  it("collapses whitespace around removed words", () =>
    expect(runStopwordRemoval({ text: "  the   QUICK\tfox\nnoisy  " })).toEqual(
      {
        ok: true,
        output: { result: "QUICK fox noisy" },
      },
    ));

  it("keeps non-stopwords in order", () =>
    expect(runStopwordRemoval({ text: "bells will ring tonight" })).toEqual({
      ok: true,
      output: { result: "bells ring tonight" },
    }));

  it("keeps words that merely contain a stopword", () =>
    expect(runStopwordRemoval({ text: "the thermometer" })).toEqual({
      ok: true,
      output: { result: "thermometer" },
    }));

  it("returns an empty result for empty text", () =>
    expect(runStopwordRemoval({ text: "" })).toEqual({
      ok: true,
      output: { result: "" },
    }));

  it("returns an empty result for whitespace-only text", () =>
    expect(runStopwordRemoval({ text: " \n\t " })).toEqual({
      ok: true,
      output: { result: "" },
    }));

  it("rejects a missing field", () =>
    expect(runStopwordRemoval({}).ok).toBe(false));

  it("rejects non-string input", () =>
    expect(runStopwordRemoval({ text: {} }).ok).toBe(false));

  it("rejects unknown fields", () =>
    expect(runStopwordRemoval({ text: "a b", list: "en" }).ok).toBe(false));

  it("rejects a null input object", () =>
    expect(runStopwordRemoval(null).ok).toBe(false));
});

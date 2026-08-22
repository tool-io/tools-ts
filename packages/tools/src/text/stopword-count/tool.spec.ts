import { describe, expect, it } from "vitest";
import { runStopwordCount } from "./tool.js";

describe("Stopword Count Tool", () => {
  it("calculates the canonical example", () =>
    expect(runStopwordCount({ text: "To be or not to be" })).toEqual({
      ok: true,
      output: { stopwordCount: 6 },
    }));

  it("matches stopwords case-insensitively", () =>
    expect(runStopwordCount({ text: "THE And oF" })).toEqual({
      ok: true,
      output: { stopwordCount: 3 },
    }));

  it("counts zero when no stopwords appear", () =>
    expect(runStopwordCount({ text: "quick brown fox jumps" })).toEqual({
      ok: true,
      output: { stopwordCount: 0 },
    }));

  it("does not match partial words", () =>
    expect(runStopwordCount({ text: "the theory there" })).toEqual({
      ok: true,
      output: { stopwordCount: 1 },
    }));

  it("counts a mixed sentence", () =>
    expect(
      runStopwordCount({
        text: "the quick brown fox jumps over the lazy dog",
      }),
    ).toEqual({
      ok: true,
      output: { stopwordCount: 2 },
    }));

  it("counts zero for empty text", () =>
    expect(runStopwordCount({ text: "" })).toEqual({
      ok: true,
      output: { stopwordCount: 0 },
    }));

  it("counts zero for whitespace-only text", () =>
    expect(runStopwordCount({ text: " \t\n " })).toEqual({
      ok: true,
      output: { stopwordCount: 0 },
    }));

  it("rejects a missing field", () =>
    expect(runStopwordCount({}).ok).toBe(false));

  it("rejects non-string input", () =>
    expect(runStopwordCount({ text: 12 }).ok).toBe(false));

  it("rejects unknown fields", () =>
    expect(runStopwordCount({ text: "a b", language: "en" }).ok).toBe(false));

  it("rejects a null input object", () =>
    expect(runStopwordCount(null).ok).toBe(false));
});

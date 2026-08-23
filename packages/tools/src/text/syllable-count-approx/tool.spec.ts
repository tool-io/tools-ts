import { describe, expect, it } from "vitest";
import { runSyllableCountApprox } from "./tool.js";

describe("Syllable Count Approx Tool", () => {
  it("calculates the canonical example", () =>
    expect(runSyllableCountApprox({ text: "hello world" })).toEqual({
      ok: true,
      output: { syllableCount: 3 },
    }));

  it("ignores a silent trailing e", () =>
    expect(runSyllableCountApprox({ text: "make" })).toEqual({
      ok: true,
      output: { syllableCount: 1 },
    }));

  it("returns at least one syllable per word", () =>
    expect(runSyllableCountApprox({ text: "strength" })).toEqual({
      ok: true,
      output: { syllableCount: 1 },
    }));

  it("treats adjacent vowels as one group", () =>
    expect(runSyllableCountApprox({ text: "queue" })).toEqual({
      ok: true,
      output: { syllableCount: 1 },
    }));

  it("is case and punctuation insensitive", () =>
    expect(runSyllableCountApprox({ text: "Hello, World!" })).toEqual({
      ok: true,
      output: { syllableCount: 3 },
    }));

  it("rejects empty text", () => {
    const result = runSyllableCountApprox({ text: "" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("empty_text");
  });

  it("rejects whitespace-only text", () => {
    const result = runSyllableCountApprox({ text: "   " });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("empty_text");
  });

  it("rejects non-string input", () =>
    expect(runSyllableCountApprox({ text: null }).ok).toBe(false));
});

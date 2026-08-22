import { describe, expect, it } from "vitest";
import { runPunctuationCount } from "./tool.js";

describe("Punctuation Count Tool", () => {
  it("calculates a valid result", () => {
    expect(runPunctuationCount({ text: "Hello, world! Well... ok?" })).toEqual({
      ok: true,
      output: { punctuationCount: 6 },
    });
  });

  it("counts zero for plain words", () => {
    expect(runPunctuationCount({ text: "no punctuation here" })).toEqual({
      ok: true,
      output: { punctuationCount: 0 },
    });
  });

  it("rejects invalid input", () =>
    expect(runPunctuationCount(null).ok).toBe(false));
});

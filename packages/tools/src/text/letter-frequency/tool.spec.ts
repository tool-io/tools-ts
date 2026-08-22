import { describe, expect, it } from "vitest";
import { runLetterFrequency } from "./tool.js";

describe("Letter Frequency Counter", () => {
  it("calculates a valid result", () => {
    expect(runLetterFrequency({ text: "Aa b!" })).toEqual({
      ok: true,
      output: { frequency: { a: 2, b: 1 } },
    });
  });

  it("ignores non-letters", () => {
    expect(runLetterFrequency({ text: "123 ??" })).toEqual({
      ok: true,
      output: { frequency: {} },
    });
  });

  it("rejects invalid input", () =>
    expect(runLetterFrequency(null).ok).toBe(false));
});

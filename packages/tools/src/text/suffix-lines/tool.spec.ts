import { describe, expect, it } from "vitest";
import { runSuffixLines } from "./tool.js";
describe("Text Suffix Lines Tool", () => {
  it("calculates a valid result", () => {
    expect(runSuffixLines({ text: "a\nb", suffix: ";" })).toEqual({
      ok: true,
      output: { text: "a;\nb;" },
    });
  });
  it("rejects invalid input", () =>
    expect(runSuffixLines(null).ok).toBe(false));
});

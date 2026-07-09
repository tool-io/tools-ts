import { describe, expect, it } from "vitest";
import { runPrefixLines } from "./tool.js";
describe("Text Prefix Lines Tool", () => {
  it("calculates a valid result", () => {
    expect(runPrefixLines({ text: "a\nb", prefix: "> " })).toEqual({
      ok: true,
      output: { text: "> a\n> b" },
    });
  });
  it("rejects invalid input", () =>
    expect(runPrefixLines(null).ok).toBe(false));
});

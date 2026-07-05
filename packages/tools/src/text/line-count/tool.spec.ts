import { describe, expect, it } from "vitest";
import { runLineCount } from "./tool.js";
describe("Line Count Tool", () => {
  it("calculates a valid result", () => {
    expect(runLineCount({ text: "one\ntwo\nthree" })).toEqual({
      ok: true,
      output: { lines: 3 },
    });
  });
  it("rejects invalid input", () => expect(runLineCount(null).ok).toBe(false));
});

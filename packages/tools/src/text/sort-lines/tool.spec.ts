import { describe, expect, it } from "vitest";
import { runSortLines } from "./tool.js";
describe("Sort Lines Tool", () => {
  it("calculates a valid result", () => {
    expect(runSortLines({ text: "b\na\nc", descending: false })).toEqual({
      ok: true,
      output: { text: "a\nb\nc" },
    });
  });
  it("rejects invalid input", () => expect(runSortLines(null).ok).toBe(false));
});

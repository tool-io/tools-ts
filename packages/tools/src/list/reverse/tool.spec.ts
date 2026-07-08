import { describe, expect, it } from "vitest";
import { runReverse } from "./tool.js";
describe("Reverse List Tool", () => {
  it("calculates a valid result", () => {
    expect(runReverse({ values: ["a", "b", "c"] })).toEqual({
      ok: true,
      output: { values: ["c", "b", "a"] },
    });
  });
  it("rejects invalid input", () => expect(runReverse(null).ok).toBe(false));
});

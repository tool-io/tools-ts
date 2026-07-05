import { describe, expect, it } from "vitest";
import { runFrequency } from "./tool.js";
describe("List Frequency Counter", () => {
  it("calculates a valid result", () => {
    expect(runFrequency({ values: ["a", "b", "a"] })).toEqual({
      ok: true,
      output: { frequencies: { a: 2, b: 1 } },
    });
  });
  it("rejects invalid input", () => expect(runFrequency(null).ok).toBe(false));
});

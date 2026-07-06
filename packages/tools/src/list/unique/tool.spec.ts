import { describe, expect, it } from "vitest";
import { runUnique } from "./tool.js";
describe("List Unique Values Tool", () => {
  it("calculates a valid result", () => {
    expect(runUnique({ values: ["a", "b", "a"] })).toEqual({
      ok: true,
      output: { values: ["a", "b"] },
    });
  });
  it("rejects invalid input", () => expect(runUnique(null).ok).toBe(false));
});

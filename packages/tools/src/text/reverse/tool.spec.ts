import { describe, expect, it } from "vitest";
import { runReverse } from "./tool.js";
describe("Reverse Text Tool", () => {
  it("calculates a valid result", () => {
    expect(runReverse({ text: "A😀B" })).toEqual({
      ok: true,
      output: { text: "B😀A" },
    });
  });
  it("rejects invalid input", () => expect(runReverse(null).ok).toBe(false));
});

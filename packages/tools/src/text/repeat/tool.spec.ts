import { describe, expect, it } from "vitest";
import { runRepeat } from "./tool.js";
describe("Repeat Text Tool", () => {
  it("calculates a valid result", () => {
    expect(runRepeat({ text: "ab", count: 3 })).toEqual({
      ok: true,
      output: { text: "ababab" },
    });
  });
  it("rejects invalid input", () => expect(runRepeat(null).ok).toBe(false));
});

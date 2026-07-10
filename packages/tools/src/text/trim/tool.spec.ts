import { describe, expect, it } from "vitest";
import { runTrim } from "./tool.js";
describe("Text Trim Tool", () => {
  it("calculates a valid result", () => {
    expect(runTrim({ text: "  hello \n" })).toEqual({
      ok: true,
      output: { text: "hello" },
    });
  });
  it("rejects invalid input", () => expect(runTrim(null).ok).toBe(false));
});

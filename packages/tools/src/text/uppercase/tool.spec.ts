import { describe, expect, it } from "vitest";
import { runUppercase } from "./tool.js";
describe("Uppercase Text Converter", () => {
  it("calculates a valid result", () => {
    expect(runUppercase({ text: "tool.io", locale: "en-US" })).toEqual({
      ok: true,
      output: { text: "TOOL.IO" },
    });
  });
  it("rejects invalid input", () => expect(runUppercase(null).ok).toBe(false));
});

import { describe, expect, it } from "vitest";
import { runLowercase } from "./tool.js";
describe("Lowercase Text Converter", () => {
  it("calculates a valid result", () => {
    expect(runLowercase({ text: "TOOL.IO", locale: "en-US" })).toEqual({
      ok: true,
      output: { text: "tool.io" },
    });
  });
  it("rejects invalid input", () => expect(runLowercase(null).ok).toBe(false));
});

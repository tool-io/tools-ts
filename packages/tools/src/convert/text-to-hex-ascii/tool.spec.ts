import { describe, expect, it } from "vitest";
import { runTextToHexAscii } from "./tool.js";

describe("Text to Hex ASCII Converter", () => {
  it("calculates a valid result", () => {
    expect(runTextToHexAscii({ text: "Hi" })).toEqual({
      ok: true,
      output: { hex: "48 69" },
    });
  });

  it("rejects empty text through execution", () => {
    expect(runTextToHexAscii({ text: "" })).toMatchObject({
      error: { issues: [{ code: "empty_text" }] },
      ok: false,
    });
  });

  it("rejects invalid input", () =>
    expect(runTextToHexAscii(null).ok).toBe(false));
});

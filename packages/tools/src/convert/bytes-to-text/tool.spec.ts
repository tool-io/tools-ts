import { describe, expect, it } from "vitest";
import { runBytesToText } from "./tool.js";
describe("Bytes to UTF-8 Text Converter", () => {
  it("calculates a valid result", () => {
    expect(runBytesToText({ bytes: "SGk=" })).toEqual({
      ok: true,
      output: { text: "Hi" },
    });
  });
  it("rejects invalid input", () =>
    expect(runBytesToText({ bytes: "@@@=" }).ok).toBe(false));
});

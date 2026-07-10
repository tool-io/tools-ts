import { describe, expect, it } from "vitest";
import { runCharacterToCodePoint } from "./tool.js";
describe("Unicode Character to Code Point Converter", () => {
  it("calculates a valid result", () => {
    expect(runCharacterToCodePoint({ character: "😀" })).toEqual({
      ok: true,
      output: { codePoint: 128512 },
    });
  });
  it("rejects invalid input", () =>
    expect(runCharacterToCodePoint({ character: "ab" }).ok).toBe(false));
});

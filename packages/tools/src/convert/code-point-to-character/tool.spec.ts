import { describe, expect, it } from "vitest";
import { runCodePointToCharacter } from "./tool.js";
describe("Unicode Code Point to Character Converter", () => {
  it("calculates a valid result", () => {
    expect(runCodePointToCharacter({ codePoint: 128512 })).toEqual({
      ok: true,
      output: { character: "😀" },
    });
  });
  it("rejects invalid input", () =>
    expect(runCodePointToCharacter({ codePoint: 55296 }).ok).toBe(false));
});

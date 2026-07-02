import { describe, expect, it } from "vitest";
import { runAsciiCodeToCharacter } from "./tool.js";
describe("ASCII Code to Character Converter", () => {
  it("calculates a valid result", () => {
    expect(runAsciiCodeToCharacter({ code: 65 })).toEqual({
      ok: true,
      output: { character: "A" },
    });
  });
  it("rejects invalid input", () =>
    expect(runAsciiCodeToCharacter(null).ok).toBe(false));
});

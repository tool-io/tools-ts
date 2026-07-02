import { describe, expect, it } from "vitest";
import { runCharacterCount } from "./tool.js";
describe("Character Count Tool", () => {
  it("calculates a valid result", () => {
    expect(runCharacterCount({ text: "A😀" })).toEqual({
      ok: true,
      output: { characters: 2 },
    });
  });
  it("rejects invalid input", () =>
    expect(runCharacterCount(null).ok).toBe(false));
});

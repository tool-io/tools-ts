import { describe, expect, it } from "vitest";
import { runCharacterToAsciiCode } from "./tool.js";
describe("Character to ASCII Code Converter", () => {
  it("calculates a valid result", () => {
    expect(runCharacterToAsciiCode({ character: "A" })).toEqual({
      ok: true,
      output: { code: 65 },
    });
  });
  it("rejects invalid input", () =>
    expect(runCharacterToAsciiCode({ character: "é" }).ok).toBe(false));
});

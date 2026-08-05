import { describe, expect, it } from "vitest";
import {
  caesarCipherExample,
  rotateLatinText,
  runCaesarCipher,
} from "./tool.js";

describe("Caesar Cipher", () => {
  it("rotates letters while preserving case and punctuation", () =>
    expect(rotateLatinText("Attack at dawn!", 3)).toBe("Dwwdfn dw gdzq!"));
  it("supports negative and wrapped rotations", () => {
    expect(rotateLatinText("Abc Xyz", -3)).toBe("Xyz Uvw");
    expect(rotateLatinText("Abc Xyz", 29)).toBe("Def Abc");
  });
  it("preserves non-Latin characters", () =>
    expect(rotateLatinText("猫 und Καλημέρα", 1)).toBe("猫 voe Καλημέρα"));
  it("rejects empty input and noninteger rotations", () => {
    expect(rotateLatinText("", 3)).toBeNull();
    expect(rotateLatinText("text", 1.5)).toBeNull();
  });
  it("publishes an executable example", () =>
    expect(runCaesarCipher(caesarCipherExample.input)).toEqual({
      ok: true,
      output: caesarCipherExample.output,
    }));
});

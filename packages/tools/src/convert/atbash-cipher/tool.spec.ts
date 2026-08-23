import { describe, expect, it } from "vitest";
import { atbashCipherExample, runAtbashCipher } from "./tool.js";

describe("Atbash Cipher Encoder", () => {
  it("calculates the canonical example", () =>
    expect(runAtbashCipher(atbashCipherExample.input)).toEqual({
      ok: true,
      output: atbashCipherExample.output,
    }));

  it("is an involution", () =>
    expect(runAtbashCipher({ text: "Svool Dliow" })).toEqual({
      ok: true,
      output: { result: "Hello World" },
    }));

  it("mirrors the full uppercase alphabet", () =>
    expect(runAtbashCipher({ text: "ABCDEFGHIJKLMNOPQRSTUVWXYZ" })).toEqual({
      ok: true,
      output: { result: "ZYXWVUTSRQPONMLKJIHGFEDCBA" },
    }));

  it("mirrors the full lowercase alphabet", () =>
    expect(runAtbashCipher({ text: "abcdefghijklmnopqrstuvwxyz" })).toEqual({
      ok: true,
      output: { result: "zyxwvutsrqponmlkjihgfedcba" },
    }));

  it("maps boundary letters", () =>
    expect(runAtbashCipher({ text: "AaZz" })).toEqual({
      ok: true,
      output: { result: "ZzAa" },
    }));

  it("leaves digits and punctuation unchanged", () =>
    expect(runAtbashCipher({ text: "AZaz09!" })).toEqual({
      ok: true,
      output: { result: "ZAza09!" },
    }));

  it("encodes empty text to empty text", () =>
    expect(runAtbashCipher({ text: "" })).toEqual({
      ok: true,
      output: { result: "" },
    }));

  it("rejects non-string input", () =>
    expect(runAtbashCipher({ text: 7 }).ok).toBe(false));

  it("rejects missing input", () => expect(runAtbashCipher({}).ok).toBe(false));

  it("rejects unknown fields", () =>
    expect(runAtbashCipher({ text: "a", extra: null }).ok).toBe(false));
});

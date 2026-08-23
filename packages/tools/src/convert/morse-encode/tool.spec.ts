import { describe, expect, it } from "vitest";
import { morseEncodeExample, runMorseEncode } from "./tool.js";

describe("Morse Code Encoder", () => {
  it("calculates the canonical example", () =>
    expect(runMorseEncode(morseEncodeExample.input)).toEqual({
      ok: true,
      output: morseEncodeExample.output,
    }));

  it("encodes a single word", () =>
    expect(runMorseEncode({ text: "sos" })).toEqual({
      ok: true,
      output: { morse: "... --- ..." },
    }));

  it("encodes digits", () =>
    expect(runMorseEncode({ text: "2026" })).toEqual({
      ok: true,
      output: { morse: "..--- ----- ..--- -...." },
    }));

  it("encodes lowercase and uppercase identically", () =>
    expect(runMorseEncode({ text: "AbC" })).toEqual(
      runMorseEncode({ text: "abc" }),
    ));

  it("separates words with a slash", () =>
    expect(runMorseEncode({ text: "a b" })).toEqual({
      ok: true,
      output: { morse: ".- / -..." },
    }));

  it("encodes every supported letter and digit", () => {
    const result = runMorseEncode({
      text: "the quick brown fox jumps over the lazy dog 0123456789",
    });
    expect(result.ok).toBe(true);
  });

  it("rejects empty text", () => {
    const result = runMorseEncode({ text: "   " });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("empty_text");
  });

  it("rejects unsupported characters", () => {
    const result = runMorseEncode({ text: "hello!" });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("unsupported_character");
  });

  it("rejects non-string input", () =>
    expect(runMorseEncode({ text: 42 }).ok).toBe(false));

  it("rejects missing input", () => expect(runMorseEncode({}).ok).toBe(false));

  it("rejects unknown fields", () =>
    expect(runMorseEncode({ text: "a", extra: 1 }).ok).toBe(false));
});

import { describe, expect, it } from "vitest";
import { encodeXorHex, runXorCipher, xorCipherExample } from "./tool.js";

describe("XOR Cipher Encoder", () => {
  it("matches the known transformation", () =>
    expect(encodeXorHex("Hello", "K")).toBe("032E272724"));
  it("publishes an executable example", () =>
    expect(runXorCipher(xorCipherExample.input)).toEqual({
      ok: true,
      output: xorCipherExample.output,
    }));
  it("encodes each UTF-8 byte as two uppercase hex digits", () =>
    expect(runXorCipher({ keyCharacter: "\u0001", text: "Hi" })).toEqual({
      ok: true,
      output: { encodedHex: "4968" },
    }));
  it("is its own inverse when decoded against the same key", () => {
    const encoded = encodeXorHex("Secret message!", "~");
    const bytes = encoded.match(/.{2}/g) ?? [];
    expect(bytes).toHaveLength(15);
    const decoded = bytes
      .map((byte) =>
        String.fromCharCode(Number.parseInt(byte, 16) ^ "~".charCodeAt(0)),
      )
      .join("");
    expect(decoded).toBe("Secret message!");
  });
  it("returns empty hex for empty text", () =>
    expect(runXorCipher({ keyCharacter: "A", text: "" })).toEqual({
      ok: true,
      output: { encodedHex: "" },
    }));
  it("encodes non-ASCII text as UTF-8 bytes", () =>
    expect(runXorCipher({ keyCharacter: "\u0000", text: "é" })).toEqual({
      ok: true,
      output: { encodedHex: "C3A9" },
    }));
  it("rejects an empty key", () => {
    const outcome = runXorCipher({ keyCharacter: "", text: "Hi" });
    expect(outcome.ok).toBe(false);
    if (!outcome.ok) {
      expect(outcome.error.issues[0]?.code).toBe("invalid_key");
      expect(outcome.error.issues[0]?.field).toBe("keyCharacter");
    }
  });
  it("rejects a multi-character key", () =>
    expect(runXorCipher({ keyCharacter: "AB", text: "Hi" }).ok).toBe(false));
  it("rejects a surrogate pair key", () =>
    expect(runXorCipher({ keyCharacter: "𝕏", text: "Hi" }).ok).toBe(false));
  it("rejects a non-ASCII single-unit key", () =>
    expect(runXorCipher({ keyCharacter: "é", text: "Hi" }).ok).toBe(false));
  it("rejects missing text", () =>
    expect(runXorCipher({ keyCharacter: "A" }).ok).toBe(false));
  it("reports invalid_field for non-string text", () => {
    const outcome = runXorCipher({ keyCharacter: "A", text: [] });
    expect(outcome.ok).toBe(false);
    if (!outcome.ok)
      expect(outcome.error.issues[0]?.code).toBe("invalid_field");
  });
});

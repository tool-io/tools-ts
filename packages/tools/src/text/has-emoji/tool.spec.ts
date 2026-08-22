import { describe, expect, it } from "vitest";
import { runHasEmoji } from "./tool.js";

describe("Has Emoji Checker", () => {
  it("calculates the canonical example", () =>
    expect(runHasEmoji({ text: "Ship it 🚀" })).toEqual({
      ok: true,
      output: { hasEmoji: true },
    }));

  it("reports false for plain text without pictographs", () =>
    expect(runHasEmoji({ text: "plain ASCII text 123" })).toEqual({
      ok: true,
      output: { hasEmoji: false },
    }));

  it("detects emoji-only text", () =>
    expect(runHasEmoji({ text: "🎉🎊" })).toEqual({
      ok: true,
      output: { hasEmoji: true },
    }));

  it("detects an emoji surrounded by text", () =>
    expect(runHasEmoji({ text: "hello 👋 world" })).toEqual({
      ok: true,
      output: { hasEmoji: true },
    }));

  it("reports false for punctuation that is not pictographic", () =>
    expect(runHasEmoji({ text: "?!.,;:" })).toEqual({
      ok: true,
      output: { hasEmoji: false },
    }));

  it("reports false for empty text", () =>
    expect(runHasEmoji({ text: "" })).toEqual({
      ok: true,
      output: { hasEmoji: false },
    }));

  it("rejects a missing field", () => expect(runHasEmoji({}).ok).toBe(false));

  it("rejects non-string input", () =>
    expect(runHasEmoji({ text: true }).ok).toBe(false));

  it("rejects unknown fields", () =>
    expect(runHasEmoji({ text: "x", emoji: "🎉" }).ok).toBe(false));

  it("rejects a null input object", () =>
    expect(runHasEmoji(null).ok).toBe(false));
});

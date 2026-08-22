import { describe, expect, it } from "vitest";
import { brailleEncodeExample, runBrailleEncode } from "./tool.js";

describe("Braille Encoder", () => {
  it("calculates the canonical example", () =>
    expect(runBrailleEncode(brailleEncodeExample.input)).toEqual({
      ok: true,
      output: brailleEncodeExample.output,
    }));

  it("encodes every lowercase letter", () =>
    expect(
      runBrailleEncode({
        text: "abcdefghijklmnopqrstuvwxyz",
      }),
    ).toEqual({
      ok: true,
      output: {
        braille:
          "\u2801\u2803\u2809\u2819\u2811\u280B\u281B\u2813\u280A\u281A\u2805\u2807\u280D\u281D\u2815\u280F\u281F\u2817\u280E\u281E\u2825\u2827\u283A\u282D\u283D\u2835",
      },
    }));

  it("encodes digits one through zero with the number sign", () =>
    expect(runBrailleEncode({ text: "1234567890" })).toEqual({
      ok: true,
      output: {
        braille:
          "\u283C\u2801\u283C\u2803\u283C\u2809\u283C\u2819\u283C\u2811\u283C\u280B\u283C\u281B\u283C\u2813\u283C\u280A\u283C\u281A",
      },
    }));

  it("encodes a word", () =>
    expect(runBrailleEncode({ text: "braille" })).toEqual({
      ok: true,
      output: {
        braille: "\u2803\u2817\u2801\u280A\u2807\u2807\u2811",
      },
    }));

  it("separates multiple words with spaces", () =>
    expect(runBrailleEncode({ text: "hi ok" })).toEqual({
      ok: true,
      output: { braille: "\u2813\u280A \u2815\u2805" },
    }));

  it("rejects empty text", () => {
    const result = runBrailleEncode({ text: "   " });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("empty_text");
  });

  it("rejects uppercase letters", () => {
    const result = runBrailleEncode({ text: "Abc" });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("unsupported_character");
  });

  it("rejects punctuation", () => {
    const result = runBrailleEncode({ text: "a,b" });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("unsupported_character");
  });

  it("rejects non-string input", () =>
    expect(runBrailleEncode({ text: true }).ok).toBe(false));

  it("rejects missing input", () =>
    expect(runBrailleEncode({}).ok).toBe(false));

  it("rejects unknown fields", () =>
    expect(runBrailleEncode({ text: "a", extra: 0 }).ok).toBe(false));
});

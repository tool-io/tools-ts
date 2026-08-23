import { describe, expect, it } from "vitest";
import { runNormalizeUnicode } from "./tool.js";

describe("Unicode Normalizer", () => {
  it("calculates the canonical example", () =>
    expect(runNormalizeUnicode({ form: "NFD", text: "ñ" })).toEqual({
      ok: true,
      output: { normalized: "n\u0303" },
    }));

  it("composes combining marks under NFC", () =>
    expect(runNormalizeUnicode({ form: "NFC", text: "\u0065\u0301" })).toEqual({
      ok: true,
      output: { normalized: "\u00e9" },
    }));

  it("defaults to NFC when the form is omitted", () =>
    expect(runNormalizeUnicode({ text: "\u0065\u0301" })).toEqual({
      ok: true,
      output: { normalized: "\u00e9" },
    }));

  it("expands typographic ligatures under NFKC", () =>
    expect(runNormalizeUnicode({ form: "NFKC", text: "ﬁ" })).toEqual({
      ok: true,
      output: { normalized: "fi" },
    }));

  it("decomposes compatibility characters under NFKD", () =>
    expect(runNormalizeUnicode({ form: "NFKD", text: "①" })).toEqual({
      ok: true,
      output: { normalized: "1" },
    }));

  it("leaves plain ASCII unchanged", () =>
    expect(runNormalizeUnicode({ form: "NFC", text: "abc" })).toEqual({
      ok: true,
      output: { normalized: "abc" },
    }));

  it("rejects an unsupported form", () => {
    const result = runNormalizeUnicode({
      form: "NFCX",
      text: "abc",
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_field");
  });

  it("rejects a missing text field", () =>
    expect(runNormalizeUnicode({ form: "NFC" }).ok).toBe(false));

  it("rejects unknown fields", () =>
    expect(runNormalizeUnicode({ form: "NFC", text: "a", extra: 1 }).ok).toBe(
      false,
    ));
});

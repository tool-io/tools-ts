import { describe, expect, it } from "vitest";
import { runSoundexEncode } from "./tool.js";

describe("Soundex Encoder", () => {
  it("calculates the canonical example", () =>
    expect(runSoundexEncode({ text: "Robert" })).toEqual({
      ok: true,
      output: { soundex: "R163" },
    }));

  it("encodes classic NARA reference names", () => {
    const encode = (text: string) => runSoundexEncode({ text });
    expect(encode("Rupert")).toEqual({ ok: true, output: { soundex: "R163" } });
    expect(encode("Ashcraft")).toEqual({
      ok: true,
      output: { soundex: "A261" },
    });
    expect(encode("Tymczak")).toEqual({
      ok: true,
      output: { soundex: "T522" },
    });
    expect(encode("Pfister")).toEqual({
      ok: true,
      output: { soundex: "P236" },
    });
    expect(encode("Jackson")).toEqual({
      ok: true,
      output: { soundex: "J250" },
    });
    expect(encode("Washington")).toEqual({
      ok: true,
      output: { soundex: "W252" },
    });
  });

  it("pads with zeros to three digits", () => {
    expect(runSoundexEncode({ text: "Lee" })).toEqual({
      ok: true,
      output: { soundex: "L000" },
    });
    expect(runSoundexEncode({ text: "R" })).toEqual({
      ok: true,
      output: { soundex: "R000" },
    });
  });

  it("encodes lowercase input the same as uppercase", () =>
    expect(runSoundexEncode({ text: "robert" })).toEqual({
      ok: true,
      output: { soundex: "R163" },
    }));

  it("ignores non-letter characters", () =>
    expect(runSoundexEncode({ text: "O'Brien" })).toEqual({
      ok: true,
      output: { soundex: "O165" },
    }));

  it("treats letterless text as a structured error", () => {
    const result = runSoundexEncode({ text: "123 456" });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "letters_required",
        field: "text",
      });
  });

  it("rejects empty text", () =>
    expect(runSoundexEncode({ text: "" }).ok).toBe(false));

  it("rejects a missing field", () =>
    expect(runSoundexEncode({}).ok).toBe(false));

  it("rejects non-string input", () =>
    expect(runSoundexEncode({ text: 42 }).ok).toBe(false));

  it("rejects unknown fields", () =>
    expect(runSoundexEncode({ name: "Robert" }).ok).toBe(false));

  it("rejects a null input object", () =>
    expect(runSoundexEncode(null).ok).toBe(false));
});

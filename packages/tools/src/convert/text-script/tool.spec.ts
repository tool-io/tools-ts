import { describe, expect, it } from "vitest";
import { loadToolModule } from "../../registry.js";
import {
  toA1z26,
  toBaudotIta2,
  toBetaCodeGreek,
  toBuckwalterArabic,
  toCircled,
  toDnaBase4,
  toFullwidth,
  toHtmlHexEntities,
  toMathematicalScript,
  toNatoPhonetic,
  toQuotedPrintable,
  toSerbianCyrillic,
  toUnicodeCodePoints,
  toUnicodeEscape,
} from "./shared.js";

const toolIds = [
  "convert/text-to-fullwidth",
  "convert/text-to-circled",
  "convert/text-to-parenthesized",
  "convert/text-to-negative-circled",
  "convert/text-to-squared",
  "convert/text-to-negative-squared",
  "convert/text-to-superscript",
  "convert/text-to-subscript",
  "convert/text-to-small-caps",
  "convert/text-to-mathematical-bold",
  "convert/text-to-mathematical-italic",
  "convert/text-to-mathematical-bold-italic",
  "convert/text-to-mathematical-script",
  "convert/text-to-mathematical-bold-script",
  "convert/text-to-mathematical-fraktur",
  "convert/text-to-mathematical-bold-fraktur",
  "convert/text-to-mathematical-double-struck",
  "convert/text-to-mathematical-sans-serif",
  "convert/text-to-mathematical-sans-serif-bold",
  "convert/text-to-mathematical-sans-serif-italic",
  "convert/text-to-mathematical-sans-serif-bold-italic",
  "convert/text-to-mathematical-monospace",
  "convert/text-to-regional-indicator",
  "convert/text-to-upside-down",
  "convert/text-to-a1z26",
  "convert/text-to-unicode-code-points",
  "convert/text-to-unicode-escape",
  "convert/text-to-html-decimal-entities",
  "convert/text-to-html-hex-entities",
  "convert/text-to-css-unicode-escape",
  "convert/text-to-quoted-printable",
  "convert/text-to-nato-phonetic",
  "convert/text-to-baudot-ita2",
  "convert/text-to-dna-base4",
  "convert/text-to-rna-base4",
  "convert/text-to-utf8-decimal",
  "convert/text-to-utf8-octal",
  "convert/text-to-utf16-code-units",
  "convert/text-to-keycap-symbols",
  "convert/text-to-elder-futhark",
  "convert/text-to-younger-futhark",
  "convert/text-to-anglo-saxon-futhorc",
  "convert/text-to-ogham",
  "convert/text-to-phoenician",
  "convert/text-to-glagolitic",
  "convert/text-to-gothic",
  "convert/text-to-coptic",
  "convert/text-to-old-italic",
  "convert/serbian-latin-to-cyrillic",
  "convert/beta-code-to-greek",
  "convert/buckwalter-to-arabic",
] as const;

describe("text script converter family", () => {
  it("publishes 51 independent executable tools with matching examples", async () => {
    expect(toolIds).toHaveLength(51);
    expect(new Set(toolIds).size).toBe(51);
    for (const id of toolIds) {
      const module = await loadToolModule(id);
      expect(module, id).toBeDefined();
      expect(module!.default.id).toBe(id);
      expect(module!.default.execute(module!.example!.input), id).toEqual({
        ok: true,
        output: module!.example!.output,
      });
    }
  });

  it("matches independent examples for Unicode and byte representations", () => {
    expect(toFullwidth("A 1!")).toBe("Ａ　１！");
    expect(toCircled("Az0")).toBe("Ⓐⓩ⓪");
    expect(toUnicodeCodePoints("A😀")).toBe("U+0041 U+1F600");
    expect(toUnicodeEscape("A😀")).toBe("\\u0041\\u{1F600}");
    expect(toHtmlHexEntities("A😀")).toBe("&#x41;&#x1F600;");
    expect(toMathematicalScript("ABCEFHILMReglo")).toBe("𝒜ℬ𝒞ℰℱℋℐℒℳℛℯℊℓℴ");
    expect(toQuotedPrintable("café")).toBe("caf=C3=A9");
    expect(toDnaBase4("A")).toBe("CAAC");
  });

  it("matches established code and transliteration samples", () => {
    expect(toA1z26("SOS 2")).toBe("19 15 19 / 2");
    expect(toNatoPhonetic("SOS 2")).toBe("Sierra Oscar Sierra / Two");
    expect(toBaudotIta2("HELLO")).toBe("10100 00001 10010 10010 11000");
    expect(toSerbianCyrillic("Ljubav")).toBe("Љубав");
    expect(toBetaCodeGreek("logos")).toBe("λογος");
    expect(toBuckwalterArabic("slAm")).toBe("سلام");
  });
});

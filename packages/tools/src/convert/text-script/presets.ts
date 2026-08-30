import type { TextScriptConfig } from "./shared.js";
import {
  toA1z26,
  toAngloSaxonFuthorc,
  toBaudotIta2,
  toBetaCodeGreek,
  toBuckwalterArabic,
  toCircled,
  toCoptic,
  toCssUnicodeEscape,
  toDnaBase4,
  toElderFuthark,
  toFullwidth,
  toGlagolitic,
  toGothic,
  toHtmlDecimalEntities,
  toHtmlHexEntities,
  toKeycapSymbols,
  toMathematicalBold,
  toMathematicalBoldFraktur,
  toMathematicalBoldItalic,
  toMathematicalBoldScript,
  toMathematicalDoubleStruck,
  toMathematicalFraktur,
  toMathematicalItalic,
  toMathematicalMonospace,
  toMathematicalSansSerif,
  toMathematicalSansSerifBold,
  toMathematicalSansSerifBoldItalic,
  toMathematicalSansSerifItalic,
  toMathematicalScript,
  toNatoPhonetic,
  toNegativeCircled,
  toNegativeSquared,
  toOgham,
  toOldItalic,
  toParenthesized,
  toPhoenician,
  toQuotedPrintable,
  toRegionalIndicator,
  toRnaBase4,
  toSerbianCyrillic,
  toSmallCaps,
  toSquared,
  toSubscript,
  toSuperscript,
  toUnicodeCodePoints,
  toUnicodeEscape,
  toUpsideDown,
  toUtf16CodeUnits,
  toUtf8Decimal,
  toUtf8Octal,
  toYoungerFuthark,
} from "./shared.js";

const preset = (
  id: TextScriptConfig["id"],
  title: string,
  description: string,
  transform: TextScriptConfig["transform"],
  keywords: readonly string[],
  exampleText?: string,
): TextScriptConfig => ({
  description,
  exampleText,
  id,
  keywords,
  title,
  transform,
});

export const fullwidth = preset(
  "convert/text-to-fullwidth",
  "Fullwidth Text Converter",
  "Replace printable ASCII characters with Unicode fullwidth forms and the ASCII space with an ideographic space while preserving other characters.",
  toFullwidth,
  ["east asian width", "fullwidth", "unicode"],
);
export const circled = preset(
  "convert/text-to-circled",
  "Circled Text Converter",
  "Replace basic Latin letters and decimal digits with their Unicode circled alphanumeric counterparts while preserving unsupported characters.",
  toCircled,
  ["circled", "enclosed alphanumeric", "unicode"],
);
export const parenthesized = preset(
  "convert/text-to-parenthesized",
  "Parenthesized Text Converter",
  "Replace basic Latin letters and digits 1 through 9 with Unicode parenthesized alphanumeric characters while preserving characters without a counterpart.",
  toParenthesized,
  ["enclosed alphanumeric", "parenthesized", "unicode"],
);
export const negativeCircled = preset(
  "convert/text-to-negative-circled",
  "Negative Circled Text Converter",
  "Replace basic Latin letters and decimal digits with dark Unicode negative-circled symbols while preserving unsupported characters.",
  toNegativeCircled,
  ["circled", "negative circled", "unicode"],
);
export const squared = preset(
  "convert/text-to-squared",
  "Squared Text Converter",
  "Replace basic Latin letters with Unicode squared capital-letter symbols, using the same symbols for lowercase input.",
  toSquared,
  ["enclosed alphanumeric", "squared", "unicode"],
);
export const negativeSquared = preset(
  "convert/text-to-negative-squared",
  "Negative Squared Text Converter",
  "Replace basic Latin letters with Unicode negative-squared capital-letter symbols, using the same symbols for lowercase input.",
  toNegativeSquared,
  ["negative squared", "squared", "unicode"],
);
export const superscript = preset(
  "convert/text-to-superscript",
  "Superscript Text Converter",
  "Replace characters that have Unicode superscript forms, including digits, common operators, and many Latin letters, without fabricating missing forms.",
  toSuperscript,
  ["superscript", "unicode"],
);
export const subscript = preset(
  "convert/text-to-subscript",
  "Subscript Text Converter",
  "Replace characters that have Unicode subscript forms, including digits, common operators, and selected Latin letters, while preserving unsupported letters.",
  toSubscript,
  ["subscript", "unicode"],
);
export const smallCaps = preset(
  "convert/text-to-small-caps",
  "Small Caps Text Converter",
  "Replace lowercase basic Latin letters with available Unicode small-capital or modifier-letter approximations while leaving letters without a distinct form unchanged.",
  toSmallCaps,
  ["small caps", "unicode"],
);
export const mathematicalBold = preset(
  "convert/text-to-mathematical-bold",
  "Mathematical Bold Text Converter",
  "Map basic Latin letters and decimal digits to Unicode Mathematical Alphanumeric Symbols in the bold style.",
  toMathematicalBold,
  ["bold", "mathematical alphanumeric", "unicode"],
);
export const mathematicalItalic = preset(
  "convert/text-to-mathematical-italic",
  "Mathematical Italic Text Converter",
  "Map basic Latin letters to Unicode Mathematical Alphanumeric Symbols in the italic style, including the legacy Planck-constant form for italic h.",
  toMathematicalItalic,
  ["italic", "mathematical alphanumeric", "unicode"],
);
export const mathematicalBoldItalic = preset(
  "convert/text-to-mathematical-bold-italic",
  "Mathematical Bold Italic Text Converter",
  "Map basic Latin letters to Unicode Mathematical Alphanumeric Symbols in the bold italic style.",
  toMathematicalBoldItalic,
  ["bold italic", "mathematical alphanumeric", "unicode"],
);
export const mathematicalScript = preset(
  "convert/text-to-mathematical-script",
  "Mathematical Script Text Converter",
  "Map basic Latin letters to Unicode mathematical script symbols, using the standardized Letterlike Symbols where Unicode preserves legacy assignments.",
  toMathematicalScript,
  ["mathematical alphanumeric", "script", "unicode"],
);
export const mathematicalBoldScript = preset(
  "convert/text-to-mathematical-bold-script",
  "Mathematical Bold Script Text Converter",
  "Map basic Latin letters to Unicode Mathematical Alphanumeric Symbols in the bold script style.",
  toMathematicalBoldScript,
  ["bold script", "mathematical alphanumeric", "unicode"],
);
export const mathematicalFraktur = preset(
  "convert/text-to-mathematical-fraktur",
  "Mathematical Fraktur Text Converter",
  "Map basic Latin letters to Unicode mathematical Fraktur symbols, including standardized legacy Letterlike Symbols.",
  toMathematicalFraktur,
  ["fraktur", "mathematical alphanumeric", "unicode"],
);
export const mathematicalBoldFraktur = preset(
  "convert/text-to-mathematical-bold-fraktur",
  "Mathematical Bold Fraktur Text Converter",
  "Map basic Latin letters to Unicode Mathematical Alphanumeric Symbols in the bold Fraktur style.",
  toMathematicalBoldFraktur,
  ["bold fraktur", "mathematical alphanumeric", "unicode"],
);
export const mathematicalDoubleStruck = preset(
  "convert/text-to-mathematical-double-struck",
  "Mathematical Double-Struck Text Converter",
  "Map basic Latin letters and decimal digits to Unicode mathematical double-struck symbols, including legacy symbols such as ℝ and ℤ.",
  toMathematicalDoubleStruck,
  ["blackboard bold", "double struck", "unicode"],
);
export const mathematicalSansSerif = preset(
  "convert/text-to-mathematical-sans-serif",
  "Mathematical Sans-Serif Text Converter",
  "Map basic Latin letters and decimal digits to Unicode Mathematical Alphanumeric Symbols in the sans-serif style.",
  toMathematicalSansSerif,
  ["mathematical alphanumeric", "sans serif", "unicode"],
);
export const mathematicalSansSerifBold = preset(
  "convert/text-to-mathematical-sans-serif-bold",
  "Mathematical Sans-Serif Bold Text Converter",
  "Map basic Latin letters and decimal digits to Unicode Mathematical Alphanumeric Symbols in the sans-serif bold style.",
  toMathematicalSansSerifBold,
  ["bold", "mathematical alphanumeric", "sans serif"],
);
export const mathematicalSansSerifItalic = preset(
  "convert/text-to-mathematical-sans-serif-italic",
  "Mathematical Sans-Serif Italic Text Converter",
  "Map basic Latin letters to Unicode Mathematical Alphanumeric Symbols in the sans-serif italic style.",
  toMathematicalSansSerifItalic,
  ["italic", "mathematical alphanumeric", "sans serif"],
);
export const mathematicalSansSerifBoldItalic = preset(
  "convert/text-to-mathematical-sans-serif-bold-italic",
  "Mathematical Sans-Serif Bold Italic Text Converter",
  "Map basic Latin letters to Unicode Mathematical Alphanumeric Symbols in the sans-serif bold italic style.",
  toMathematicalSansSerifBoldItalic,
  ["bold italic", "mathematical alphanumeric", "sans serif"],
);
export const mathematicalMonospace = preset(
  "convert/text-to-mathematical-monospace",
  "Mathematical Monospace Text Converter",
  "Map basic Latin letters and decimal digits to Unicode Mathematical Alphanumeric Symbols in the monospace style.",
  toMathematicalMonospace,
  ["mathematical alphanumeric", "monospace", "unicode"],
);
export const regionalIndicator = preset(
  "convert/text-to-regional-indicator",
  "Regional Indicator Text Converter",
  "Replace Latin letters with Unicode regional indicator symbols separated by zero-width spaces so adjacent pairs are not interpreted as country flags.",
  toRegionalIndicator,
  ["regional indicator", "symbol", "unicode"],
);
export const upsideDown = preset(
  "convert/text-to-upside-down",
  "Upside-Down Text Converter",
  "Reverse text by Unicode code point and substitute supported Latin letters and punctuation with common upside-down Unicode approximations.",
  toUpsideDown,
  ["flip text", "upside down", "unicode"],
);
export const a1z26 = preset(
  "convert/text-to-a1z26",
  "A1Z26 Encoder",
  "Encode Latin letters as their 1-through-26 alphabet positions, represent whitespace with slashes, and preserve punctuation as separate tokens.",
  toA1z26,
  ["a1z26", "alphabet positions", "code"],
);
export const unicodeCodePoints = preset(
  "convert/text-to-unicode-code-points",
  "Unicode Code Point Converter",
  "Represent every Unicode character as an uppercase U+ hexadecimal scalar value without splitting supplementary characters into surrogate halves.",
  toUnicodeCodePoints,
  ["code point", "hexadecimal", "unicode"],
);
export const unicodeEscape = preset(
  "convert/text-to-unicode-escape",
  "Unicode Escape Converter",
  "Represent BMP characters as four-digit \\u escapes and supplementary Unicode characters with brace-form code point escapes.",
  toUnicodeEscape,
  ["escape", "javascript", "unicode"],
);
export const htmlDecimalEntities = preset(
  "convert/text-to-html-decimal-entities",
  "HTML Decimal Entity Converter",
  "Represent every Unicode character as an HTML decimal numeric character reference using its scalar value.",
  toHtmlDecimalEntities,
  ["decimal entity", "html", "numeric character reference"],
);
export const htmlHexEntities = preset(
  "convert/text-to-html-hex-entities",
  "HTML Hex Entity Converter",
  "Represent every Unicode character as an uppercase hexadecimal HTML numeric character reference.",
  toHtmlHexEntities,
  ["hex entity", "html", "numeric character reference"],
);
export const cssUnicodeEscape = preset(
  "convert/text-to-css-unicode-escape",
  "CSS Unicode Escape Converter",
  "Represent every Unicode character as a hexadecimal CSS escape followed by whitespace that terminates the escape unambiguously.",
  toCssUnicodeEscape,
  ["css", "escape", "unicode"],
);
export const quotedPrintable = preset(
  "convert/text-to-quoted-printable",
  "Quoted-Printable Converter",
  "Encode UTF-8 bytes as MIME quoted-printable text, escaping spaces, control bytes, equals signs, and non-ASCII bytes with 76-character-safe soft line breaks.",
  toQuotedPrintable,
  ["email", "mime", "quoted printable"],
);
export const natoPhonetic = preset(
  "convert/text-to-nato-phonetic",
  "NATO Phonetic Alphabet Converter",
  "Spell Latin letters and decimal digits with the ICAO international radiotelephony alphabet and digit words while marking whitespace with slashes.",
  toNatoPhonetic,
  ["icao", "nato", "spelling alphabet"],
);
export const baudotIta2 = preset(
  "convert/text-to-baudot-ita2",
  "Baudot ITA2 Converter",
  "Encode supported text as five-bit ITA2 teleprinter groups with explicit LTRS and FIGS shift codes; unsupported characters appear as question-mark groups.",
  toBaudotIta2,
  ["baudot", "ita2", "teleprinter"],
  "HELLO 123",
);
export const dnaBase4 = preset(
  "convert/text-to-dna-base4",
  "DNA Base-4 Text Encoder",
  "Encode each UTF-8 byte as four two-bit DNA symbols using the fixed mapping 00=A, 01=C, 10=G, and 11=T.",
  toDnaBase4,
  ["base 4", "dna", "utf-8"],
);
export const rnaBase4 = preset(
  "convert/text-to-rna-base4",
  "RNA Base-4 Text Encoder",
  "Encode each UTF-8 byte as four two-bit RNA symbols using the fixed mapping 00=A, 01=C, 10=G, and 11=U.",
  toRnaBase4,
  ["base 4", "rna", "utf-8"],
);
export const utf8Decimal = preset(
  "convert/text-to-utf8-decimal",
  "UTF-8 Decimal Byte Converter",
  "Encode text as UTF-8 and list each resulting byte as an unsigned decimal integer from 0 through 255.",
  toUtf8Decimal,
  ["bytes", "decimal", "utf-8"],
);
export const utf8Octal = preset(
  "convert/text-to-utf8-octal",
  "UTF-8 Octal Byte Converter",
  "Encode text as UTF-8 and list each resulting byte as a zero-padded three-digit octal value.",
  toUtf8Octal,
  ["bytes", "octal", "utf-8"],
);
export const utf16CodeUnits = preset(
  "convert/text-to-utf16-code-units",
  "UTF-16 Code Unit Converter",
  "Represent a JavaScript string as uppercase four-digit UTF-16 code units, preserving surrogate pairs as two units.",
  toUtf16CodeUnits,
  ["code unit", "hexadecimal", "utf-16"],
);
export const keycapSymbols = preset(
  "convert/text-to-keycap-symbols",
  "Keycap Symbol Converter",
  "Add Unicode emoji-presentation and combining-keycap characters to decimal digits, number signs, and asterisks while preserving other text.",
  toKeycapSymbols,
  ["emoji", "keycap", "unicode"],
);
export const elderFuthark = preset(
  "convert/text-to-elder-futhark",
  "Elder Futhark Transliterator",
  "Substitute Latin transliteration letters and the th and ng digraphs with Elder Futhark runes; this is a rune mapping, not translation into Proto-Germanic.",
  toElderFuthark,
  ["elder futhark", "runes", "transliteration"],
);
export const youngerFuthark = preset(
  "convert/text-to-younger-futhark",
  "Younger Futhark Transliterator",
  "Map Latin letters into the reduced 16-rune Younger Futhark inventory with explicit many-to-one substitutions; it does not reconstruct Old Norse spelling.",
  toYoungerFuthark,
  ["runes", "transliteration", "younger futhark"],
);
export const angloSaxonFuthorc = preset(
  "convert/text-to-anglo-saxon-futhorc",
  "Anglo-Saxon Futhorc Transliterator",
  "Substitute Latin letters and selected Old English digraphs with Anglo-Saxon futhorc runes while preserving unsupported characters.",
  toAngloSaxonFuthorc,
  ["futhorc", "old english", "runes"],
);
export const ogham = preset(
  "convert/text-to-ogham",
  "Ogham Transliterator",
  "Map supported Latin transliteration letters and selected vowel combinations to Unicode Ogham letters without claiming historical-language translation.",
  toOgham,
  ["ogham", "transliteration", "unicode"],
);
export const phoenician = preset(
  "convert/text-to-phoenician",
  "Phoenician Transliteration Converter",
  "Map conventional Latin and ASCII transliteration symbols for the 22-letter Phoenician abjad to Unicode Phoenician letters while preserving unsupported text.",
  toPhoenician,
  ["phoenician", "transliteration", "unicode"],
  "abgdhwzHTyklmnsEpSqr$t",
);
export const glagolitic = preset(
  "convert/text-to-glagolitic",
  "Glagolitic Character Converter",
  "Map basic Latin alphabet positions to the first 26 Unicode Glagolitic letters as a character-substitution aid, not as Church Slavonic translation.",
  toGlagolitic,
  ["glagolitic", "substitution", "unicode"],
);
export const gothic = preset(
  "convert/text-to-gothic",
  "Gothic Alphabet Transliterator",
  "Map basic Latin letters to practical Unicode Gothic transliteration equivalents, including multi-rune output where Gothic lacks the same Latin letter.",
  toGothic,
  ["gothic", "transliteration", "unicode"],
);
export const coptic = preset(
  "convert/text-to-coptic",
  "Coptic Character Converter",
  "Map basic Latin alphabet positions to a practical Coptic character set for visual substitution without translating words into the Coptic language.",
  toCoptic,
  ["coptic", "substitution", "unicode"],
);
export const oldItalic = preset(
  "convert/text-to-old-italic",
  "Old Italic Character Converter",
  "Map basic Latin alphabet positions to the 26-character Unicode Old Italic sequence as a visual substitution rather than a historical-language transcription.",
  toOldItalic,
  ["old italic", "substitution", "unicode"],
);
export const serbianCyrillic = preset(
  "convert/serbian-latin-to-cyrillic",
  "Serbian Latin-to-Cyrillic Converter",
  "Transliterate the Serbian Latin alphabet to Serbian Cyrillic with longest-match handling for dž, lj, and nj digraphs.",
  toSerbianCyrillic,
  ["cyrillic", "serbian", "transliteration"],
  "Dobar dan, ljubavi",
);
export const betaCodeGreek = preset(
  "convert/beta-code-to-greek",
  "Basic Beta Code to Greek Converter",
  "Convert the core lowercase ASCII letter inventory used by Beta Code into Greek letters and apply final sigma before common word boundaries.",
  toBetaCodeGreek,
  ["beta code", "greek", "transliteration"],
  "logos anthropos",
);
export const buckwalterArabic = preset(
  "convert/buckwalter-to-arabic",
  "Buckwalter-to-Arabic Converter",
  "Convert standard one-character Buckwalter Arabic transliteration symbols, including diacritics, into their Unicode Arabic characters.",
  toBuckwalterArabic,
  ["arabic", "buckwalter", "transliteration"],
  "AlslAm Elykm",
);

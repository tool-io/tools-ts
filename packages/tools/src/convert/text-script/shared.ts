import { defineTool, type ToolDefinition } from "../../core/definition.js";
import { utf8Encode } from "../../core/encoding.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess } from "../../core/result.js";

export type TextScriptInput = { readonly text: string };
export type TextScriptOutput = { readonly convertedText: string };

export type TextScriptConfig = {
  readonly aliases?: readonly string[];
  readonly description: string;
  readonly id: `convert/${string}`;
  readonly keywords?: readonly string[];
  readonly title: string;
  readonly transform: (text: string) => string;
  readonly exampleText?: string;
};

export const calculateTextScript = (
  input: unknown,
  transform: (text: string) => string,
) => {
  if (
    typeof input !== "object" ||
    input === null ||
    Array.isArray(input) ||
    typeof (input as Record<string, unknown>).text !== "string"
  )
    return invalidInput([
      { code: "text_required", field: "text", message: "Text is required." },
    ]);
  if (Object.keys(input).some((field) => field !== "text"))
    return invalidInput([
      { code: "unknown_field", field: "", message: "Only text is supported." },
    ]);
  const text = (input as TextScriptInput).text;
  if (text.length > 100_000)
    return invalidInput([
      {
        code: "resource_limit_exceeded",
        field: "text",
        message: "Text must contain at most 100,000 UTF-16 code units.",
      },
    ]);
  return toolSuccess({ convertedText: transform(text) });
};

export const createTextScriptTool = (
  config: TextScriptConfig,
): ToolDefinition<TextScriptInput, TextScriptOutput> =>
  defineTool<TextScriptInput, TextScriptOutput>({
    contractVersion: 1,
    description: config.description,
    discovery: {
      aliases: config.aliases ?? [],
      collections: ["encode-decode", "text"],
      keywords: ["convert", "text", ...(config.keywords ?? [])],
    },
    execute: (input) => calculateTextScript(input, config.transform),
    execution: { kind: "pure" },
    id: config.id,
    inputSchema: {
      additionalProperties: false,
      properties: { text: { maxLength: 100_000, type: "string" } },
      required: ["text"],
      type: "object",
    },
    outputSchema: {
      additionalProperties: false,
      properties: { convertedText: { type: "string" } },
      required: ["convertedText"],
      type: "object",
    },
    ports: {
      inputs: [
        {
          id: "text",
          label: "Plain text",
          required: true,
          valueType: { format: "text", type: "string" },
        },
      ],
      outputs: [
        {
          id: "convertedText",
          label: config.title.replace(/ Converter$/u, ""),
          valueType: { format: "text", type: "string" },
        },
      ],
    },
    title: config.title,
  });

export const createTextScriptExample = (
  transform: (text: string) => string,
  text = "Tool.io 123",
): ToolExample<TextScriptInput, TextScriptOutput> => ({
  input: { text },
  output: { convertedText: transform(text) },
});

export const createTextScriptModule = (config: TextScriptConfig) => {
  const tool = createTextScriptTool(config);
  return {
    example: createTextScriptExample(config.transform, config.exampleText),
    run: tool.execute,
    tool,
  } as const;
};

const mapCodePoints = (
  text: string,
  map: Readonly<Record<string, string>>,
): string =>
  Array.from(text, (character) => map[character] ?? character).join("");

const alphabetMap = (
  uppercase: string,
  lowercase = uppercase,
  digits = "",
): Readonly<Record<string, string>> => {
  const source =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const target = `${uppercase}${lowercase}${digits}`;
  const result: Record<string, string> = {};
  Array.from(source).forEach((character, index) => {
    const replacement = Array.from(target)[index];
    if (replacement !== undefined) result[character] = replacement;
  });
  return result;
};

const range = (start: number, length: number): string =>
  Array.from({ length }, (_, index) =>
    String.fromCodePoint(start + index),
  ).join("");

export const toFullwidth = (text: string): string =>
  Array.from(text, (character) => {
    const code = character.codePointAt(0)!;
    if (character === " ") return "　";
    return code >= 0x21 && code <= 0x7e
      ? String.fromCodePoint(code + 0xfee0)
      : character;
  }).join("");

export const toCircled = (text: string): string =>
  mapCodePoints(
    text,
    alphabetMap(range(0x24b6, 26), range(0x24d0, 26), `⓪${range(0x2460, 9)}`),
  );

export const toParenthesized = (text: string): string =>
  mapCodePoints(
    text,
    alphabetMap(range(0x249c, 26), range(0x249c, 26), `0${range(0x2474, 9)}`),
  );

export const toNegativeCircled = (text: string): string =>
  mapCodePoints(
    text,
    alphabetMap(range(0x1f150, 26), range(0x1f150, 26), `⓿${range(0x2776, 9)}`),
  );

export const toSquared = (text: string): string =>
  mapCodePoints(text, alphabetMap(range(0x1f130, 26), range(0x1f130, 26)));

export const toNegativeSquared = (text: string): string =>
  mapCodePoints(text, alphabetMap(range(0x1f170, 26), range(0x1f170, 26)));

const superscriptMap: Readonly<Record<string, string>> = {
  "0": "⁰",
  "1": "¹",
  "2": "²",
  "3": "³",
  "4": "⁴",
  "5": "⁵",
  "6": "⁶",
  "7": "⁷",
  "8": "⁸",
  "9": "⁹",
  "+": "⁺",
  "-": "⁻",
  "=": "⁼",
  "(": "⁽",
  ")": "⁾",
  a: "ᵃ",
  b: "ᵇ",
  c: "ᶜ",
  d: "ᵈ",
  e: "ᵉ",
  f: "ᶠ",
  g: "ᵍ",
  h: "ʰ",
  i: "ⁱ",
  j: "ʲ",
  k: "ᵏ",
  l: "ˡ",
  m: "ᵐ",
  n: "ⁿ",
  o: "ᵒ",
  p: "ᵖ",
  r: "ʳ",
  s: "ˢ",
  t: "ᵗ",
  u: "ᵘ",
  v: "ᵛ",
  w: "ʷ",
  x: "ˣ",
  y: "ʸ",
  z: "ᶻ",
};
for (const [letter, replacement] of Object.entries({
  A: "ᴬ",
  B: "ᴮ",
  D: "ᴰ",
  E: "ᴱ",
  G: "ᴳ",
  H: "ᴴ",
  I: "ᴵ",
  J: "ᴶ",
  K: "ᴷ",
  L: "ᴸ",
  M: "ᴹ",
  N: "ᴺ",
  O: "ᴼ",
  P: "ᴾ",
  R: "ᴿ",
  T: "ᵀ",
  U: "ᵁ",
  V: "ⱽ",
  W: "ᵂ",
}))
  (superscriptMap as Record<string, string>)[letter] = replacement;

export const toSuperscript = (text: string): string =>
  mapCodePoints(text, superscriptMap);

const subscriptMap: Readonly<Record<string, string>> = {
  "0": "₀",
  "1": "₁",
  "2": "₂",
  "3": "₃",
  "4": "₄",
  "5": "₅",
  "6": "₆",
  "7": "₇",
  "8": "₈",
  "9": "₉",
  "+": "₊",
  "-": "₋",
  "=": "₌",
  "(": "₍",
  ")": "₎",
  a: "ₐ",
  e: "ₑ",
  h: "ₕ",
  i: "ᵢ",
  j: "ⱼ",
  k: "ₖ",
  l: "ₗ",
  m: "ₘ",
  n: "ₙ",
  o: "ₒ",
  p: "ₚ",
  r: "ᵣ",
  s: "ₛ",
  t: "ₜ",
  u: "ᵤ",
  v: "ᵥ",
  x: "ₓ",
};

export const toSubscript = (text: string): string =>
  mapCodePoints(text, subscriptMap);

const smallCapsMap = alphabetMap(
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  "ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘQʀꜱᴛᴜᴠᴡXʏᴢ",
);
export const toSmallCaps = (text: string): string =>
  mapCodePoints(text, smallCapsMap);

type MathematicalStyle = {
  readonly digits?: number;
  readonly lower: number;
  readonly upper: number;
  readonly exceptions?: Readonly<Record<string, string>>;
};

const mathematical = (text: string, style: MathematicalStyle): string =>
  Array.from(text, (character) => {
    if (style.exceptions?.[character]) return style.exceptions[character]!;
    const code = character.codePointAt(0)!;
    if (code >= 65 && code <= 90)
      return String.fromCodePoint(style.upper + code - 65);
    if (code >= 97 && code <= 122)
      return String.fromCodePoint(style.lower + code - 97);
    if (style.digits !== undefined && code >= 48 && code <= 57)
      return String.fromCodePoint(style.digits + code - 48);
    return character;
  }).join("");

export const toMathematicalBold = (text: string): string =>
  mathematical(text, { digits: 0x1d7ce, lower: 0x1d41a, upper: 0x1d400 });
export const toMathematicalItalic = (text: string): string =>
  mathematical(text, {
    exceptions: { h: "ℎ" },
    lower: 0x1d44e,
    upper: 0x1d434,
  });
export const toMathematicalBoldItalic = (text: string): string =>
  mathematical(text, { lower: 0x1d482, upper: 0x1d468 });
export const toMathematicalScript = (text: string): string =>
  mathematical(text, {
    exceptions: {
      B: "ℬ",
      E: "ℰ",
      F: "ℱ",
      H: "ℋ",
      I: "ℐ",
      L: "ℒ",
      M: "ℳ",
      R: "ℛ",
      e: "ℯ",
      g: "ℊ",
      l: "ℓ",
      o: "ℴ",
    },
    lower: 0x1d4b6,
    upper: 0x1d49c,
  });
export const toMathematicalBoldScript = (text: string): string =>
  mathematical(text, { lower: 0x1d4ea, upper: 0x1d4d0 });
export const toMathematicalFraktur = (text: string): string =>
  mathematical(text, {
    exceptions: { C: "ℭ", H: "ℌ", I: "ℑ", R: "ℜ", Z: "ℨ" },
    lower: 0x1d51e,
    upper: 0x1d504,
  });
export const toMathematicalBoldFraktur = (text: string): string =>
  mathematical(text, { lower: 0x1d586, upper: 0x1d56c });
export const toMathematicalDoubleStruck = (text: string): string =>
  mathematical(text, {
    digits: 0x1d7d8,
    exceptions: {
      C: "ℂ",
      H: "ℍ",
      N: "ℕ",
      P: "ℙ",
      Q: "ℚ",
      R: "ℝ",
      Z: "ℤ",
    },
    lower: 0x1d552,
    upper: 0x1d538,
  });
export const toMathematicalSansSerif = (text: string): string =>
  mathematical(text, { digits: 0x1d7e2, lower: 0x1d5ba, upper: 0x1d5a0 });
export const toMathematicalSansSerifBold = (text: string): string =>
  mathematical(text, { digits: 0x1d7ec, lower: 0x1d5ee, upper: 0x1d5d4 });
export const toMathematicalSansSerifItalic = (text: string): string =>
  mathematical(text, { lower: 0x1d622, upper: 0x1d608 });
export const toMathematicalSansSerifBoldItalic = (text: string): string =>
  mathematical(text, { lower: 0x1d656, upper: 0x1d63c });
export const toMathematicalMonospace = (text: string): string =>
  mathematical(text, { digits: 0x1d7f6, lower: 0x1d68a, upper: 0x1d670 });

export const toRegionalIndicator = (text: string): string =>
  Array.from(text, (character) => {
    const code = character.toUpperCase().codePointAt(0)!;
    return code >= 65 && code <= 90
      ? String.fromCodePoint(0x1f1e6 + code - 65)
      : character;
  }).join("\u200b");

const upsideDownMap: Readonly<Record<string, string>> = {
  "!": "¡",
  "?": "¿",
  "(": ")",
  ")": "(",
  "[": "]",
  "]": "[",
  "{": "}",
  "}": "{",
  a: "ɐ",
  b: "q",
  c: "ɔ",
  d: "p",
  e: "ǝ",
  f: "ɟ",
  g: "ƃ",
  h: "ɥ",
  i: "ᴉ",
  j: "ɾ",
  k: "ʞ",
  l: "l",
  m: "ɯ",
  n: "u",
  p: "d",
  q: "b",
  r: "ɹ",
  t: "ʇ",
  u: "n",
  v: "ʌ",
  w: "ʍ",
  y: "ʎ",
};
export const toUpsideDown = (text: string): string =>
  Array.from(text, (character) => upsideDownMap[character] ?? character)
    .reverse()
    .join("");

export const toA1z26 = (text: string): string =>
  Array.from(text, (character) => {
    const code = character.toUpperCase().codePointAt(0)!;
    if (code >= 65 && code <= 90) return String(code - 64);
    if (/\s/u.test(character)) return "/";
    return character;
  }).join(" ");

export const toUnicodeCodePoints = (text: string): string =>
  Array.from(
    text,
    (character) =>
      `U+${character.codePointAt(0)!.toString(16).toUpperCase().padStart(4, "0")}`,
  ).join(" ");

export const toUnicodeEscape = (text: string): string =>
  Array.from(text, (character) => {
    const code = character.codePointAt(0)!;
    return code <= 0xffff
      ? `\\u${code.toString(16).toUpperCase().padStart(4, "0")}`
      : `\\u{${code.toString(16).toUpperCase()}}`;
  }).join("");

export const toHtmlDecimalEntities = (text: string): string =>
  Array.from(text, (character) => `&#${character.codePointAt(0)!};`).join("");
export const toHtmlHexEntities = (text: string): string =>
  Array.from(
    text,
    (character) =>
      `&#x${character.codePointAt(0)!.toString(16).toUpperCase()};`,
  ).join("");
export const toCssUnicodeEscape = (text: string): string =>
  Array.from(
    text,
    (character) => `\\${character.codePointAt(0)!.toString(16).toUpperCase()} `,
  ).join("");

export const toQuotedPrintable = (text: string): string => {
  const encoded = Array.from(utf8Encode(text), (byte) =>
    (byte >= 33 && byte <= 60) || (byte >= 62 && byte <= 126)
      ? String.fromCharCode(byte)
      : `=${byte.toString(16).toUpperCase().padStart(2, "0")}`,
  ).join("");
  const lines: string[] = [];
  let remaining = encoded;
  while (remaining.length > 75) {
    let cut = 75;
    if (remaining[cut - 1] === "=") cut -= 1;
    else if (remaining[cut - 2] === "=") cut -= 2;
    lines.push(`${remaining.slice(0, cut)}=`);
    remaining = remaining.slice(cut);
  }
  lines.push(remaining);
  return lines.join("\r\n");
};

const nato = [
  "Alfa",
  "Bravo",
  "Charlie",
  "Delta",
  "Echo",
  "Foxtrot",
  "Golf",
  "Hotel",
  "India",
  "Juliett",
  "Kilo",
  "Lima",
  "Mike",
  "November",
  "Oscar",
  "Papa",
  "Quebec",
  "Romeo",
  "Sierra",
  "Tango",
  "Uniform",
  "Victor",
  "Whiskey",
  "X-ray",
  "Yankee",
  "Zulu",
] as const;
const natoDigits = [
  "Zero",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
] as const;
export const toNatoPhonetic = (text: string): string =>
  Array.from(text, (character) => {
    const upper = character.toUpperCase();
    const code = upper.codePointAt(0)!;
    if (code >= 65 && code <= 90) return nato[code - 65]!;
    if (code >= 48 && code <= 57) return natoDigits[code - 48]!;
    if (/\s/u.test(character)) return "/";
    return character;
  }).join(" ");

const ita2Letters: Readonly<Record<string, number>> = {
  "\n": 2,
  "\r": 8,
  " ": 4,
  A: 3,
  B: 25,
  C: 14,
  D: 9,
  E: 1,
  F: 13,
  G: 26,
  H: 20,
  I: 6,
  J: 11,
  K: 15,
  L: 18,
  M: 28,
  N: 12,
  O: 24,
  P: 22,
  Q: 23,
  R: 10,
  S: 5,
  T: 16,
  U: 7,
  V: 30,
  W: 19,
  X: 29,
  Y: 21,
  Z: 17,
};
const ita2Figures: Readonly<Record<string, number>> = {
  "\n": 2,
  "\r": 8,
  " ": 4,
  "-": 3,
  "?": 25,
  ":": 14,
  "3": 1,
  "!": 13,
  "&": 26,
  "£": 20,
  "8": 6,
  "'": 5,
  "(": 15,
  ")": 18,
  ".": 28,
  ",": 12,
  "9": 24,
  "0": 22,
  "1": 23,
  "4": 10,
  "5": 16,
  "7": 7,
  "=": 30,
  "2": 19,
  "/": 29,
  "6": 21,
  "+": 17,
};
const fiveBits = (value: number): string => value.toString(2).padStart(5, "0");
export const toBaudotIta2 = (text: string): string => {
  let mode: "figures" | "letters" = "letters";
  const output: string[] = [];
  for (const source of text.toUpperCase()) {
    const letter = ita2Letters[source];
    const figure = ita2Figures[source];
    if (letter !== undefined && (figure === undefined || mode === "letters")) {
      if (mode !== "letters") {
        output.push(fiveBits(31));
        mode = "letters";
      }
      output.push(fiveBits(letter));
    } else if (figure !== undefined) {
      if (mode !== "figures") {
        output.push(fiveBits(27));
        mode = "figures";
      }
      output.push(fiveBits(figure));
    } else {
      output.push("?????");
    }
  }
  return output.join(" ");
};

const toBase4Alphabet = (text: string, alphabet: string): string =>
  Array.from(utf8Encode(text), (byte) =>
    [6, 4, 2, 0].map((shift) => alphabet[(byte >> shift) & 3]).join(""),
  ).join(" ");
export const toDnaBase4 = (text: string): string =>
  toBase4Alphabet(text, "ACGT");
export const toRnaBase4 = (text: string): string =>
  toBase4Alphabet(text, "ACGU");
export const toUtf8Decimal = (text: string): string =>
  Array.from(utf8Encode(text)).join(" ");
export const toUtf8Octal = (text: string): string =>
  Array.from(utf8Encode(text), (byte) =>
    byte.toString(8).padStart(3, "0"),
  ).join(" ");
export const toUtf16CodeUnits = (text: string): string =>
  Array.from({ length: text.length }, (_, index) =>
    text.charCodeAt(index).toString(16).toUpperCase().padStart(4, "0"),
  ).join(" ");
export const toKeycapSymbols = (text: string): string =>
  Array.from(text, (character) =>
    /^[0-9#*]$/u.test(character) ? `${character}\uFE0F\u20E3` : character,
  ).join("");

const longestTokenMap = (
  text: string,
  map: Readonly<Record<string, string>>,
): string => {
  const tokens = Object.keys(map).sort(
    (left, right) => right.length - left.length,
  );
  const lower = text.toLowerCase();
  let output = "";
  for (let index = 0; index < text.length;) {
    const token = tokens.find((candidate) =>
      lower.startsWith(candidate, index),
    );
    if (token) {
      output += map[token];
      index += token.length;
    } else {
      output += text[index]!;
      index += 1;
    }
  }
  return output;
};

const elderFuthark: Readonly<Record<string, string>> = {
  ng: "ᛜ",
  th: "ᚦ",
  a: "ᚨ",
  b: "ᛒ",
  c: "ᚲ",
  d: "ᛞ",
  e: "ᛖ",
  f: "ᚠ",
  g: "ᚷ",
  h: "ᚺ",
  i: "ᛁ",
  j: "ᛃ",
  k: "ᚲ",
  l: "ᛚ",
  m: "ᛗ",
  n: "ᚾ",
  o: "ᛟ",
  p: "ᛈ",
  q: "ᚲ",
  r: "ᚱ",
  s: "ᛊ",
  t: "ᛏ",
  u: "ᚢ",
  v: "ᚹ",
  w: "ᚹ",
  x: "ᚲᛊ",
  y: "ᛃ",
  z: "ᛉ",
};
export const toElderFuthark = (text: string): string =>
  longestTokenMap(text, elderFuthark);

const youngerFuthark: Readonly<Record<string, string>> = {
  th: "ᚦ",
  a: "ᛅ",
  b: "ᛒ",
  c: "ᚴ",
  d: "ᛏ",
  e: "ᛅ",
  f: "ᚠ",
  g: "ᚴ",
  h: "ᚼ",
  i: "ᛁ",
  j: "ᛁ",
  k: "ᚴ",
  l: "ᛚ",
  m: "ᛘ",
  n: "ᚾ",
  o: "ᚢ",
  p: "ᛒ",
  q: "ᚴ",
  r: "ᚱ",
  s: "ᛋ",
  t: "ᛏ",
  u: "ᚢ",
  v: "ᚠ",
  w: "ᚢ",
  x: "ᚴᛋ",
  y: "ᚢ",
  z: "ᛋ",
};
export const toYoungerFuthark = (text: string): string =>
  longestTokenMap(text, youngerFuthark);

const futhorc: Readonly<Record<string, string>> = {
  ae: "ᚫ",
  ea: "ᛠ",
  eo: "ᛇ",
  ing: "ᛝ",
  ng: "ᛝ",
  th: "ᚦ",
  a: "ᚪ",
  b: "ᛒ",
  c: "ᚳ",
  d: "ᛞ",
  e: "ᛖ",
  f: "ᚠ",
  g: "ᚷ",
  h: "ᚻ",
  i: "ᛁ",
  j: "ᛄ",
  k: "ᚳ",
  l: "ᛚ",
  m: "ᛗ",
  n: "ᚾ",
  o: "ᚩ",
  p: "ᛈ",
  q: "ᚳ",
  r: "ᚱ",
  s: "ᛋ",
  t: "ᛏ",
  u: "ᚢ",
  v: "ᚠ",
  w: "ᚹ",
  x: "ᛉ",
  y: "ᚣ",
  z: "ᛉ",
};
export const toAngloSaxonFuthorc = (text: string): string =>
  longestTokenMap(text, futhorc);

const ogham: Readonly<Record<string, string>> = {
  ae: "ᚕ",
  ea: "ᚓ",
  ia: "ᚔ",
  io: "ᚒ",
  ui: "ᚖ",
  a: "ᚐ",
  b: "ᚁ",
  c: "ᚉ",
  d: "ᚇ",
  e: "ᚓ",
  f: "ᚃ",
  g: "ᚌ",
  h: "ᚆ",
  i: "ᚔ",
  l: "ᚂ",
  m: "ᚋ",
  n: "ᚅ",
  o: "ᚑ",
  p: "ᚚ",
  q: "ᚊ",
  r: "ᚏ",
  s: "ᚄ",
  t: "ᚈ",
  u: "ᚒ",
  v: "ᚃ",
  w: "ᚒ",
  x: "ᚕ",
  y: "ᚔ",
  z: "ᚎ",
};
export const toOgham = (text: string): string => longestTokenMap(text, ogham);

const phoenician: Readonly<Record<string, string>> = {
  $: "𐤔",
  E: "𐤏",
  H: "𐤇",
  S: "𐤑",
  T: "𐤈",
  a: "𐤀",
  b: "𐤁",
  d: "𐤃",
  g: "𐤂",
  h: "𐤄",
  k: "𐤊",
  l: "𐤋",
  m: "𐤌",
  n: "𐤍",
  p: "𐤐",
  q: "𐤒",
  r: "𐤓",
  s: "𐤎",
  t: "𐤕",
  w: "𐤅",
  y: "𐤉",
  z: "𐤆",
  ḥ: "𐤇",
  ṣ: "𐤑",
  ṭ: "𐤈",
  š: "𐤔",
  ʿ: "𐤏",
};
export const toPhoenician = (text: string): string =>
  mapCodePoints(text, phoenician);

const glagolitic = alphabetMap(range(0x2c00, 26), range(0x2c30, 26));
export const toGlagolitic = (text: string): string =>
  mapCodePoints(text, glagolitic);

const gothicLetters = [
  "𐌰",
  "𐌱",
  "𐌲",
  "𐌳",
  "𐌴",
  "𐍆",
  "𐌲",
  "𐌷",
  "𐌹",
  "𐌾",
  "𐌺",
  "𐌻",
  "𐌼",
  "𐌽",
  "𐍉",
  "𐍀",
  "𐌵",
  "𐍂",
  "𐍃",
  "𐍄",
  "𐌿",
  "𐍅",
  "𐍅",
  "𐌺𐍃",
  "𐌾",
  "𐌶",
];
const gothic: Readonly<Record<string, string>> = Object.fromEntries(
  Array.from(
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
    (letter, index) => [letter, gothicLetters[index % 26]!],
  ),
);
export const toGothic = (text: string): string => mapCodePoints(text, gothic);

const copticLetters = Array.from(
  "ⲀⲂⲄⲆⲈϤⲄϨⲒϪⲔⲖⲘⲚⲞⲠⲬⲢⲤⲦⲨⲂⲰⲜⲒⲌⲁⲃⲅⲇⲉϥⲅϩⲓϫⲕⲗⲙⲛⲟⲡⲭⲣⲥⲧⲩⲃⲱⲝⲓⲍ",
).join("");
const coptic = alphabetMap(copticLetters.slice(0, 26), copticLetters.slice(26));
export const toCoptic = (text: string): string => mapCodePoints(text, coptic);

const oldItalic = alphabetMap(range(0x10300, 26), range(0x10300, 26));
export const toOldItalic = (text: string): string =>
  mapCodePoints(text, oldItalic);

const serbianCyrillic: Readonly<Record<string, string>> = {
  dž: "џ",
  lj: "љ",
  nj: "њ",
  a: "а",
  b: "б",
  c: "ц",
  č: "ч",
  ć: "ћ",
  d: "д",
  đ: "ђ",
  e: "е",
  f: "ф",
  g: "г",
  h: "х",
  i: "и",
  j: "ј",
  k: "к",
  l: "л",
  m: "м",
  n: "н",
  o: "о",
  p: "п",
  r: "р",
  s: "с",
  š: "ш",
  t: "т",
  u: "у",
  v: "в",
  z: "з",
  ž: "ж",
};
export const toSerbianCyrillic = (text: string): string => {
  const tokens = Object.keys(serbianCyrillic).sort(
    (left, right) => right.length - left.length,
  );
  const lower = text.toLowerCase();
  let output = "";
  for (let index = 0; index < text.length;) {
    const token = tokens.find((candidate) =>
      lower.startsWith(candidate, index),
    );
    if (!token) {
      output += text[index]!;
      index += 1;
      continue;
    }
    const source = text.slice(index, index + token.length);
    const replacement = serbianCyrillic[token]!;
    output += /^[A-ZČĆĐŠŽ]/u.test(source)
      ? replacement.toUpperCase()
      : replacement;
    index += token.length;
  }
  return output;
};

const betaGreek: Readonly<Record<string, string>> = {
  a: "α",
  b: "β",
  c: "ξ",
  d: "δ",
  e: "ε",
  f: "φ",
  g: "γ",
  h: "η",
  i: "ι",
  k: "κ",
  l: "λ",
  m: "μ",
  n: "ν",
  o: "ο",
  p: "π",
  q: "θ",
  r: "ρ",
  s: "σ",
  t: "τ",
  u: "υ",
  w: "ω",
  x: "χ",
  y: "ψ",
  z: "ζ",
};
export const toBetaCodeGreek = (text: string): string =>
  mapCodePoints(text, betaGreek).replace(/σ(?=\s|$|[.,;:!?])/gu, "ς");

const buckwalter: Readonly<Record<string, string>> = {
  "'": "ء",
  "|": "آ",
  ">": "أ",
  "&": "ؤ",
  "<": "إ",
  "}": "ئ",
  A: "ا",
  b: "ب",
  p: "ة",
  t: "ت",
  v: "ث",
  j: "ج",
  H: "ح",
  x: "خ",
  d: "د",
  "*": "ذ",
  r: "ر",
  z: "ز",
  s: "س",
  $: "ش",
  S: "ص",
  D: "ض",
  T: "ط",
  Z: "ظ",
  E: "ع",
  g: "غ",
  _: "ـ",
  f: "ف",
  q: "ق",
  k: "ك",
  l: "ل",
  m: "م",
  n: "ن",
  h: "ه",
  w: "و",
  Y: "ى",
  y: "ي",
  F: "ً",
  N: "ٌ",
  K: "ٍ",
  a: "َ",
  u: "ُ",
  i: "ِ",
  "~": "ّ",
  o: "ْ",
  "`": "ٰ",
  "{": "ٱ",
};
export const toBuckwalterArabic = (text: string): string =>
  mapCodePoints(text, buckwalter);

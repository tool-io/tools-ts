import { simpleError } from "../core/simple.js";
import { positive } from "../ergonomics/shared.js";
export * from "../game/shared.js";
export const textBound = (text: string): string => {
  if (text.length > 16384)
    simpleError(
      "text",
      "At most 16384 UTF-16 code units required for this text operation.",
    );
  return text;
};
export const identifier = (name: string): string =>
  /^[A-Za-z][A-Za-z0-9_-]{0,63}$(?![\s\S])/.test(name)
    ? name
    : simpleError("name", "Bounded ASCII identifier required.");
export const lexemes = (text: string): string[] =>
  textBound(text)
    .normalize("NFC")
    .toLowerCase()
    .match(/[\p{L}\p{M}]+/gu) ?? [];
export const strictTokens = (text: string): string[] => {
  textBound(text);
  const t = text.trim().split(/\s+/u);
  if (!text.trim() || t.length > 1000)
    simpleError(
      "tokens",
      "1–1000 explicit whitespace-separated tokens required.",
    );
  return t;
};
export const lexicon = (text: string): Set<string> => {
  const tokens = strictTokens(text).map((v) =>
    v.normalize("NFC").toLowerCase(),
  );
  if (tokens.some((v) => !/^[\p{L}\p{M}]+$(?![\s\S])/u.test(v)))
    simpleError(
      "dictionary",
      "Dictionary entries must be explicit word tokens.",
    );
  return new Set(tokens);
};
export const locale = (tag: string): string => {
  if (tag.length > 128)
    return simpleError(
      "locale",
      "Bounded supported Unicode locale identifier required.",
    );
  try {
    const canonical = Intl.getCanonicalLocales(tag)[0];
    if (
      !canonical ||
      Intl.NumberFormat.supportedLocalesOf([canonical]).length !== 1
    )
      return simpleError(
        "locale",
        "Locale must be supported, not silently replaced by a default.",
      );
    return canonical;
  } catch {
    return simpleError(
      "locale",
      "Valid supported Unicode locale identifier required.",
    );
  }
};
const vowels: Record<string, readonly string[]> = {
  i: ["close", "front", "unrounded"],
  y: ["close", "front", "rounded"],
  ɨ: ["close", "central", "unrounded"],
  ʉ: ["close", "central", "rounded"],
  ɯ: ["close", "back", "unrounded"],
  u: ["close", "back", "rounded"],
  ɪ: ["near-close", "near-front", "unrounded"],
  ʏ: ["near-close", "near-front", "rounded"],
  ʊ: ["near-close", "near-back", "rounded"],
  e: ["close-mid", "front", "unrounded"],
  ø: ["close-mid", "front", "rounded"],
  ɘ: ["close-mid", "central", "unrounded"],
  ɵ: ["close-mid", "central", "rounded"],
  ɤ: ["close-mid", "back", "unrounded"],
  o: ["close-mid", "back", "rounded"],
  ə: ["mid", "central", "unrounded"],
  ɛ: ["open-mid", "front", "unrounded"],
  œ: ["open-mid", "front", "rounded"],
  ɜ: ["open-mid", "central", "unrounded"],
  ɞ: ["open-mid", "central", "rounded"],
  ʌ: ["open-mid", "back", "unrounded"],
  ɔ: ["open-mid", "back", "rounded"],
  æ: ["near-open", "front", "unrounded"],
  ɐ: ["near-open", "central", "unrounded"],
  a: ["open", "front", "unrounded"],
  ɶ: ["open", "front", "rounded"],
  ɑ: ["open", "back", "unrounded"],
  ɒ: ["open", "back", "rounded"],
};
export const ipaVowels = (token: string): readonly string[] =>
  Object.hasOwn(vowels, token)
    ? vowels[token]
    : simpleError(
        "vowel",
        "One supported plain pulmonic-chart vowel symbol required; diacritics/diphthongs are not silently stripped.",
      );
const consonants: Record<string, readonly string[]> = {
  p: ["bilabial", "plosive", "voiceless"],
  b: ["bilabial", "plosive", "voiced"],
  t: ["alveolar", "plosive", "voiceless"],
  d: ["alveolar", "plosive", "voiced"],
  k: ["velar", "plosive", "voiceless"],
  g: ["velar", "plosive", "voiced"],
  ɡ: ["velar", "plosive", "voiced"],
  ʔ: ["glottal", "plosive", "voiceless"],
  m: ["bilabial", "nasal", "voiced"],
  n: ["alveolar", "nasal", "voiced"],
  ɲ: ["palatal", "nasal", "voiced"],
  ŋ: ["velar", "nasal", "voiced"],
  f: ["labiodental", "fricative", "voiceless"],
  v: ["labiodental", "fricative", "voiced"],
  θ: ["dental", "fricative", "voiceless"],
  ð: ["dental", "fricative", "voiced"],
  s: ["alveolar", "fricative", "voiceless"],
  z: ["alveolar", "fricative", "voiced"],
  ʃ: ["postalveolar", "fricative", "voiceless"],
  ʒ: ["postalveolar", "fricative", "voiced"],
  x: ["velar", "fricative", "voiceless"],
  ɣ: ["velar", "fricative", "voiced"],
  h: ["glottal", "fricative", "voiceless"],
  ɦ: ["glottal", "fricative", "voiced"],
  r: ["alveolar", "trill", "voiced"],
  ɹ: ["alveolar", "approximant", "voiced"],
  ɾ: ["alveolar", "tap", "voiced"],
  l: ["alveolar", "lateral-approximant", "voiced"],
  j: ["palatal", "approximant", "voiced"],
  w: ["labial-velar", "approximant", "voiced"],
  ʁ: ["uvular", "fricative", "voiced"],
  χ: ["uvular", "fricative", "voiceless"],
};
export const ipaConsonants = (token: string): readonly string[] =>
  Object.hasOwn(consonants, token)
    ? consonants[token]
    : simpleError(
        "consonant",
        "One supported plain basic consonant token required; unsupported affricates/diacritics remain errors.",
      );
const arpa: Record<string, string> = {
  AA: "ɑ",
  AE: "æ",
  AH: "ʌ",
  AO: "ɔ",
  AW: "aʊ",
  AY: "aɪ",
  EH: "ɛ",
  ER: "ɝ",
  EY: "eɪ",
  IH: "ɪ",
  IY: "i",
  OW: "oʊ",
  OY: "ɔɪ",
  UH: "ʊ",
  UW: "u",
  B: "b",
  CH: "tʃ",
  D: "d",
  DH: "ð",
  F: "f",
  G: "ɡ",
  HH: "h",
  JH: "dʒ",
  K: "k",
  L: "l",
  M: "m",
  N: "n",
  NG: "ŋ",
  P: "p",
  R: "ɹ",
  S: "s",
  SH: "ʃ",
  T: "t",
  TH: "θ",
  V: "v",
  W: "w",
  Y: "j",
  Z: "z",
  ZH: "ʒ",
};
export const arpabet = (token: string): string => {
  const m = /^([A-Z]{1,2})([012])?$(?![\s\S])/.exec(token);
  if (!m || !Object.hasOwn(arpa, m[1]))
    return simpleError(
      "arpabet",
      "Known CMU ARPABET token with optional vowel stress 0/1/2 required.",
    );
  const vowel = [
    "AA",
    "AE",
    "AH",
    "AO",
    "AW",
    "AY",
    "EH",
    "ER",
    "EY",
    "IH",
    "IY",
    "OW",
    "OY",
    "UH",
    "UW",
  ].includes(m[1]);
  if (m[2] && !vowel)
    return simpleError("arpabet", "Stress suffix belongs only on vowels.");
  const ipa =
    m[1] === "AH" && m[2] === "0"
      ? "ə"
      : m[1] === "ER" && m[2] === "0"
        ? "ɚ"
        : arpa[m[1]];
  return (m[2] === "1" ? "ˈ" : m[2] === "2" ? "ˌ" : "") + ipa;
};
const sam: Record<string, string> = {
  i: "i",
  y: "y",
  "1": "ɨ",
  "}": "ʉ",
  M: "ɯ",
  u: "u",
  I: "ɪ",
  Y: "ʏ",
  U: "ʊ",
  e: "e",
  "2": "ø",
  "@\\": "ɘ",
  "8": "ɵ",
  "7": "ɤ",
  o: "o",
  "@": "ə",
  E: "ɛ",
  "9": "œ",
  "3": "ɜ",
  "3\\": "ɞ",
  V: "ʌ",
  O: "ɔ",
  "{": "æ",
  "6": "ɐ",
  a: "a",
  "&": "ɶ",
  A: "ɑ",
  Q: "ɒ",
  p: "p",
  b: "b",
  t: "t",
  d: "d",
  k: "k",
  g: "ɡ",
  "?": "ʔ",
  m: "m",
  n: "n",
  J: "ɲ",
  N: "ŋ",
  f: "f",
  v: "v",
  T: "θ",
  D: "ð",
  s: "s",
  z: "z",
  S: "ʃ",
  Z: "ʒ",
  x: "x",
  G: "ɣ",
  h: "h",
  "h\\": "ɦ",
  r: "r",
  "r\\": "ɹ",
  "4": "ɾ",
  l: "l",
  j: "j",
  w: "w",
  R: "ʁ",
  X: "χ",
  ":": "ː",
  '"': "ˈ",
  "%": "ˌ",
  "_~": "̃",
};
export const sampa = (token: string): string =>
  Object.hasOwn(sam, token)
    ? sam[token]
    : simpleError(
        "sampa",
        "Explicit supported X-SAMPA base/length/stress/nasalization token required; concatenation is not guessed.",
      );
export const nPvi = (durations: readonly number[]): number => {
  if (durations.length < 2)
    return simpleError(
      "durations",
      "At least two positive observed intervals required.",
    );
  durations.forEach((v) => positive(v, "duration"));
  return (
    (100 *
      durations
        .slice(1)
        .reduce(
          (s, v, i) =>
            s + Math.abs(v - durations[i]) / ((v + durations[i]) / 2),
          0,
        )) /
    (durations.length - 1)
  );
};

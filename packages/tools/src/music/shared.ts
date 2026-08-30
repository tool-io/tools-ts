import { simpleError } from "../core/simple.js";
import { bounded } from "../ergonomics/shared.js";
export * from "../ergonomics/shared.js";
export const pc = (n: number): number => ((n % 12) + 12) % 12;
export const midi = (n: number): number => bounded(n, "midi", 0, 127);
const letters = "CDEFGAB",
  natural = [0, 2, 4, 5, 7, 9, 11];
export type Pitch = {
  letter: number;
  accidental: number;
  octave: number | null;
  absolute: number;
  pitchClass: number;
};
export const pitch = (text: string, requireOctave = false): Pitch => {
  const s = text.replaceAll("♯", "#").replaceAll("♭", "b"),
    m = /^([A-G])(#{1,2}|b{1,2}|x)?(-?[0-9]{1,2})?$/.exec(s);
  if (!m || s.length > 8)
    return simpleError(
      "note",
      "Exact uppercase A–G with optional b/bb/#/##/x and scientific octave required.",
    );
  if (requireOctave && m[3] === undefined)
    return simpleError(
      "note",
      "Scientific pitch notation must include octave.",
    );
  const l = letters.indexOf(m[1]),
    acc =
      m[2] === "x"
        ? 2
        : m[2]?.startsWith("#")
          ? m[2].length
          : m[2]?.startsWith("b")
            ? -m[2].length
            : 0,
    o = m[3] === undefined ? null : Number(m[3]),
    a = natural[l] + acc + (o === null ? 0 : 12 * (o + 1));
  if (o !== null) midi(a);
  return {
    letter: l,
    accidental: acc,
    octave: o,
    absolute: a,
    pitchClass: pc(a),
  };
};
export const key = (text: string): Pitch => {
  const p = pitch(text);
  if (p.octave !== null)
    return simpleError("key", "Pitch-class key/chord names must omit octave.");
  return p;
};
export const namePitch = (p: Pitch): string =>
  letters[p.letter] +
  (p.accidental > 0 ? "#".repeat(p.accidental) : "b".repeat(-p.accidental)) +
  (p.octave === null ? "" : String(p.octave));
export const stepSpell = (
  p: Pitch,
  letterSteps: number,
  semitones: number,
): Pitch => {
  if (
    !Number.isSafeInteger(letterSteps) ||
    !Number.isSafeInteger(semitones) ||
    Math.abs(letterSteps) > 28 ||
    Math.abs(semitones) > 48
  )
    return simpleError(
      "interval",
      "Bounded signed diatonic/chromatic steps required.",
    );
  const index = p.letter + letterSteps,
    l = ((index % 7) + 7) % 7,
    o = p.octave === null ? null : p.octave + Math.floor(index / 7),
    target = p.absolute + semitones,
    base =
      natural[l] + (o === null ? 12 * Math.floor(index / 7) : 12 * (o + 1)),
    acc = target - base;
  if (Math.abs(acc) > 2)
    return simpleError(
      "interval",
      "Result requires more than a double accidental.",
    );
  if (o !== null) midi(target);
  return {
    letter: l,
    accidental: acc,
    octave: o,
    absolute: o === null ? natural[l] + acc : target,
    pitchClass: pc(target),
  };
};
export const classifySet = (
  offsets: readonly number[],
  definitions: readonly (readonly number[])[],
): number => {
  if (
    !offsets.length ||
    offsets.length > 128 ||
    offsets.some((v) => !Number.isSafeInteger(v) || v < 0 || v > 127)
  )
    return simpleError(
      "intervals",
      "Nonnegative bounded integer semitone intervals required.",
    );
  const set = [...new Set(offsets.map(pc))].sort((a, b) => a - b);
  return definitions.findIndex(
    (r) => r.length === set.length && r.every((v, i) => v === set[i]),
  );
};
export const tertianQuality = (offsets: readonly number[]): string =>
  ["major", "minor", "diminished", "augmented"][
    classifySet(offsets, [
      [0, 4, 7],
      [0, 3, 7],
      [0, 3, 6],
      [0, 4, 8],
    ])
  ] ?? "unrecognized";
export const seventhQuality = (offsets: readonly number[]): string =>
  [
    "major-seventh",
    "dominant-seventh",
    "minor-seventh",
    "half-diminished",
    "diminished-seventh",
    "minor-major-seventh",
    "augmented-major-seventh",
  ][
    classifySet(offsets, [
      [0, 4, 7, 11],
      [0, 4, 7, 10],
      [0, 3, 7, 10],
      [0, 3, 6, 10],
      [0, 3, 6, 9],
      [0, 3, 7, 11],
      [0, 4, 8, 11],
    ])
  ] ?? "unrecognized";
export const roman = (
  token: string,
): {
  degree: number;
  alteration: number;
  quality: string;
  seventh: boolean;
} => {
  const m =
    /^(bb|b|##|#)?(VII|VI|IV|V|III|II|I|vii|vi|iv|v|iii|ii|i)(o|ø|\+)?(7)?$/.exec(
      token,
    );
  if (!m)
    return simpleError(
      "roman",
      "Roman I–VII/i–vii with up to double accidental, optional o/ø/+ quality and 7 required.",
    );
  const nums = ["I", "II", "III", "IV", "V", "VI", "VII"],
    alteration = m[1]?.startsWith("b") ? -m[1].length : (m[1]?.length ?? 0),
    quality =
      m[3] === "o"
        ? "dim"
        : m[3] === "ø"
          ? "half-dim"
          : m[3] === "+"
            ? "aug"
            : m[2] === m[2].toLowerCase()
              ? "minor"
              : "major";
  if (quality === "half-dim" && !m[4])
    simpleError("roman", "Half-diminished marking requires seventh.");
  return {
    degree: nums.indexOf(m[2].toUpperCase()) + 1,
    alteration,
    quality,
    seventh: !!m[4],
  };
};
export const romanRoot = (tonic: Pitch, token: string): Pitch => {
  const r = roman(token);
  return stepSpell(
    tonic,
    r.degree - 1,
    [0, 2, 4, 5, 7, 9, 11][r.degree - 1] + r.alteration,
  );
};
export const spellingDegree = (
  tonic: Pitch,
  note: Pitch,
): { degree: number; alteration: number } => {
  const d = (((note.letter - tonic.letter) % 7) + 7) % 7,
    expected = stepSpell(tonic, d, [0, 2, 4, 5, 7, 9, 11][d]),
    raw = pc(note.pitchClass - expected.pitchClass),
    a = raw > 6 ? raw - 12 : raw;
  return { degree: d + 1, alteration: a };
};
export const intervalQuality = (
  diatonicSteps: number,
  semitones: number,
): { number: number; quality: string } => {
  bounded(diatonicSteps, "diatonicSteps", 0, 28);
  bounded(semitones, "semitones", 0, 60);
  const n = diatonicSteps + 1,
    degree = diatonicSteps % 7,
    expected =
      [0, 2, 4, 5, 7, 9, 11][degree] + 12 * Math.floor(diatonicSteps / 7),
    d = semitones - expected,
    perfect = [0, 3, 4].includes(degree);
  const quality =
    d === 0
      ? perfect
        ? "perfect"
        : "major"
      : !perfect && d === -1
        ? "minor"
        : d > 0
          ? `${d === 1 ? "" : d + "-times-"}augmented`
          : `${(perfect ? -d : -d - 1) === 1 ? "" : (perfect ? -d : -d - 1) + "-times-"}diminished`;
  return { number: n, quality };
};
export const staffIndex = (p: Pitch): number => {
  if (p.octave === null)
    return simpleError("note", "Octave required for staff position.");
  return 7 * p.octave + p.letter;
};
export const modeName = (mode: string): void => {
  if (mode !== "major" && mode !== "minor")
    simpleError("mode", "Explicit major/minor mode required.");
};
export const keySignature = (tonic: Pitch, mode: string): number => {
  modeName(mode);
  const fifths =
    [0, 2, 4, -1, 1, 3, 5][tonic.letter] +
    7 * tonic.accidental -
    (mode === "minor" ? 3 : 0);
  if (Math.abs(fifths) > 7)
    simpleError(
      "tonic",
      "Conventional keys with at most seven sharps/flats required.",
    );
  return fifths;
};
export const chordIntervals = (quality: string): readonly number[] => {
  const patterns: Record<string, readonly number[]> = {
    major: [0, 4, 7],
    minor: [0, 3, 7],
    diminished: [0, 3, 6],
    augmented: [0, 4, 8],
    "major-seventh": [0, 4, 7, 11],
    "dominant-seventh": [0, 4, 7, 10],
    "minor-seventh": [0, 3, 7, 10],
    "half-diminished": [0, 3, 6, 10],
    "diminished-seventh": [0, 3, 6, 9],
    sus2: [0, 2, 7],
    sus4: [0, 5, 7],
  };
  return Object.hasOwn(patterns, quality)
    ? patterns[quality]
    : simpleError(
        "quality",
        "Supported explicit triad/seventh/suspended chord quality required.",
      );
};
export const chordSymbol = (
  text: string,
): { root: Pitch; suffix: string; bass: Pitch | null } => {
  const m =
    /^([A-G](?:#{1,2}|b{1,2}|x)?)(maj7|m7|dim7|m7b5|sus2|sus4|dim|aug|m|7)?(?:\/([A-G](?:#{1,2}|b{1,2}|x)?))?$/.exec(
      text,
    );
  if (!m || text.length > 32)
    return simpleError(
      "chord",
      "Bounded literal chord with supported triad/seventh/sus suffix and optional slash bass required.",
    );
  return { root: key(m[1]), suffix: m[2] ?? "", bass: m[3] ? key(m[3]) : null };
};
export const symbolQuality = (suffix: string): string =>
  ({
    "": "major",
    m: "minor",
    dim: "diminished",
    aug: "augmented",
    maj7: "major-seventh",
    "7": "dominant-seventh",
    m7: "minor-seventh",
    dim7: "diminished-seventh",
    m7b5: "half-diminished",
    sus2: "sus2",
    sus4: "sus4",
  })[suffix] ?? simpleError("chord", "Unsupported suffix.");
export const clefBottom = (clef: string): number =>
  ({ treble: 30, bass: 18, alto: 24, tenor: 22 })[clef] ??
  simpleError("clef", "treble/bass/alto/tenor clef required.");
export const signature = (numerator: number, denominator: number): void => {
  bounded(numerator, "numerator", 1, 32);
  if (![1, 2, 4, 8, 16, 32, 64].includes(denominator))
    simpleError("denominator", "Power-of-two note denominator 1–64 required.");
};

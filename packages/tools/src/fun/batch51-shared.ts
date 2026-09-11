export * from "../math/batch50-shared.js";
export { sourceFor, indices } from "../random/batch42-shared.js";
import {
  calculateRandomInteger,
  type RandomSource,
} from "../random/number/tool.js";
import {
  simpleError,
  bounded,
  positive,
  nonnegative,
  fraction,
  aligned,
  sum,
  finite,
} from "../math/batch50-shared.js";
import type { ToolDefinition } from "../core/definition.js";
export const draw = (
  low: number,
  high: number,
  random: RandomSource,
): number => {
  const n = calculateRandomInteger(low, high, random);
  if (n === null) simpleError("random", "Existing integer sampler failed.");
  return n;
};
export const shuffle = <T>(values: readonly T[], random: RandomSource): T[] => {
  const a = [...values];
  for (let i = a.length - 1; i > 0; i--) {
    const j = draw(0, i, random);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
export const callExisting = (
  tool: ToolDefinition<unknown, unknown>,
  input: unknown,
): Readonly<Record<string, unknown>> => {
  const r = tool.execute(input);
  if (!r.ok)
    simpleError("existing", "Existing composed calculator rejected evidence.");
  return r.output as Readonly<Record<string, unknown>>;
};
export const asciiWords = (s: string): string[] => {
  if (/[^A-Za-z\s]/.test(s))
    simpleError("text", "Actual ASCII English letters/spaces branch.");
  return s.toLowerCase().trim().split(/\s+/).filter(Boolean);
};
export const utf8 = (s: string): number => {
  let n = 0;
  for (const c of s) {
    const k = c.codePointAt(0)!;
    n += k <= 127 ? 1 : k <= 2047 ? 2 : k <= 65535 ? 3 : 4;
  }
  return n;
};
export const englishInteger = (s: string): string => {
  if (s === "-0" || !/^-?(0|[1-9][0-9]{0,14})$/.test(s))
    simpleError("integer", "Canonical integer decimal |n|<10^15.");
  let n = BigInt(s);
  if (n === 0n) return "zero";
  const negative = n < 0n;
  if (negative) n = -n;
  const one = [
      "zero",
      "one",
      "two",
      "three",
      "four",
      "five",
      "six",
      "seven",
      "eight",
      "nine",
      "ten",
      "eleven",
      "twelve",
      "thirteen",
      "fourteen",
      "fifteen",
      "sixteen",
      "seventeen",
      "eighteen",
      "nineteen",
    ],
    ten = [
      "",
      "",
      "twenty",
      "thirty",
      "forty",
      "fifty",
      "sixty",
      "seventy",
      "eighty",
      "ninety",
    ],
    groups = ["", "thousand", "million", "billion", "trillion"];
  const small = (v: number): string => {
    const a: string[] = [];
    if (v >= 100) {
      a.push(one[Math.floor(v / 100)] + " hundred");
      v %= 100;
    }
    if (v >= 20)
      a.push(ten[Math.floor(v / 10)] + (v % 10 ? "-" + one[v % 10] : ""));
    else if (v) a.push(one[v]);
    return a.join(" ");
  };
  const a: string[] = [];
  for (let i = 0; n; i++, n /= 1000n) {
    const k = Number(n % 1000n);
    if (k) a.unshift(small(k) + (groups[i] ? " " + groups[i] : ""));
  }
  return (negative ? "minus " : "") + a.join(" ");
};
export const logSum = (
  levels: readonly number[],
  weights: readonly number[],
): number => {
  aligned(levels, weights, "windows");
  weights.forEach((v) => nonnegative(v, "weight"));
  const w = positive(sum(weights), "exposure"),
    m = Math.max(...levels);
  return finite(
    m +
      10 *
        Math.log10(
          sum(levels.map((v, i) => weights[i] * 10 ** ((v - m) / 10))) / w,
        ),
  );
};
export const noiseWeight = (f: number, a: boolean): number => {
  positive(f, "frequency");
  const q = f * f,
    r =
      (12194 ** 2 * q * q) /
      ((q + 20.6 ** 2) *
        (q + 12194 ** 2) *
        (a ? Math.sqrt((q + 107.7 ** 2) * (q + 737.9 ** 2)) : 1));
  return 20 * Math.log10(a ? r : r / q) + (a ? 2 : 0.06);
};
export const survival = (
  q: readonly number[],
  start: number,
  end: number,
): number => {
  if (!q.length) simpleError("qx", "Actual mortality table.");
  q.forEach((v) => fraction(v, "qx"));
  bounded(start, "start", 0, q.length);
  bounded(end, "end", start, q.length);
  return Math.exp(sum(q.slice(start, end).map((v) => Math.log1p(-v))));
};
export const lifeTable = (q: readonly number[], radix: number): number[] => {
  positive(radix, "radix");
  if (!q.length) simpleError("qx", "Actual mortality table.");
  q.forEach((v) => fraction(v, "qx"));
  const a = [radix];
  for (const v of q) a.push(a.at(-1)! * (1 - v));
  return a;
};
export const roundRobin = (labels: readonly string[]): string[][][] => {
  if (
    labels.length < 2 ||
    labels.length > 64 ||
    new Set(labels).size !== labels.length ||
    labels.some((v) => !v.trim())
  )
    simpleError("players", "2–64 actualdistinctplayers.");
  const a = [...labels];
  if (a.length % 2) a.push("");
  const rounds: string[][][] = [];
  for (let k = 0; k < a.length - 1; k++) {
    const r: string[][] = [];
    for (let i = 0; i < a.length / 2; i++)
      if (a[i] && a[a.length - 1 - i]) r.push([a[i], a[a.length - 1 - i]]);
    rounds.push(r);
    a.splice(1, 0, a.pop()!);
  }
  return rounds;
};
export const haAngle = (
  latitude: number,
  declination: number,
  altitude: number,
): { hourAngleDegrees: number; condition: string } => {
  if (
    Math.abs(latitude) >= 90 ||
    Math.abs(declination) >= 90 ||
    Math.abs(altitude) > 90
  )
    simpleError("angles", "Nonpolar finite geometric angles.");
  const r = Math.PI / 180,
    x =
      (Math.sin(altitude * r) -
        Math.sin(latitude * r) * Math.sin(declination * r)) /
      (Math.cos(latitude * r) * Math.cos(declination * r));
  if (x > 1)
    return { hourAngleDegrees: 0, condition: "never-reaches-altitude" };
  if (x < -1)
    return { hourAngleDegrees: 180, condition: "always-above-altitude" };
  return { hourAngleDegrees: Math.acos(x) / r, condition: "crossing" };
};

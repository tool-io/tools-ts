import { simpleError } from "../core/simple.js";
import { bounded } from "../game/shared.js";
export * from "../semiconductor/batch36-shared.js";
export const alphabet = (value: string, size = 26): void => {
  if (
    value.length !== size ||
    new Set(value).size !== size ||
    !/^[A-Z0-9]+$(?![\s\S])/.test(value)
  )
    simpleError(
      "alphabet",
      "Explicit distinct uppercase ASCII alphabet of required size.",
    );
};
export const letters = (
  value: string,
  allowed = "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
): string => {
  if (value.length > 4096 || [...value].some((c) => !allowed.includes(c)))
    simpleError(
      "text",
      "At most 4,096 characters from the explicit uppercase ASCII alphabet; no silent normalization.",
    );
  return value;
};
export const mod = (v: number, m = 26): number => ((v % m) + m) % m;
export const digits = (value: string): string => {
  if (!/^[0-9]{1,4096}$(?![\s\S])/.test(value))
    simpleError("digits", "1–4096 ASCII decimal digits required.");
  return value;
};
export const hex = (value: string): number[] => {
  if (!/^(?:[0-9A-Fa-f]{2}){1,4096}$(?![\s\S])/.test(value))
    simpleError("hex", "1–4096 explicit whole hexadecimal bytes required.");
  return value.match(/../g)!.map((v) => parseInt(v, 16));
};
export const bytes = (values: readonly number[]): void => {
  if (!values.length || values.length > 4096)
    simpleError("bytes", "1–4096 actual bytes required.");
  values.forEach((v) => bounded(v, "byte", 0, 255));
};
export const keyOrder = (key: string): number[] => {
  letters(key);
  if (!key.length || key.length > 128)
    simpleError(
      "key",
      "1–128 uppercase key letters required; duplicate keys use stable left-to-right ordering.",
    );
  return [...key]
    .map((v, i) => ({ v, i }))
    .sort((a, b) => a.v.localeCompare(b.v, "en") || a.i - b.i)
    .map((v) => v.i);
};
export const transpose = (
  text: string,
  columns: number,
  order: readonly number[],
  decode: boolean,
): string => {
  letters(text);
  bounded(columns, "columns", 1, 128);
  if (
    order.length !== columns ||
    new Set(order).size !== columns ||
    order.some((v) => v < 0 || v >= columns)
  )
    simpleError("order", "Permutation of all columns required.");
  if (!decode)
    return order
      .map((c) => [...text].filter((_, i) => i % columns === c).join(""))
      .join("");
  const rows = Math.floor(text.length / columns),
    extra = text.length % columns,
    parts = Array<string>(columns);
  let at = 0;
  for (const c of order) {
    const size = rows + (c < extra ? 1 : 0);
    parts[c] = text.slice(at, at + size);
    at += size;
  }
  return Array.from(
    { length: text.length },
    (_, i) => parts[i % columns][Math.floor(i / columns)],
  ).join("");
};
export const hill = (
  text: string,
  m: readonly (readonly number[])[],
  decode: boolean,
): string => {
  letters(text);
  if (text.length % 2 || m.length !== 2 || m.some((r) => r.length !== 2))
    simpleError(
      "Hill",
      "Even-length unpadded text and explicit 2×2 key required.",
    );
  m.flat().forEach((v) => bounded(v, "key", 0, 25));
  const determinant = mod(m[0][0] * m[1][1] - m[0][1] * m[1][0]),
    inverse = Array.from({ length: 26 }, (_, i) => i).find(
      (v) => mod(v * determinant) === 1,
    );
  if (inverse === undefined)
    simpleError("key", "Invertible modulo26 matrix required.");
  const key = decode
    ? [
        [mod(m[1][1] * inverse!), mod(-m[0][1] * inverse!)],
        [mod(-m[1][0] * inverse!), mod(m[0][0] * inverse!)],
      ]
    : m;
  let out = "";
  for (let i = 0; i < text.length; i += 2) {
    const a = text.charCodeAt(i) - 65,
      b = text.charCodeAt(i + 1) - 65;
    out += key
      .map((r) => String.fromCharCode(65 + mod(r[0] * a + r[1] * b)))
      .join("");
  }
  return out;
};
export const fractionate = (
  text: string,
  square: string,
  dimension: number,
  period: number,
  decode: boolean,
): string => {
  const side = dimension === 2 ? 5 : 3;
  alphabet(square, side ** dimension);
  letters(text, square);
  bounded(period, "period", 1, 128);
  let out = "";
  for (let start = 0; start < text.length; start += period) {
    const block = text.slice(start, start + period),
      coords = [...block].map((c) => {
        let i = square.indexOf(c);
        return Array.from(
          { length: dimension },
          (_, j) => Math.floor(i / side ** (dimension - 1 - j)) % side,
        );
      });
    let stream: number[];
    if (decode) stream = coords.flat();
    else
      stream = Array.from({ length: dimension }, (_, j) =>
        coords.map((r) => r[j]),
      ).flat();
    for (let i = 0; i < block.length; i++) {
      const tuple = decode
        ? Array.from(
            { length: dimension },
            (_, j) => stream[j * block.length + i],
          )
        : stream.slice(i * dimension, (i + 1) * dimension);
      out += square[tuple.reduce((v, c) => v * side + c, 0)];
    }
  }
  return out;
};
export const squareCipher = (
  text: string,
  a: string,
  b: string,
  four: boolean,
  decode: boolean,
): string => {
  const base = "ABCDEFGHIKLMNOPQRSTUVWXYZ";
  alphabet(a, 25);
  alphabet(b, 25);
  letters(a, base);
  letters(b, base);
  letters(text, base);
  if (text.length % 2)
    simpleError(
      "text",
      "Even digraph text required; no automatic padding or I/J merging.",
    );
  let out = "";
  for (let i = 0; i < text.length; i += 2) {
    const sourceA = four ? (decode ? a : base) : a,
      sourceB = four ? (decode ? b : base) : b,
      targetA = four ? (decode ? base : a) : a,
      targetB = four ? (decode ? base : b) : b;
    const x = sourceA.indexOf(text[i]),
      y = sourceB.indexOf(text[i + 1]);
    out +=
      targetA[Math.floor(x / 5) * 5 + (y % 5)] +
      targetB[Math.floor(y / 5) * 5 + (x % 5)];
  }
  return out;
};
const tapGroups = ["ABC", "DEF", "GHI", "JKL", "MNO", "PQRS", "TUV", "WXYZ"];
export const encodeTap = (text: string): string => {
  letters(text, "ABCDEFGHIJKLMNOPQRSTUVWXYZ ");
  return [...text]
    .map((c) => {
      if (c === " ") return "0";
      const i = tapGroups.findIndex((g) => g.includes(c));
      return String(i + 2).repeat(tapGroups[i].indexOf(c) + 1);
    })
    .join(" ");
};
export const decodeTap = (text: string): string => {
  if (
    text.length > 16384 ||
    !text.length ||
    text
      .split(" ")
      .some((t) => t !== "0" && !/^([2-9])\1{0,3}$(?![\s\S])/.test(t))
  )
    simpleError(
      "tap",
      "Single-space-separated repeated keypad digit tokens required.",
    );
  return text
    .split(" ")
    .map((t) => {
      if (t === "0") return " ";
      const g = tapGroups[Number(t[0]) - 2],
        c = g[t.length - 1];
      if (!c) simpleError("tap", "Token exceeds actual keypad group.");
      return c;
    })
    .join("");
};
export const entropy = (values: readonly number[]): number => {
  bytes(values);
  const counts = new Map<number, number>();
  for (const v of values) counts.set(v, (counts.get(v) ?? 0) + 1);
  return [...counts.values()].reduce((s, n) => {
    const p = n / values.length;
    return s - p * Math.log2(p);
  }, 0);
};

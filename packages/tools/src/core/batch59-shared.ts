import { simpleError, type SimpleField } from "./simple.js";
export { parseUrl as url } from "./url.js";
import { calculate as normalizeCoefficients } from "../polynomial/coefficient-leading-zero-normalizer/tool.js";
import { calculate as parsePointer } from "../json/pointer-token-list-parser/tool.js";
import { calculateCubicHermite } from "../interpolation/cubic-hermite/tool.js";
import { logLossTool } from "../information/log-loss/tool.js";
export const pointer = (pointer: string): readonly string[] =>
  parsePointer({ pointer }).result.tokens;
export const hermiteBasis = (t: number): number[] =>
  [
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1],
  ].map(
    ([p0, m0, p1, m1]) => calculateCubicHermite({ p0, m0, p1, m1, t }).value,
  );
export const logLoss = (probability: number, outcome: number): number => {
  const r = logLossTool.execute({
    labels: [outcome],
    probabilities: [probability],
  });
  check(r.ok);
  return (r as { ok: true; output: { logLoss: number } }).output.logLoss;
};
export const polynomial = (
  coefficients: readonly number[],
): readonly number[] =>
  normalizeCoefficients({ coefficients }).result
    .coefficients as readonly number[];
export const check = (
  ok: unknown,
  message = "Invalid or unsupported domain input",
  field = "",
): void => {
  if (!ok) simpleError(field, message, "invalid_value");
};
export const int = (x: number, min = 0, max = 1e9): number => {
  check(Number.isSafeInteger(x) && x >= min && x <= max);
  return x;
};
export const positive = (x: number): number => {
  check(Number.isFinite(x) && x > 0);
  return x;
};
export const bounded = (x: number, min: number, max: number): number => {
  check(Number.isFinite(x) && x >= min && x <= max);
  return x;
};
export const mod = (x: number, n: number): number => ((x % n) + n) % n;
export const choice = (x: string, values: readonly string[]): string => {
  check(values.includes(x));
  return x;
};
export const dense = (v: readonly unknown[], limit = 128): void => {
  check(v.length <= limit);
  for (let j = 0; j < v.length; j++) check(Object.hasOwn(v, j));
};
export const validate = (v: unknown, fields: readonly SimpleField[]): void => {
  check(v !== null && typeof v === "object" && !Array.isArray(v));
  const r = v as Record<string, unknown>,
    proto = Object.getPrototypeOf(r);
  check(proto === Object.prototype || proto === null);
  check(Reflect.ownKeys(r).length === fields.length);
  for (const f of fields) {
    const d = Object.getOwnPropertyDescriptor(r, f.id);
    check(
      d && d.enumerable && Object.hasOwn(d, "value"),
      "Own enumerable data fields required",
      f.id,
    );
    const x = d!.value as unknown;
    if (f.kind === "number" || f.kind === "integer") {
      check(
        typeof x === "number" && Number.isFinite(x),
        "Finite number required",
        f.id,
      );
      if (f.kind === "integer") check(Number.isSafeInteger(x));
    } else if (f.kind === "string")
      check(
        typeof x === "string" &&
          x.length <= 16384 &&
          Array.from(x).length <= 8192,
      );
    else if (f.kind === "boolean") check(typeof x === "boolean");
    else {
      check(Array.isArray(x));
      const a = x as unknown[];
      dense(a);
      for (const y of a) {
        if (f.kind === "stringList")
          check(typeof y === "string" && y.length <= 8192);
        else if (f.kind === "matrix") {
          check(Array.isArray(y));
          dense(y as unknown[]);
          check(
            (y as unknown[]).every(
              (t) => typeof t === "number" && Number.isFinite(t),
            ),
          );
        } else check(typeof y === "number" && Number.isFinite(y));
      }
    }
  }
};
export const finish = (
  result: Readonly<Record<string, unknown>>,
): { readonly result: Readonly<Record<string, unknown>> } => {
  let nodes = 0;
  const visit = (v: unknown, depth = 0): void => {
    check(depth <= 16 && ++nodes <= 50000, "Output budget exceeded");
    if (typeof v === "number") check(Number.isFinite(v), "Nonfinite output");
    else if (Array.isArray(v)) {
      dense(v, 16384);
      v.forEach((x) => visit(x, depth + 1));
    } else if (v && typeof v === "object")
      Object.values(v).forEach((x) => visit(x, depth + 1));
    else
      check(
        v === null ||
          typeof v === "boolean" ||
          (typeof v === "string" && v.length <= 16384),
      );
  };
  visit(result);
  check(
    JSON.stringify(result).length <= 1048576,
    "Serialized output budget exceeded",
  );
  return { result };
};
export const json = (s: string): unknown => {
  check(s.length <= 8192);
  let v: unknown;
  try {
    v = JSON.parse(s);
  } catch {
    return simpleError("", "Invalid JSON", "invalid_json");
  }
  let nodes = 0;
  const walk = (x: unknown, d = 0): void => {
    check(++nodes <= 10000 && d <= 12);
    if (Array.isArray(x)) {
      dense(x);
      x.forEach((t) => walk(t, d + 1));
    } else if (x && typeof x === "object")
      Object.values(x).forEach((t) => walk(t, d + 1));
    else if (typeof x === "number") check(Number.isFinite(x));
  };
  walk(v);
  return v;
};
export const rec = (x: unknown): Record<string, unknown> => {
  check(x !== null && typeof x === "object" && !Array.isArray(x));
  return x as Record<string, unknown>;
};
export const array = (x: unknown): unknown[] => {
  check(Array.isArray(x));
  dense(x as unknown[]);
  return x as unknown[];
};
export const number = (x: unknown): number => {
  check(typeof x === "number" && Number.isFinite(x));
  return x as number;
};
export const string = (x: unknown): string => {
  check(typeof x === "string" && (x as string).length <= 8192);
  return x as string;
};
export const big = (s: string): bigint => {
  check(/^[+-]?\d{1,128}(?![\s\S])/.test(s));
  return BigInt(s);
};
export const word = (s: string, width: number): bigint => {
  int(width, 1, 128);
  const x = big(s);
  check(x >= 0n && x < 2n ** BigInt(width));
  return x;
};
export const factorial = (n: number): bigint => {
  int(n, 0, 128);
  let x = 1n;
  for (let j = 2; j <= n; j++) x *= BigInt(j);
  return x;
};
export const radians = (x: number): number => (x * Math.PI) / 180;
export const degrees = (x: number): number => (x * 180) / Math.PI;
export const sigmoid = (x: number): number =>
  x >= 0 ? 1 / (1 + Math.exp(-x)) : Math.exp(x) / (1 + Math.exp(x));
export const scalar = (n: number): number => {
  int(n, 0, 0x10ffff);
  check(n < 0xd800 || n > 0xdfff);
  return n;
};
export const utf8 = (n: number): number[] => {
  scalar(n);
  if (n < 128) return [n];
  if (n < 2048) return [192 + Math.floor(n / 64), 128 + (n % 64)];
  if (n < 65536)
    return [
      224 + Math.floor(n / 4096),
      128 + (Math.floor(n / 64) % 64),
      128 + (n % 64),
    ];
  return [
    240 + Math.floor(n / 262144),
    128 + (Math.floor(n / 4096) % 64),
    128 + (Math.floor(n / 64) % 64),
    128 + (n % 64),
  ];
};
export const civil = (s: string): Date => {
  const m = /^(\d{4})-(\d{2})-(\d{2})(?![\s\S])/.exec(s);
  check(m);
  const y = Number(m![1]),
    month = Number(m![2]),
    d = Number(m![3]);
  int(y, 1, 9999);
  int(month, 1, 12);
  int(d, 1, 31);
  const date = new Date(0);
  date.setUTCFullYear(y, month - 1, d);
  date.setUTCHours(0, 0, 0, 0);
  check(
    date.getUTCFullYear() === y &&
      date.getUTCMonth() === month - 1 &&
      date.getUTCDate() === d,
  );
  return date;
};
export const addDays = (s: string, n: number): string => {
  int(n, -100000, 100000);
  const d = civil(s);
  d.setUTCDate(d.getUTCDate() + n);
  check(d.getUTCFullYear() >= 1 && d.getUTCFullYear() <= 9999);
  return d.toISOString().slice(0, 10);
};
export const hex = (n: number, width = 2): string =>
  n.toString(16).toUpperCase().padStart(width, "0");
export const equal = (a: unknown, b: unknown): boolean =>
  JSON.stringify(a) === JSON.stringify(b);

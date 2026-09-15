import { simpleError, type SimpleField } from "../core/simple.js";
import ipv4ToIntegerTool from "../network/ipv4-to-integer/tool.js";
import { parseIpv6, formatIpv6Full } from "../network/ipv6-expand/tool.js";
export const check = (
  ok: unknown,
  message = "Invalid domain evidence",
): void => {
  if (!ok) simpleError("", message);
};
export const int = (x: number, min = 0, max = 1e9): number => {
  check(Number.isSafeInteger(x) && x >= min && x <= max);
  return x;
};
export const positive = (x: number): number => {
  check(Number.isFinite(x) && x > 0);
  return x;
};
export const mod = (a: number, b: number): number => ((a % b) + b) % b;
export const dense = (a: readonly unknown[]): void => {
  check(a.length <= 128);
  for (let j = 0; j < a.length; j++) check(Object.hasOwn(a, j));
};
export const validate = (i: unknown, fields: readonly SimpleField[]): void => {
  check(i !== null && typeof i === "object" && !Array.isArray(i));
  const r = i as Record<string, unknown>;
  check(Object.keys(r).length === fields.length);
  for (const f of fields) {
    check(Object.hasOwn(r, f.id));
    const v = r[f.id];
    if (f.kind === "number" || f.kind === "integer") {
      check(typeof v === "number" && Number.isFinite(v));
      if (f.kind === "integer") check(Number.isSafeInteger(v));
    } else if (f.kind === "string")
      check(typeof v === "string" && v.length <= 8192);
    else if (f.kind === "boolean") check(typeof v === "boolean");
    else {
      check(Array.isArray(v));
      const a = v as unknown[];
      dense(a);
      for (const x of a) {
        if (f.kind === "stringList")
          check(typeof x === "string" && x.length <= 8192);
        else if (f.kind === "matrix") {
          check(Array.isArray(x));
          dense(x as unknown[]);
          check(
            (x as unknown[]).every(
              (t) => typeof t === "number" && Number.isFinite(t),
            ),
          );
        } else check(typeof x === "number" && Number.isFinite(x));
      }
    }
  }
};
export const finish = (
  result: Readonly<Record<string, unknown>>,
): { readonly result: Readonly<Record<string, unknown>> } => {
  let nodes = 0;
  const visit = (v: unknown, depth = 0): void => {
    check(depth < 20 && ++nodes <= 50000, "Output evidence budget exceeded");
    if (typeof v === "number")
      check(
        Number.isFinite(v) && Math.abs(v) <= Number.MAX_SAFE_INTEGER,
        "Nonfinite or unsafe output",
      );
    else if (Array.isArray(v)) v.forEach((x) => visit(x, depth + 1));
    else if (v && typeof v === "object")
      Object.values(v).forEach((x) => visit(x, depth + 1));
    else
      check(
        v === null ||
          typeof v === "boolean" ||
          (typeof v === "string" && v.length <= 8192),
        "Non-JSON output",
      );
  };
  visit(result);
  return { result };
};
export const json = (s: string): unknown => {
  try {
    const value: unknown = JSON.parse(s);
    let nodes = 0;
    const visit = (v: unknown, depth = 0): void => {
      check(++nodes <= 10000 && depth <= 16, "JSON evidence budget exceeded");
      if (typeof v === "number")
        check(Number.isFinite(v), "Nonfinite JSON evidence");
      else if (Array.isArray(v)) v.forEach((x) => visit(x, depth + 1));
      else if (v && typeof v === "object")
        Object.values(v).forEach((x) => visit(x, depth + 1));
    };
    visit(value);
    return value;
  } catch {
    simpleError("", "Invalid JSON");
  }
};
export const arr = (s: string): unknown[] => {
  const v = json(s);
  check(Array.isArray(v));
  dense(v as unknown[]);
  return v as unknown[];
};
export const rec = (v: unknown): Record<string, unknown> => {
  check(v !== null && typeof v === "object" && !Array.isArray(v));
  return v as Record<string, unknown>;
};
export const records = (s: string): Record<string, unknown>[] =>
  arr(s).map(rec);
export const str = (v: unknown): string => {
  check(typeof v === "string" && (v as string).length <= 8192);
  return v as string;
};
export const num = (v: unknown): number => {
  check(typeof v === "number" && Number.isFinite(v));
  return v as number;
};
export const unique = <T>(a: readonly T[]): T[] => [...new Set(a)];
export const groups = <T>(
  a: readonly T[],
  key: (x: T) => string,
): { key: string; indexes: number[] }[] => {
  const m = new Map<string, number[]>();
  a.forEach((x, j) => {
    const k = key(x);
    m.set(k, [...(m.get(k) ?? []), j]);
  });
  return [...m].map(([key, indexes]) => ({ key, indexes }));
};
export const duplicates = <T>(
  a: readonly T[],
  key: (x: T) => string,
): { key: string; indexes: number[] }[] =>
  groups(a, key).filter((r) => r.indexes.length > 1);
export const permutation = (a: readonly number[]): void => {
  dense(a);
  a.forEach((x) => int(x, 0, a.length - 1));
  check(new Set(a).size === a.length);
};
export const bytes = (a: readonly number[]): void => {
  dense(a);
  a.forEach((x) => int(x, 0, 255));
};
export const bits = (s: string): void =>
  check(/^[01]*(?![\s\S])/.test(s) && s.length <= 128);
export const bigint = (s: string): bigint => {
  check(/^[+-]?\d{1,256}(?![\s\S])/.test(s));
  return BigInt(s);
};
export const abs = (x: bigint): bigint => (x < 0n ? -x : x);
export const gcd = (a: bigint, b: bigint): bigint => {
  a = abs(a);
  b = abs(b);
  while (b) {
    [a, b] = [b, a % b];
  }
  return a;
};
export const floor = (n: bigint, d: bigint): bigint => {
  check(d > 0n);
  return n / d - (n < 0n && n % d !== 0n ? 1n : 0n);
};
export const fraction = (
  n: bigint,
  d: bigint,
): { numerator: string; denominator: string } => {
  check(d !== 0n);
  if (d < 0n) {
    n = -n;
    d = -d;
  }
  const g = gcd(n, d);
  return { numerator: String(n / g), denominator: String(d / g) };
};
export const decimal = (
  s: string,
): { n: bigint; scale: number; negativeZero: boolean } => {
  const m = /^([+-]?)(\d+)(?:\.(\d*))?(?:[eE]([+-]?\d+))?(?![\s\S])/.exec(s);
  check(m && s.length <= 256);
  const v = m!;
  const scale = (v[3] ?? "").length - Number(v[4] ?? 0);
  int(scale, -256, 256);
  return {
    n: BigInt(v[1] + v[2] + (v[3] ?? "")),
    scale,
    negativeZero: v[1] === "-" && BigInt(v[2] + (v[3] ?? "")) === 0n,
  };
};
export const pow10 = (n: number): bigint => 10n ** BigInt(int(n, 0, 512));
export const decimalText = (n: bigint, scale: number): string => {
  if (scale < 0) return String(n * pow10(-scale));
  const sign = n < 0n ? "-" : "";
  const t = String(abs(n)).padStart(scale + 1, "0");
  return sign + (scale ? t.slice(0, -scale) + "." + t.slice(-scale) : t);
};
export const decimalFraction = (s: string): [bigint, bigint] => {
  const d = decimal(s);
  return d.scale < 0 ? [d.n * pow10(-d.scale), 1n] : [d.n, pow10(d.scale)];
};
export const spans = (s: string): [number, number][] =>
  arr(s).map((v) => {
    check(Array.isArray(v) && v.length === 2);
    const a = v as unknown[];
    const x = num(a[0]),
      y = num(a[1]);
    check(y >= x);
    return [x, y];
  });
export const overlaps = (
  a: readonly (readonly [number, number])[],
): number[][] => {
  const o: number[][] = [];
  for (let j = 0; j < a.length; j++)
    for (let k = j + 1; k < a.length; k++)
      if (Math.max(a[j][0], a[k][0]) < Math.min(a[j][1], a[k][1]))
        o.push([j, k]);
  return o;
};
export const merge = (
  a: readonly (readonly [number, number])[],
): [number, number][] => {
  const out: [number, number][] = [];
  for (const r of [...a].sort((x, y) => x[0] - y[0] || x[1] - y[1])) {
    if (r[0] === r[1]) continue;
    const p = out.at(-1);
    if (p && r[0] <= p[1]) p[1] = Math.max(p[1], r[1]);
    else out.push([r[0], r[1]]);
  }
  return out;
};
export const choose = (n: number, k: number): bigint => {
  int(n, 0, 128);
  int(k, 0, 128);
  if (k > n) return 0n;
  let c = 1n;
  for (let j = 1; j <= k; j++) c = (c * BigInt(n - j + 1)) / BigInt(j);
  return c;
};
export const factorial = (n: number): bigint => {
  int(n, 0, 128);
  let x = 1n;
  for (let j = 2; j <= n; j++) x *= BigInt(j);
  return x;
};
export const cycles = (p: readonly number[]): number[][] => {
  permutation(p);
  const seen = new Set<number>(),
    out: number[][] = [];
  for (let j = 0; j < p.length; j++)
    if (!seen.has(j)) {
      const c: number[] = [];
      let k = j;
      while (!seen.has(k)) {
        seen.add(k);
        c.push(k);
        k = p[k];
      }
      out.push(c);
    }
  return out;
};
export const rotations = (s: string): string[] => {
  check(s.length <= 128);
  return s.length
    ? Array.from({ length: s.length }, (_, j) => s.slice(j) + s.slice(0, j))
    : [""];
};
export const palindrome = (s: string): boolean =>
  s === s.split("").reverse().join("");
export const escapeCell = (s: string, delimiter: string): string => {
  check(
    delimiter.length === 1 && !["\\", "n", "r", "t"].includes(delimiter),
    "Delimiter conflicts with a reserved backslash escape",
  );
  return s
    .split("")
    .map((c) =>
      c === "\\"
        ? "\\\\"
        : c === "\n"
          ? "\\n"
          : c === "\r"
            ? "\\r"
            : c === "\t"
              ? "\\t"
              : c === delimiter
                ? "\\" + c
                : c,
    )
    .join("");
};
export const splitEscaped = (s: string, delimiter: string): string[] => {
  check(
    delimiter.length === 1 && !["\\", "n", "r", "t"].includes(delimiter),
    "Delimiter conflicts with a reserved backslash escape",
  );
  const out = [""];
  for (let j = 0; j < s.length; j++) {
    let c = s[j];
    if (c === "\\") {
      check(++j < s.length);
      c = s[j];
      check(["\\", "n", "r", "t", delimiter].includes(c));
      out[out.length - 1] +=
        c === "n" ? "\n" : c === "r" ? "\r" : c === "t" ? "\t" : c;
    } else if (c === delimiter) out.push("");
    else out[out.length - 1] += c;
  }
  check(out.length <= 128);
  return out;
};
export const clock = (n: number): number => int(n, 0, 86399);
export const clockSpans = (s: string): [number, number][] =>
  arr(s).flatMap((v) => {
    check(Array.isArray(v) && v.length === 2);
    const r = v as number[];
    clock(r[0]);
    clock(r[1]);
    return r[0] <= r[1]
      ? [[r[0], r[1]]]
      : [
          [r[0], 86400],
          [0, r[1]],
        ];
  });
export const cueRecords = (
  s: string,
): { id: string; start: number; end: number; text: string }[] =>
  records(s).map((r) => {
    const id = str(r.id),
      start = int(num(r.start), 0, 1e12),
      end = int(num(r.end), start, 1e12),
      text = str(r.text);
    return { id, start, end, text };
  });
export const edges = (
  s: string,
): { id: string; source: string; target: string; weight: number }[] => {
  const r = records(s).map((v) => ({
    id: str(v.id),
    source: str(v.source),
    target: str(v.target),
    weight: num(v.weight),
  }));
  check(new Set(r.map((v) => v.id)).size === r.length);
  return r;
};
export const sortedIndexes = (v: readonly number[]): number[] =>
  v.map((_, j) => j).sort((a, b) => v[a] - v[b] || a - b);
export const multiset = (
  s: string,
): Map<string, { value: string | number | boolean | null; count: number }> => {
  const m = new Map<
    string,
    { value: string | number | boolean | null; count: number }
  >();
  for (const r of records(s)) {
    const v = r.value;
    check(v === null || ["string", "number", "boolean"].includes(typeof v));
    if (typeof v === "number") num(v);
    const c = int(num(r.count), 0, 1e6),
      k = JSON.stringify(v);
    const count = (m.get(k)?.count ?? 0) + c;
    int(count, 0, 1e6);
    if (count)
      m.set(k, { value: v as string | number | boolean | null, count });
  }
  return m;
};
export const msRows = (
  m: Map<string, { value: string | number | boolean | null; count: number }>,
): { value: string | number | boolean | null; count: number }[] => [
  ...m.values(),
];
export const relation = (
  s: string,
  u: readonly string[],
  v: readonly string[] = u,
): [string, string][] => {
  check(unique(u).length === u.length && unique(v).length === v.length);
  const p = arr(s).map((x) => {
    check(Array.isArray(x) && x.length === 2);
    const r = x as unknown[];
    const a = str(r[0]),
      b = str(r[1]);
    check(u.includes(a) && v.includes(b));
    return [a, b] as [string, string];
  });
  return [...new Map(p.map((r) => [JSON.stringify(r), r])).values()];
};
export const hasPair = (
  p: readonly (readonly string[])[],
  a: string,
  b: string,
): boolean => p.some((r) => r[0] === a && r[1] === b);
export const relationProperties = (
  p: readonly (readonly string[])[],
  u: readonly string[],
): {
  reflexive: boolean;
  symmetric: boolean;
  antisymmetric: boolean;
  transitive: boolean;
} => ({
  reflexive: u.every((x) => hasPair(p, x, x)),
  symmetric: p.every(([a, b]) => hasPair(p, b, a)),
  antisymmetric: p.every(([a, b]) => a === b || !hasPair(p, b, a)),
  transitive: p.every(([a, b]) =>
    p.every(([c, d]) => b !== c || hasPair(p, a, d)),
  ),
});
export const packEscaped = (
  data: readonly number[],
  escape: number,
  sentinel: number,
): number[] => {
  bytes(data);
  int(escape, 0, 255);
  int(sentinel, 0, 255);
  check(escape !== sentinel);
  const output = data.flatMap((x) =>
    x === escape || x === sentinel ? [escape, x ^ 32] : [x],
  );
  check(output.length <= 128, "Escaped output budget is 128 bytes");
  return output;
};
export const unpackEscaped = (
  data: readonly number[],
  escape: number,
  sentinel: number,
): number[] => {
  bytes(data);
  int(escape, 0, 255);
  int(sentinel, 0, 255);
  check(escape !== sentinel);
  const out: number[] = [];
  for (let j = 0; j < data.length; j++) {
    const x = data[j];
    if (x === escape) {
      check(++j < data.length);
      const t = data[j] ^ 32;
      check(t === escape || t === sentinel);
      out.push(t);
    } else {
      check(x !== sentinel);
      out.push(x);
    }
  }
  return out;
};
export const square = (s: string): [number, number] => {
  check(/^[a-h][1-8](?![\s\S])/.test(s));
  return [s.charCodeAt(0) - 97, Number(s[1]) - 1];
};
export const knight = (x: number, y: number): number[][] => {
  int(x, 0, 7);
  int(y, 0, 7);
  return [
    [1, 2],
    [2, 1],
    [2, -1],
    [1, -2],
    [-1, -2],
    [-2, -1],
    [-2, 1],
    [-1, 2],
  ]
    .map(([a, b]) => [x + a, y + b])
    .filter(([a, b]) => a >= 0 && a < 8 && b >= 0 && b < 8);
};
export const colors = (
  s: string,
): { id: string; name: string; rgba: number[] }[] =>
  records(s).map((v) => {
    check(Array.isArray(v.rgba) && v.rgba.length === 4);
    bytes(v.rgba as number[]);
    return {
      id: str(v.id),
      name: str(v.name),
      rgba: [...(v.rgba as number[])],
    };
  });
export const aliases = (s: string): Map<string, string> => {
  const r = records(s).map((v) => [str(v.name), str(v.target)] as const);
  check(unique(r.map((v) => v[0])).length === r.length);
  return new Map(r);
};
export const resolveAlias = (
  m: Map<string, string>,
  name: string,
): { path: string[]; terminal: string | null; cycle: boolean } => {
  const path: string[] = [];
  let p = name;
  while (m.has(p)) {
    if (path.includes(p)) {
      path.push(p);
      return { path, terminal: null, cycle: true };
    }
    path.push(p);
    p = m.get(p)!;
  }
  path.push(p);
  return { path, terminal: p, cycle: false };
};
export const numericToken = (s: string): number => {
  check(/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?(?![\s\S])/.test(s));
  return num(Number(s));
};
export const quotedTokens = (s: string): string[] => {
  const out: string[] = [];
  let j = 0;
  while (j < s.length) {
    while (/\s/.test(s[j] ?? "") && j < s.length) j++;
    if (j === s.length) break;
    check(s[j] === '"');
    const start = j++;
    let escaped = false;
    while (j < s.length) {
      const c = s[j++];
      if (escaped) {
        escaped = false;
        continue;
      }
      if (c === "\\") {
        escaped = true;
        continue;
      }
      if (c === '"') break;
    }
    const token = s.slice(start, j);
    check(token.endsWith('"'));
    const v = json(token);
    out.push(str(v));
    check(j === s.length || /\s/.test(s[j]));
    check(out.length <= 128);
  }
  return out;
};
export const regexLiteral = (s: string): string =>
  s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
export const classEscape = (n: number): string =>
  "\\x" + n.toString(16).padStart(2, "0");
export const asciiClass = (s: string): number[] => {
  check(s.startsWith("[") && s.endsWith("]"));
  let j = 1;
  const neg = s[j] === "^";
  if (neg) j++;
  const end = s.length - 1,
    out: number[] = [];
  const read = (): number => {
    check(j < end);
    let n = s.charCodeAt(j++);
    if (n === 92) {
      check(s[j] === "x" && /^[0-9a-fA-F]{2}$/.test(s.slice(j + 1, j + 3)));
      n = parseInt(s.slice(j + 1, j + 3), 16);
      j += 3;
    } else check(![93, 45, 94, 91].includes(n));
    int(n, 0, 127);
    return n;
  };
  while (j < end) {
    const a = read();
    if (s[j] === "-" && j + 1 < end) {
      j++;
      const b = read();
      check(b >= a);
      for (let n = a; n <= b; n++) out.push(n);
    } else out.push(a);
  }
  const v = unique(out).sort((a, b) => a - b);
  return neg
    ? Array.from({ length: 128 }, (_, n) => n).filter((n) => !v.includes(n))
    : v;
};
export const captures = (
  s: string,
): { index: number; name: string | null; position: number }[] => {
  try {
    new RegExp(s);
  } catch {
    simpleError("", "Invalid ECMAScript regular expression");
  }
  const out: { index: number; name: string | null; position: number }[] = [];
  let cls = false;
  for (let j = 0; j < s.length; j++) {
    if (s[j] === "\\") {
      j++;
      continue;
    }
    if (s[j] === "[") {
      cls = true;
      continue;
    }
    if (s[j] === "]" && cls) {
      cls = false;
      continue;
    }
    if (!cls && s[j] === "(") {
      if (s[j + 1] !== "?")
        out.push({ index: out.length + 1, name: null, position: j });
      else if (s[j + 2] === "<" && s[j + 3] !== "=" && s[j + 3] !== "!") {
        const end = s.indexOf(">", j + 3);
        check(end >= 0);
        out.push({
          index: out.length + 1,
          name: s.slice(j + 3, end),
          position: j,
        });
      }
    }
  }
  return out;
};
export const replacementTokens = (
  s: string,
): { type: string; text: string; position: number }[] => {
  const out: { type: string; text: string; position: number }[] = [];
  let j = 0;
  while (j < s.length) {
    const m = /^\$(\$|&|`|'|\d{1,2}|<[^>]*>)/.exec(s.slice(j));
    if (m) {
      out.push({
        type:
          m[1] === "$"
            ? "dollar"
            : m[1] === "&"
              ? "match"
              : m[1] === "`"
                ? "prefix"
                : m[1] === "'"
                  ? "suffix"
                  : m[1].startsWith("<")
                    ? "named"
                    : "numbered",
        text: m[0],
        position: j,
      });
      j += m[0].length;
    } else {
      const start = j++;
      while (j < s.length && !/^\$(\$|&|`|'|\d{1,2}|<[^>]*>)/.test(s.slice(j)))
        j++;
      out.push({ type: "literal", text: s.slice(start, j), position: start });
    }
  }
  return out;
};
export const borders = (s: string): number[] => {
  check(s.length <= 128);
  return Array.from(
    { length: Math.max(0, s.length - 1) },
    (_, j) => j + 1,
  ).filter((n) => s.slice(0, n) === s.slice(-n));
};
export const period = (s: string): number => {
  check(s.length <= 128);
  if (!s.length) return 0;
  for (let n = 1; n <= s.length; n++)
    if (s.length % n === 0 && s === s.slice(0, n).repeat(s.length / n))
      return n;
  return s.length;
};
export const rankBlocks = (
  v: readonly number[],
): { value: number; indexes: number[]; start: number; end: number }[] => {
  const p = sortedIndexes(v),
    out: { value: number; indexes: number[]; start: number; end: number }[] =
      [];
  p.forEach((j, k) => {
    const b = out.at(-1);
    if (b && b.value === v[j]) {
      b.indexes.push(j);
      b.end = k + 1;
    } else out.push({ value: v[j], indexes: [j], start: k, end: k + 1 });
  });
  return out;
};
export const tupleCompare = (
  a: readonly number[],
  b: readonly number[],
): number => {
  for (let j = 0; j < Math.min(a.length, b.length); j++)
    if (a[j] !== b[j]) return a[j] < b[j] ? -1 : 1;
  return Math.sign(a.length - b.length);
};
export const lehmer = (p: readonly number[]): number[] => {
  permutation(p);
  return p.map((v, j) => p.slice(j + 1).filter((x) => x < v).length);
};
export const unLehmer = (digits: readonly number[]): number[] => {
  const left = digits.map((_, j) => j);
  return digits.map((x) => {
    int(x, 0, left.length - 1);
    return left.splice(x, 1)[0];
  });
};
export const permRank = (p: readonly number[]): bigint =>
  lehmer(p).reduce(
    (s, x, j) => s + BigInt(x) * factorial(p.length - j - 1),
    0n,
  );
export const permUnrank = (n: number, rank: bigint): number[] => {
  int(n, 0, 128);
  check(rank >= 0n && rank < factorial(n));
  const digits: number[] = [];
  for (let j = n - 1; j >= 0; j--) {
    const f = factorial(j);
    digits.push(Number(rank / f));
    rank %= f;
  }
  return unLehmer(digits);
};
export const combo = (v: readonly number[], n: number): void => {
  int(n, 0, 128);
  v.forEach((x, j) => {
    int(x, 0, n - 1);
    check(j === 0 || x > v[j - 1]);
  });
};
export const comboRank = (v: readonly number[], n: number): bigint => {
  combo(v, n);
  let rank = 0n,
    start = 0;
  v.forEach((x, j) => {
    for (let k = start; k < x; k++) rank += choose(n - k - 1, v.length - j - 1);
    start = x + 1;
  });
  return rank;
};
export const comboUnrank = (n: number, k: number, rank: bigint): number[] => {
  int(n, 0, 128);
  int(k, 0, n);
  check(rank >= 0n && rank < choose(n, k));
  const out: number[] = [];
  let start = 0;
  for (let j = 0; j < k; j++)
    for (let x = start; x < n; x++) {
      const c = choose(n - x - 1, k - j - 1);
      if (rank < c) {
        out.push(x);
        start = x + 1;
        break;
      }
      rank -= c;
    }
  return out;
};
export const radix = (r: readonly number[]): bigint => {
  r.forEach((x) => int(x, 1, 1e6));
  return r.reduce((s, x) => s * BigInt(x), 1n);
};
export const radixEncode = (
  digits: readonly number[],
  r: readonly number[],
): bigint => {
  check(digits.length === r.length);
  radix(r);
  return digits.reduce(
    (s, x, j) => s * BigInt(r[j]) + BigInt(int(x, 0, r[j] - 1)),
    0n,
  );
};
export const radixDecode = (index: bigint, r: readonly number[]): number[] => {
  check(index >= 0n && index < radix(r));
  const out = Array(r.length).fill(0) as number[];
  for (let j = r.length - 1; j >= 0; j--) {
    out[j] = Number(index % BigInt(r[j]));
    index /= BigInt(r[j]);
  }
  return out;
};
export const fracInput = (n: string, d: string): [bigint, bigint] => {
  let a = bigint(n),
    b = bigint(d);
  check(b !== 0n);
  if (b < 0n) {
    a = -a;
    b = -b;
  }
  const g = gcd(a, b);
  return [a / g, b / g];
};
export const bitRuns = (
  s: string,
  bit: string,
): { start: number; end: number }[] => {
  bits(s);
  const runs: { start: number; end: number }[] = [];
  for (let j = 0; j < s.length;) {
    if (s[j] !== bit) {
      j++;
      continue;
    }
    const start = j;
    while (j < s.length && s[j] === bit) j++;
    runs.push({ start, end: j });
  }
  return runs;
};
export const cobsEncode = (p: readonly number[]): number[] => {
  bytes(p);
  check(p.length <= 126);
  const out = [0];
  let codeAt = 0,
    code = 1;
  for (const x of p) {
    if (x === 0) {
      out[codeAt] = code;
      codeAt = out.length;
      out.push(0);
      code = 1;
    } else {
      out.push(x);
      code++;
    }
  }
  out[codeAt] = code;
  return out;
};
export const cobsDecode = (p: readonly number[]): number[] => {
  bytes(p);
  check(p.length > 0 && p.every((x) => x !== 0));
  const out: number[] = [];
  let j = 0;
  while (j < p.length) {
    const code = p[j++];
    check(j + code - 1 <= p.length);
    out.push(...p.slice(j, j + code - 1));
    j += code - 1;
    if (code < 255 && j < p.length) out.push(0);
  }
  return out;
};
export const slip = (p: readonly number[], inverse: boolean): number[] => {
  bytes(p);
  if (!inverse) {
    check(p.length <= 64);
    return p.flatMap((x) =>
      x === 192 ? [219, 220] : x === 219 ? [219, 221] : [x],
    );
  }
  const out: number[] = [];
  for (let j = 0; j < p.length; j++) {
    if (p[j] === 219) {
      check(++j < p.length && [220, 221].includes(p[j]));
      out.push(p[j] === 220 ? 192 : 219);
    } else {
      check(p[j] !== 192);
      out.push(p[j]);
    }
  }
  return out;
};
export const wordValue = (
  p: readonly number[],
  start: number,
  width: number,
  little: boolean,
): bigint => {
  bytes(p);
  int(width, 1, 16);
  int(start, 0, p.length - width);
  let v = 0n;
  for (let j = 0; j < width; j++)
    v = v * 256n + BigInt(p[start + (little ? width - 1 - j : j)]);
  return v;
};
export const wordBytes = (
  value: bigint,
  width: number,
  little: boolean,
): number[] => {
  int(width, 1, 16);
  check(value >= 0n && value < 1n << BigInt(8 * width));
  const out = Array.from({ length: width }, (_, j) =>
    Number((value >> BigInt(8 * (width - 1 - j))) & 255n),
  );
  return little ? out.reverse() : out;
};
export const ip = (s: string, width: number): bigint => {
  if (width === 128) {
    const text = s.trim();
    if (text.includes(".")) {
      const tail = text.slice(text.lastIndexOf(":") + 1);
      check(tail.includes("."), "Embedded IPv4 must be the final IPv6 segment");
      ip(tail, 32);
    }
    return parseIpv6(s).reduce((v, x) => (v << 16n) | BigInt(x), 0n);
  }
  check(
    s.length > 0 && s.split("").every((c) => "0123456789.".includes(c)),
    "Invalid IPv4 characters",
  );
  const r = ipv4ToIntegerTool.execute({ address: s });
  check(r.ok, "Invalid IPv4");
  if (!r.ok) return 0n;
  return BigInt(r.output.integer);
};
export const ipText = (v: bigint, width: number): string => {
  check(v >= 0n && v < 1n << BigInt(width));
  return width === 32
    ? [24, 16, 8, 0].map((n) => Number((v >> BigInt(n)) & 255n)).join(".")
    : formatIpv6Full(
        Array.from({ length: 8 }, (_, j) =>
          Number((v >> BigInt(16 * (7 - j))) & 65535n),
        ),
      );
};
export const prefix = (
  s: string,
  p: number,
  width: number,
): { start: bigint; end: bigint; size: bigint } => {
  int(p, 0, width);
  const v = ip(s, width),
    size = 1n << BigInt(width - p),
    start = (v / size) * size;
  return { start, end: start + size - 1n, size };
};
export const sharedBits = (a: bigint, b: bigint, width: number): number => {
  const x = a ^ b;
  return x === 0n ? width : width - x.toString(2).length;
};
export const ipRange = (
  a: string,
  b: string,
  width: number,
): [bigint, bigint] => {
  const x = ip(a, width),
    y = ip(b, width);
  check(y >= x);
  return [x, y];
};
export const cidrCover = (
  start: bigint,
  end: bigint,
  width: number,
): { address: string; prefix: number }[] => {
  check(start >= 0n && end >= start && end < 1n << BigInt(width));
  const out: { address: string; prefix: number }[] = [];
  while (start <= end) {
    let p = width;
    while (p > 0) {
      const next = 1n << BigInt(width - p + 1);
      if (start % next !== 0n || start + next - 1n > end) break;
      p--;
    }
    out.push({ address: ipText(start, width), prefix: p });
    start += 1n << BigInt(width - p);
  }
  return out;
};
export const ipRelation = (
  a: { start: bigint; end: bigint },
  b: { start: bigint; end: bigint },
): string =>
  a.start === b.start && a.end === b.end
    ? "equal"
    : a.start <= b.start && a.end >= b.end
      ? "contains"
      : b.start <= a.start && b.end >= a.end
        ? "contained-by"
        : a.end < b.start || b.end < a.start
          ? "disjoint"
          : "overlap";
export const dnsLabels = (s: string, strict = true): number[][] => {
  const r = arr(s).map((v) => {
    check(Array.isArray(v));
    bytes(v as number[]);
    check((v as number[]).length > 0);
    return [...(v as number[])];
  });
  if (strict)
    check(
      r.every((v) => v.length <= 63) &&
        r.reduce((n, v) => n + v.length + 1, 1) <= 255,
    );
  return r;
};
export const asciiLower = (s: string): string =>
  s.replace(/[A-Z]/g, (c) => c.toLowerCase());
export const lowerBytes = (p: readonly number[]): number[] =>
  p.map((x) => (x >= 65 && x <= 90 ? x + 32 : x));
export const labelEquals = (
  a: readonly number[],
  b: readonly number[],
): boolean =>
  a.length === b.length &&
  lowerBytes(a).every((x, j) => x === lowerBytes(b)[j]);
export const suffixLabels = (
  a: readonly (readonly number[])[],
  b: readonly (readonly number[])[],
): boolean =>
  a.length >= b.length &&
  b.every((r, j) => labelEquals(r, a[a.length - b.length + j]));
export const dnsTextParse = (
  s: string,
): { labels: number[][]; absolute: boolean } => {
  check(s.length > 0);
  if (s === ".") return { labels: [], absolute: true };
  const labels: number[][] = [[]];
  let absolute = false;
  for (let j = 0; j < s.length; j++) {
    let n = s.charCodeAt(j);
    if (n === 92) {
      check(++j < s.length);
      if (/^\d{3}/.test(s.slice(j, j + 3))) {
        n = Number(s.slice(j, j + 3));
        int(n, 0, 255);
        j += 2;
      } else n = s.charCodeAt(j);
      labels.at(-1)!.push(int(n, 0, 255));
    } else if (n === 46) {
      if (j === s.length - 1) {
        absolute = true;
        break;
      }
      check(labels.at(-1)!.length > 0);
      labels.push([]);
    } else labels.at(-1)!.push(int(n, 33, 126));
  }
  check(
    labels.every((r) => r.length > 0 && r.length <= 63) &&
      labels.reduce((n, r) => n + r.length + 1, 1) <= 255,
  );
  return { labels, absolute };
};
export const dnsTextJoin = (
  labels: readonly (readonly number[])[],
  absolute: boolean,
): string => {
  const parts = labels.map((r) =>
    r
      .map((x) =>
        x >= 33 && x <= 126 && x !== 46 && x !== 92
          ? String.fromCharCode(x)
          : "\\" + String(x).padStart(3, "0"),
      )
      .join(""),
  );
  return parts.join(".") + (absolute ? "." : "");
};
export const attributes = (s: string): { name: string; value: string }[] =>
  records(s).map((r) => {
    const name = str(r.name),
      value = str(r.value);
    check(name.length > 0 && !/[\t\n\f\r /=>"'<>`\u0000]/.test(name));
    return { name: asciiLower(name), value };
  });
export const classTokens = (s: string): string[] =>
  s.split(/[\t\n\f\r ]+/).filter(Boolean);
export const attributeEscape = (s: string, quote: string): string => {
  check(quote === '"' || quote === "'");
  check(!s.includes("\u0000"));
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(quote === '"' ? /"/g : /'/g, quote === '"' ? "&quot;" : "&#39;");
};

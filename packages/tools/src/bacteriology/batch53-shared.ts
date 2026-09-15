export * from "../viticulture/batch52-shared.js";
import {
  simpleError,
  bounded,
  positive,
  nonnegative,
  unique,
  ownReference,
  finite,
} from "../viticulture/batch52-shared.js";
import { validateInput as baseValidate } from "../viticulture/batch52-shared.js";
import type { SimpleField } from "../core/simple.js";
export { proteinSequence } from "../core/protein.js";
export {
  corpus,
  repertoire,
  validateRandomInput,
} from "../random/batch42-shared.js";
import { validateRandomInput } from "../random/batch42-shared.js";
export const validateInput = (
  v: unknown,
  fields: readonly SimpleField[],
): void => {
  if (fields.some((f) => f.id === "candidateInputsJson")) {
    validateRandomInput(v, fields);
    return;
  }
  baseValidate(v, fields);
  const r = v as Record<string, unknown>;
  for (const f of fields)
    if (f.kind === "string" && (r[f.id] as string).length > 8192)
      simpleError(f.id, "Batch-local text is bounded to 8,192 UTF-16 units.");
  for (const f of fields) if (f.kind === "object") inspectJson(r[f.id]);
};
export type Json =
  null | boolean | number | string | Json[] | { [key: string]: Json };
export const inspectJson = (value: unknown): void => {
  let nodes = 0;
  const walk = (v: unknown, depth: number): void => {
    if (++nodes > 20000 || depth > 32)
      simpleError("json", "At most 20,000 nodes and 32 nesting levels.");
    if (v === null || typeof v === "boolean") return;
    if (typeof v === "number") {
      finite(v);
      return;
    }
    if (typeof v === "string") {
      if (v.length > 8192) simpleError("json", "Bounded strings.");
      return;
    }
    if (!v || typeof v !== "object") simpleError("json", "JSON data only.");
    if (Array.isArray(v)) {
      if (v.length > 10000) simpleError("json", "Bounded arrays.");
      for (let j = 0; j < v.length; j++) {
        if (!Object.hasOwn(v, j)) simpleError("json", "Dense own array slots.");
        walk(v[j], depth + 1);
      }
    } else {
      if (
        Object.getPrototypeOf(v) !== Object.prototype &&
        Object.getPrototypeOf(v) !== null
      )
        simpleError("json", "Plain own JSON records.");
      for (const [k, x] of Object.entries(v)) {
        if (k.length > 1024) simpleError("json", "Bounded keys.");
        walk(x, depth + 1);
      }
    }
  };
  walk(value, 0);
};
export const parseJson = (s: string): Json => {
  let v: unknown;
  try {
    v = JSON.parse(s);
  } catch {
    simpleError("json", "Strict JSON required.");
  }
  inspectJson(v);
  return v as Json;
};
export const record = (v: Json): { [key: string]: Json } => {
  if (v === null || typeof v !== "object" || Array.isArray(v))
    simpleError("record", "JSON object required.");
  return v;
};
export const records = (s: string): { [key: string]: Json }[] => {
  const v = parseJson(s);
  if (!Array.isArray(v) || v.length > 128)
    simpleError("records", "At most 128 JSON records.");
  return v.map(record);
};
export const scalarKey = (v: Json): string => {
  if (v !== null && typeof v === "object")
    simpleError("key", "Scalar key required.");
  return JSON.stringify(v);
};
export const typeOf = (v: Json): string =>
  v === null ? "null" : Array.isArray(v) ? "array" : typeof v;
export const exactLookup = <T>(
  key: string,
  table: Readonly<Record<string, T>>,
): T => {
  if (!Object.hasOwn(table, key))
    simpleError("key", "Unsupported exact reference key.");
  return table[key];
};
export const qualifiedLookup = (
  q: string,
  keys: readonly string[],
  texts: readonly string[],
  ref: {
    callerVerifiedSource: string;
    callerVerifiedContext: string;
    callerVerifiedAsOfDate: string;
  },
): Record<string, unknown> => {
  ownReference(
    ref.callerVerifiedSource,
    ref.callerVerifiedContext,
    ref.callerVerifiedAsOfDate,
  );
  if (
    !q.trim() ||
    !keys.length ||
    keys.length !== texts.length ||
    keys.some((x) => !x.trim()) ||
    texts.some((x) => !x.trim())
  )
    simpleError(
      "reference",
      "Nonempty aligned topic-specific exact keys and evidence.",
    );
  unique(keys, "keys");
  const j = keys.indexOf(q);
  return {
    matched: j >= 0,
    referenceText: j < 0 ? null : texts[j],
    source: ref.callerVerifiedSource,
    context: ref.callerVerifiedContext,
    asOfDate: ref.callerVerifiedAsOfDate,
  };
};
export const observation = (
  known: boolean,
  present: boolean,
  controlValid: boolean,
): string =>
  !known || !controlValid ? "indeterminate" : present ? "positive" : "negative";
export const countFraction = (n: number, d: number): number => {
  bounded(n, "numerator", 0, Number.MAX_SAFE_INTEGER);
  bounded(d, "denominator", 1, Number.MAX_SAFE_INTEGER);
  if (n > d) simpleError("count", "Subset cannot exceed total.");
  return n / d;
};
export const mod = (a: number, n: number): number => ((a % n) + n) % n;
export const span = (start: number, end: number, length: number): void => {
  bounded(start, "start", 0, length);
  bounded(end, "end", start, length);
};
export const lines = (
  s: string,
): { text: string; start: number; end: number; eol: string }[] => {
  const a: { text: string; start: number; end: number; eol: string }[] = [];
  let start = 0;
  const re = /\r\n|\r|\n/g;
  for (const m of s.matchAll(re)) {
    const end = m.index!;
    a.push({ text: s.slice(start, end), start, end, eol: m[0] });
    start = end + m[0].length;
  }
  a.push({ text: s.slice(start), start, end: s.length, eol: "" });
  return a;
};
export const scalarText = (s: string): void => {
  for (let j = 0; j < s.length; j++) {
    const c = s.charCodeAt(j);
    if (c >= 0xd800 && c <= 0xdbff) {
      const d = s.charCodeAt(++j);
      if (!(d >= 0xdc00 && d <= 0xdfff))
        simpleError("text", "Unpaired surrogate unsupported.");
    } else if (c >= 0xdc00 && c <= 0xdfff)
      simpleError("text", "Unpaired surrogate unsupported.");
  }
};
export const surrogateBoundary = (s: string, k: number): boolean =>
  k > 0 &&
  k < s.length &&
  s.charCodeAt(k - 1) >= 0xd800 &&
  s.charCodeAt(k - 1) <= 0xdbff &&
  s.charCodeAt(k) >= 0xdc00 &&
  s.charCodeAt(k) <= 0xdfff;
export const occurrences = (
  s: string,
  needle: string,
  overlap = true,
): number[] => {
  if (!needle.length) simpleError("needle", "Nonempty literal needle.");
  const a: number[] = [];
  for (
    let j = 0;
    (j = s.indexOf(needle, j)) >= 0;
    j += overlap ? 1 : needle.length
  )
    a.push(j);
  return a;
};
export const orderedPair = (a: number, b: number, strict = false): void => {
  if (strict ? b <= a : b < a)
    simpleError("interval", "Ordered finite endpoints required.");
};
export type Edit = { start: number; end: number; text: string };
export const edits = (s: string, length: number): Edit[] => {
  const a = records(s).map((r) => {
    if (
      typeof r.start !== "number" ||
      typeof r.end !== "number" ||
      typeof r.text !== "string" ||
      Object.keys(r).some((k) => !["start", "end", "text"].includes(k))
    )
      simpleError("edits", "Explicit start,end,text only.");
    span(r.start, r.end, length);
    return { start: r.start, end: r.end, text: r.text };
  });
  a.sort((x, y) => x.start - y.start || x.end - y.end);
  for (let j = 1; j < a.length; j++)
    if (a[j].start < a[j - 1].end || a[j].start === a[j - 1].start)
      simpleError("edits", "Nonoverlapping edits with distinct starts.");
  return a;
};
export const throughEdits = (
  offset: number,
  a: readonly Edit[],
  right: boolean,
): number => {
  let delta = 0;
  for (const e of a) {
    if (offset < e.start) break;
    if (offset <= e.end) return e.start + delta + (right ? e.text.length : 0);
    delta += e.text.length - (e.end - e.start);
  }
  return offset + delta;
};
export const intervals = (a: readonly (readonly number[])[]): number[][] => {
  if (a.length > 128) simpleError("intervals", "At most 128 intervals.");
  return a.map((r) => {
    if (r.length !== 2) simpleError("interval", "Endpoint pairs.");
    orderedPair(r[0], r[1]);
    return [...r];
  });
};
export const intervalCells = (
  a: readonly (readonly number[])[],
): { start: number; end: number; sourceIndexes: number[] }[] => {
  const x = [...new Set(a.flat())].sort((x, y) => x - y);
  return x.slice(0, -1).map((s, j) => ({
    start: s,
    end: x[j + 1],
    sourceIndexes: a.flatMap(([lo, hi], k) =>
      lo <= s && hi >= x[j + 1] && hi > lo ? [k] : [],
    ),
  }));
};
export const runs = <T>(
  a: readonly T[],
): { start: number; end: number; value: T }[] => {
  const out: { start: number; end: number; value: T }[] = [];
  a.forEach((v, j) => {
    const last = out.at(-1);
    if (last && Object.is(last.value, v)) last.end = j + 1;
    else out.push({ start: j, end: j + 1, value: v });
  });
  return out;
};
export const timeSamples = (
  t: readonly number[],
  y: readonly number[],
  minimum = 1,
): void => {
  if (t.length !== y.length || t.length < minimum)
    simpleError("samples", "Aligned time/value arrays.");
  for (let j = 1; j < t.length; j++)
    if (t[j] <= t[j - 1])
      simpleError("times", "Strictly increasing timestamps.");
};
export const eventOrder = (t: readonly number[]): void => {
  for (let j = 1; j < t.length; j++)
    if (t[j] < t[j - 1])
      simpleError(
        "events",
        "Nondecreasing event times; equal timestamps retained.",
      );
};
export const jsonLeaves = (
  root: Json,
): { path: string; value: Json; depth: number }[] => {
  const out: { path: string; value: Json; depth: number }[] = [];
  const walk = (v: Json, p: string, d: number): void => {
    if (v === null || typeof v !== "object") {
      out.push({ path: p, value: v, depth: d });
      return;
    }
    for (const [k, x] of Object.entries(v))
      walk(x, p + "/" + escapePointer(k), d + 1);
  };
  walk(root, "", 0);
  return out;
};
export const jsonNodes = (
  root: Json,
): { path: string; value: Json; depth: number }[] => {
  const out: { path: string; value: Json; depth: number }[] = [];
  const walk = (v: Json, p: string, d: number): void => {
    out.push({ path: p, value: v, depth: d });
    if (v && typeof v === "object")
      for (const [k, x] of Object.entries(v))
        walk(x, p + "/" + escapePointer(k), d + 1);
  };
  walk(root, "", 0);
  return out;
};
export const escapePointer = (s: string): string =>
  s.replaceAll("~", "~0").replaceAll("/", "~1");
export const unescapePointer = (s: string): string => {
  if (/~(?![01])/.test(s)) simpleError("token", "Only ~0 and ~1 escapes.");
  return s.replaceAll("~1", "/").replaceAll("~0", "~");
};
export const pointerTokens = (s: string): string[] => {
  if (s === "") return [];
  if (!s.startsWith("/"))
    simpleError("pointer", "Empty root or leading slash.");
  return s.slice(1).split("/").map(unescapePointer);
};
export const pointerFormat = (a: readonly string[]): string =>
  a.length ? "/" + a.map(escapePointer).join("/") : "";
export const httpToken = /^[!#$%&'*+.^_`|~0-9A-Za-z-]+$(?![\s\S])/;
export const decimalUnsigned = (s: string): string => {
  if (!/^[0-9]+$(?![\s\S])/.test(s))
    simpleError("decimal", "ASCII unsigned decimal digits only.");
  return s.replace(/^0+(?=.)/, "");
};
export const queryPairs = (
  s: string,
): { index: number; name: string; value: string; raw: string }[] => {
  const q = s.startsWith("?") ? s.slice(1) : s;
  if (q.includes("#"))
    simpleError("query", "Query component only, excluding fragment.");
  const decode = (v: string): string => {
    try {
      return decodeURIComponent(v.replaceAll("+", " "));
    } catch {
      simpleError("query", "Valid percent escapes and UTF-8 encoding.");
    }
  };
  if (!q) return [];
  return q
    .split("&")
    .filter(Boolean)
    .map((raw, index) => {
      const k = raw.indexOf("=");
      return {
        index,
        name: decode(k < 0 ? raw : raw.slice(0, k)),
        value: decode(k < 0 ? "" : raw.slice(k + 1)),
        raw,
      };
    });
};
export const unquoteHttp = (s: string): string => {
  if (s.length < 2 || s[0] !== '"' || s.at(-1) !== '"')
    simpleError("quoted", "Quoted-string required.");
  let out = "";
  for (let j = 1; j < s.length - 1; j++) {
    let c = s[j];
    if (c === "\\") {
      if (++j >= s.length - 1) simpleError("quoted", "No dangling escape.");
      c = s[j];
      if (!/^[\t\x20-\x7e\x80-\xff]$(?![\s\S])/.test(c))
        simpleError("quoted", "Valid quoted-pair octet.");
    } else if (!/^[\t\x20\x21\x23-\x5b\x5d-\x7e\x80-\xff]$(?![\s\S])/.test(c))
      simpleError("quoted", "Valid qdtext octet.");
    out += c;
  }
  return out;
};
export const components = (s: string): string[] => {
  if (s.includes("\0")) simpleError("path", "NUL unsupported.");
  return s.split("/").filter(Boolean);
};
export const collapse = (
  s: string,
): {
  components: string[];
  events: { index: number; component: string; action: string }[];
  absolute: boolean;
} => {
  const absolute = s.startsWith("/"),
    out: string[] = [],
    events: { index: number; component: string; action: string }[] = [];
  components(s).forEach((c, index) => {
    let action = "push";
    if (c === ".") action = "discard-dot";
    else if (c === ".." && out.length && out.at(-1) !== "..") {
      out.pop();
      action = "pop";
    } else if (c === ".." && absolute) action = "clamp-root";
    else out.push(c);
    events.push({ index, component: c, action });
  });
  return { components: out, events, absolute };
};
export const filename = (s: string): void => {
  if (!s || /[\/\0]/.test(s) || [".", ".."].includes(s))
    simpleError("filename", "Single non-dot POSIX filename.");
};
export const extensionParts = (
  s: string,
): { stem: string; extensions: string[] } => {
  filename(s);
  const p = s.indexOf(".", s.startsWith(".") ? 1 : 0);
  return p < 0
    ? { stem: s, extensions: [] }
    : { stem: s.slice(0, p), extensions: s.slice(p + 1).split(".") };
};
export const mask = (
  m: readonly (readonly number[])[],
): { rows: number; columns: number } => {
  const r = m.length,
    c = m[0]?.length ?? 0;
  if (
    !r ||
    !c ||
    r * c > 16384 ||
    m.some((x) => x.length !== c || x.some((v) => v !== 0 && v !== 1))
  )
    simpleError(
      "mask",
      "Nonempty rectangular binary mask, bounded to 16,384 cells.",
    );
  return { rows: r, columns: c };
};
export const neighbors = (
  r: number,
  c: number,
  diagonal: boolean,
): number[][] =>
  diagonal
    ? [-1, 0, 1].flatMap((dr) =>
        [-1, 0, 1]
          .filter((dc) => dr !== 0 || dc !== 0)
          .map((dc) => [r + dr, c + dc]),
      )
    : [
        [r - 1, c],
        [r + 1, c],
        [r, c - 1],
        [r, c + 1],
      ];
export const rectangle = (a: readonly number[]): void => {
  if (a.length !== 4) simpleError("rectangle", "x,y,width,height.");
  nonnegative(a[2], "width");
  nonnegative(a[3], "height");
};
export const intersection = (
  a: readonly number[],
  b: readonly number[],
): number[] => {
  rectangle(a);
  rectangle(b);
  const x = Math.max(a[0], b[0]),
    y = Math.max(a[1], b[1]);
  return [
    x,
    y,
    Math.max(0, Math.min(a[0] + a[2], b[0] + b[2]) - x),
    Math.max(0, Math.min(a[1] + a[3], b[1] + b[3]) - y),
  ];
};
export const points = (
  p: readonly (readonly number[])[],
  minimum = 1,
): void => {
  if (p.length < minimum || p.some((r) => r.length !== 2))
    simpleError("points", "Actual ordered x,y pairs.");
};
export const polylineLengths = (
  p: readonly (readonly number[])[],
): number[] => {
  points(p, 2);
  return p.slice(1).map((v, j) => Math.hypot(v[0] - p[j][0], v[1] - p[j][1]));
};
export const distancePoint = (
  p: readonly (readonly number[])[],
  q: number,
): number[] => {
  const l = polylineLengths(p),
    total = l.reduce((a, b) => a + b, 0);
  if (q < 0 || q > total) simpleError("distance", "No extrapolation.");
  let s = 0;
  for (let j = 0; j < l.length; j++) {
    if (l[j] > 0 && q <= s + l[j]) {
      const u = (q - s) / l[j];
      return p[j].map((v, k) => v + u * (p[j + 1][k] - v));
    }
    s += l[j];
  }
  return [...p.at(-1)!];
};
export const svgNumbers = (s: string): number[] => {
  const trimmed = s.trim();
  if (!trimmed) return [];
  const token = /[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?/y;
  let pos = 0;
  const out: number[] = [];
  while (pos < trimmed.length) {
    token.lastIndex = pos;
    const m = token.exec(trimmed);
    if (!m) simpleError("numbers", "SVG finite number list syntax.");
    out.push(finite(Number(m[0])));
    pos = token.lastIndex;
    if (pos < trimmed.length) {
      const sep = /^[\t\n\r ]*(?:,[\t\n\r ]*)?/.exec(trimmed.slice(pos))![0];
      if (!sep.length && !/[+-]/.test(trimmed[pos]))
        simpleError("numbers", "Separated numbers required.");
      pos += sep.length;
      if (pos === trimmed.length && sep.includes(","))
        simpleError("numbers", "No trailing comma.");
    }
  }
  return out;
};
export const moveLineParse = (
  s: string,
): { command: string; x: number; y: number }[] => {
  const parts = s.match(/[MmLl][^MmLl]*/g);
  if (!parts || parts.join("").trim() !== s.trim() || !/[Mm]/.test(parts[0][0]))
    simpleError("path", "Initial moveto and only M/m/L/l commands.");
  const out: { command: string; x: number; y: number }[] = [];
  for (const part of parts) {
    let cmd = part[0];
    const a = svgNumbers(part.slice(1));
    if (!a.length || a.length % 2)
      simpleError("path", "Complete coordinate pairs per command.");
    for (let j = 0; j < a.length; j += 2) {
      out.push({ command: cmd, x: a[j], y: a[j + 1] });
      if (cmd === "M") cmd = "L";
      else if (cmd === "m") cmd = "l";
    }
  }
  return out;
};
/** RFC 3986 section 5.2.4, literal dot segments; percent escapes stay opaque. */
export const urlDotTrace = (
  path: string,
): {
  normalizedPath: string;
  events: { action: string; segment: string; removed: string | null }[];
} => {
  if (/[?#\0]/.test(path))
    simpleError("path", "Raw URL path only, without query, fragment or NUL.");
  let input = path,
    output = "";
  const events: { action: string; segment: string; removed: string | null }[] =
    [];
  while (input) {
    let action = "move",
      segment = "",
      removed: string | null = null;
    if (input.startsWith("../")) {
      action = "discard-relative-parent";
      segment = "../";
      input = input.slice(3);
    } else if (input.startsWith("./")) {
      action = "discard-relative-dot";
      segment = "./";
      input = input.slice(2);
    } else if (input.startsWith("/./")) {
      action = "remove-dot";
      segment = "/.";
      input = input.slice(2);
    } else if (input === "/.") {
      action = "remove-dot";
      segment = "/.";
      input = "/";
    } else if (input.startsWith("/../") || input === "/..") {
      action = "remove-parent";
      segment = "/..";
      input = input === "/.." ? "/" : input.slice(3);
      const k = output.lastIndexOf("/");
      removed = k < 0 ? output : output.slice(k);
      output = k < 0 ? "" : output.slice(0, k);
    } else if (input === "." || input === "..") {
      action = "discard-terminal-dot";
      segment = input;
      input = "";
    } else {
      const k = input.indexOf("/", input.startsWith("/") ? 1 : 0),
        end = k < 0 ? input.length : k;
      segment = input.slice(0, end);
      output += segment;
      input = input.slice(end);
    }
    events.push({ action, segment, removed });
  }
  return { normalizedPath: output, events };
};

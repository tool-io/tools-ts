import * as B from "../binary/batch54-shared.js";
import { utf8Encode } from "../core/encoding.js";
import {
  splitHeaderValue,
  parseHeaderParameter,
} from "../http/content-type-parser/tool.js";
import etagParser from "../http/etag-parser/tool.js";
import {
  parseSemanticVersion,
  compareSemanticVersions,
  type SemanticVersion,
} from "../development/semantic-version-compare/tool.js";
export * from "../binary/batch54-shared.js";
export const token = (s: string): boolean =>
  /^[!#$%&'*+.^_`|~0-9A-Za-z-]+(?![\s\S])/.test(s);
export const unit = (x: number): void => B.check(x >= 0 && x <= 1);
export const median = (a: readonly number[]): number => {
  B.check(a.length > 0);
  const s = [...a].sort((x, y) => x - y);
  return (s[Math.floor((s.length - 1) / 2)] + s[Math.floor(s.length / 2)]) / 2;
};
export const mean = (a: readonly number[]): number => {
  B.check(a.length > 0);
  return a.reduce((s, x) => s + x, 0) / a.length;
};
export const utf8 = (s: string): number => utf8Encode(s).length;
export const lexicalSplit = (
  s: string,
  delimiter: string,
): { text: string; start: number; end: number }[] => {
  B.check(
    delimiter.length === 1 && !s.includes("/*"),
    "CSS comments unsupported in this explicit dialect",
  );
  const out: { text: string; start: number; end: number }[] = [];
  let start = 0,
    quote = "",
    escaped = false;
  const stack: string[] = [];
  for (let j = 0; j < s.length; j++) {
    const c = s[j];
    if (escaped) {
      escaped = false;
      continue;
    }
    if (c === "\\") {
      escaped = true;
      continue;
    }
    if (quote) {
      if (c === quote) quote = "";
      continue;
    }
    if (c === '"' || c === "'") {
      quote = c;
      continue;
    }
    if ("([{".includes(c)) {
      stack.push(c);
      continue;
    }
    if (")]}".includes(c)) {
      const expected: Record<string, string> = { ")": "(", "]": "[", "}": "{" };
      B.check(stack.pop() === expected[c]);
      continue;
    }
    if (c === delimiter && !stack.length) {
      out.push({ text: s.slice(start, j), start, end: j });
      start = j + 1;
    }
  }
  B.check(!escaped && !quote && !stack.length);
  out.push({ text: s.slice(start), start, end: s.length });
  B.check(out.length <= 128);
  return out;
};
export const important = (s: string): { value: string; important: boolean } => {
  lexicalSplit(s, ";");
  const m = /\s*!\s*important\s*$/i.exec(s);
  if (!m) return { value: s.trim(), important: false };
  const before = s.slice(0, m.index);
  const parts = lexicalSplit(s, "!");
  B.check(parts.length >= 2);
  const last = parts.at(-1)!;
  if (!/^\s*important\s*$/i.test(last.text))
    return { value: s.trim(), important: false };
  return { value: before.trimEnd(), important: true };
};
export const declarations = (
  s: string,
): {
  name: string;
  value: string;
  important: boolean;
  start: number;
  end: number;
}[] =>
  lexicalSplit(s, ";")
    .filter((v) => v.text.trim())
    .map((r) => {
      const p = lexicalSplit(r.text, ":");
      B.check(p.length >= 2);
      const raw = p[0].text.trim();
      B.check(
        /^(?:--[A-Za-z0-9_-]+|[A-Za-z-][A-Za-z0-9-]*)(?![\s\S])/.test(raw),
      );
      const name = raw.startsWith("--") ? raw : raw.toLowerCase(),
        v = important(r.text.slice(p[0].end + 1));
      return { name, ...v, start: r.start, end: r.end };
    });
export const quad = (a: readonly number[]): number[] => {
  B.check(a.length >= 1 && a.length <= 4 && a.every((x) => x >= 0 && x <= 1e9));
  return a.length === 1
    ? [a[0], a[0], a[0], a[0]]
    : a.length === 2
      ? [a[0], a[1], a[0], a[1]]
      : a.length === 3
        ? [a[0], a[1], a[2], a[1]]
        : [...a];
};
export const compactQuad = (a: readonly number[]): number[] => {
  B.check(a.length === 4 && a.every((x) => x >= 0));
  return a.every((x) => x === a[0])
    ? [a[0]]
    : a[0] === a[2] && a[1] === a[3]
      ? [a[0], a[1]]
      : a[1] === a[3]
        ? [a[0], a[1], a[2]]
        : [...a];
};
export const glyphs = (
  s: string,
): { id: string; advance: number; cluster: number; box: number[] | null }[] =>
  B.records(s).map((v) => {
    const box = v.box === null ? null : (v.box as number[]);
    if (box) {
      B.check(Array.isArray(box) && box.length === 4);
      box.forEach(B.num);
      B.check(box[2] >= box[0] && box[3] >= box[1]);
    }
    return {
      id: B.str(v.id),
      advance: B.num(v.advance),
      cluster: B.int(B.num(v.cluster), 0, 8192),
      box,
    };
  });
export const glyphPlaced = (
  s: string,
): {
  id: string;
  advance: number;
  cluster: number;
  box: number[] | null;
  x: number;
}[] => {
  let x = 0;
  return glyphs(s).map((v) => {
    const r = { ...v, x };
    x += v.advance;
    return r;
  });
};
export const runs = <T>(
  a: readonly T[],
  key: (v: T) => string,
): { key: string; start: number; end: number }[] => {
  const r: { key: string; start: number; end: number }[] = [];
  a.forEach((v, j) => {
    const k = key(v),
      p = r.at(-1);
    if (p && p.key === k) p.end = j + 1;
    else r.push({ key: k, start: j, end: j + 1 });
  });
  return r;
};
export const logs = (
  s: string,
): {
  id: string;
  time: number;
  source: string;
  level: string;
  message: string;
  sequence: number;
}[] =>
  B.records(s).map((v) => ({
    id: B.str(v.id),
    time: B.num(v.time),
    source: B.str(v.source),
    level: B.str(v.level),
    message: B.str(v.message),
    sequence: B.int(B.num(v.sequence), 0, 1e12),
  }));
export const triplets = (
  s: string,
  rows: number,
  columns: number,
): { row: number; column: number; value: number }[] => {
  B.int(rows, 0, 128);
  B.int(columns, 0, 128);
  return B.records(s).map((v) => ({
    row: B.int(B.num(v.row), 0, rows - 1),
    column: B.int(B.num(v.column), 0, columns - 1),
    value: B.num(v.value),
  }));
};
export const combineTriplets = (
  a: readonly { row: number; column: number; value: number }[],
): { row: number; column: number; value: number }[] =>
  B.groups(a, (v) => JSON.stringify([v.row, v.column])).map((g) => ({
    row: a[g.indexes[0]].row,
    column: a[g.indexes[0]].column,
    value: g.indexes.reduce((s, j) => s + a[j].value, 0),
  }));
export const compressed = (
  p: readonly number[],
  indexes: readonly number[],
  values: readonly number[],
  major: number,
  minor: number,
): void => {
  B.int(major, 0, 127);
  B.int(minor, 0, 128);
  B.check(
    p.length === major + 1 &&
      p[0] === 0 &&
      p.at(-1) === indexes.length &&
      indexes.length === values.length,
  );
  p.forEach((x, j) => {
    B.int(x, 0, indexes.length);
    B.check(j === 0 || x >= p[j - 1]);
  });
  indexes.forEach((x) => B.int(x, 0, minor - 1));
};
export const point = (p: readonly number[]): void =>
  B.check(
    p.length === 2 && p.every((x) => Number.isFinite(x) && Math.abs(x) <= 1e9),
    "Planar point coordinate budget is +/-1e9",
  );
export const cross = (
  a: readonly number[],
  b: readonly number[],
  c: readonly number[],
): number => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
export const rect = (r: readonly number[]): void =>
  B.check(
    r.length === 4 &&
      r.every((x) => Number.isFinite(x) && Math.abs(x) <= 1e9) &&
      r[2] >= r[0] &&
      r[3] >= r[1],
  );
export const segmentParameter = (
  p: readonly number[],
  a: readonly number[],
  b: readonly number[],
): number => {
  [p, a, b].forEach(point);
  const dx = b[0] - a[0],
    dy = b[1] - a[1],
    den = dx * dx + dy * dy;
  B.check(den > 0);
  return ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / den;
};
export const clipSegment = (
  a: readonly number[],
  b: readonly number[],
  r: readonly number[],
): number[][] | null => {
  [a, b].forEach(point);
  rect(r);
  const dx = b[0] - a[0],
    dy = b[1] - a[1];
  let lo = 0,
    hi = 1;
  const p = [-dx, dx, -dy, dy],
    q = [a[0] - r[0], r[2] - a[0], a[1] - r[1], r[3] - a[1]];
  for (let j = 0; j < 4; j++) {
    if (p[j] === 0) {
      if (q[j] < 0) return null;
    } else {
      const t = q[j] / p[j];
      if (p[j] < 0) lo = Math.max(lo, t);
      else hi = Math.min(hi, t);
    }
  }
  return lo <= hi
    ? [
        [a[0] + lo * dx, a[1] + lo * dy],
        [a[0] + hi * dx, a[1] + hi * dy],
      ]
    : null;
};
export const clipPolygon = (
  points: readonly (readonly number[])[],
  nx: number,
  ny: number,
  c: number,
): number[][] => {
  points.forEach(point);
  B.check(
    (nx !== 0 || ny !== 0) &&
      [nx, ny, c].every((x) => Number.isFinite(x) && Math.abs(x) <= 1e9),
  );
  const out: number[][] = [];
  for (let j = 0; j < points.length; j++) {
    const a = points[j],
      b = points[(j + 1) % points.length],
      fa = nx * a[0] + ny * a[1] - c,
      fb = nx * b[0] + ny * b[1] - c;
    if (fa <= 0) out.push([...a]);
    if ((fa < 0 && fb > 0) || (fa > 0 && fb < 0)) {
      const t = fa / (fa - fb);
      out.push([a[0] + t * (b[0] - a[0]), a[1] + t * (b[1] - a[1])]);
    }
  }
  return out;
};
export const midiCount = (s: number): number => {
  B.int(s, 128, 239);
  return s >> 4 === 12 || s >> 4 === 13 ? 1 : 2;
};
export const midiRecords = (s: string): { status: number; data: number[] }[] =>
  B.records(s).map((v) => {
    const status = B.int(B.num(v.status), 128, 239),
      data = v.data as number[];
    B.check(Array.isArray(data) && data.length === midiCount(status));
    data.forEach((x) => B.int(x, 0, 127));
    return { status, data: [...data] };
  });
export const normTurn = (x: number): number => B.mod(x, 1);
export const shortTurn = (a: number, b: number): number => {
  const d = normTurn(b - a);
  return d <= 0.5 ? d : d - 1;
};
export const cssReferences = (
  s: string,
): { name: string; position: number }[] => {
  lexicalSplit(s, ",");
  const out: { name: string; position: number }[] = [];
  let quote = "";
  for (let j = 0; j < s.length; j++) {
    if (s[j] === "\\") {
      j++;
      continue;
    }
    if (quote) {
      if (s[j] === quote) quote = "";
      continue;
    }
    if (s[j] === '"' || s[j] === "'") {
      quote = s[j];
      continue;
    }
    if (
      s.slice(j, j + 4) === "var(" &&
      (j === 0 || !/[A-Za-z0-9_-]/.test(s[j - 1]))
    ) {
      const m = /^\s*(--[A-Za-z0-9_-]+)\s*[,)]/.exec(s.slice(j + 4));
      B.check(m, "Restricted var() name required");
      out.push({ name: m![1], position: j });
    }
  }
  return out;
};
export const intersectSegments = (
  a: readonly number[],
  b: readonly number[],
  c: readonly number[],
  d: readonly number[],
): { kind: string; points: number[][] } => {
  [a, b, c, d].forEach(point);
  const on = (
    p: readonly number[],
    x: readonly number[],
    y: readonly number[],
  ) =>
    cross(x, y, p) === 0 &&
    p[0] >= Math.min(x[0], y[0]) &&
    p[0] <= Math.max(x[0], y[0]) &&
    p[1] >= Math.min(x[1], y[1]) &&
    p[1] <= Math.max(x[1], y[1]);
  const dx = b[0] - a[0],
    dy = b[1] - a[1],
    ex = d[0] - c[0],
    ey = d[1] - c[1],
    den = dx * ey - dy * ex;
  if (den !== 0) {
    const t = ((c[0] - a[0]) * ey - (c[1] - a[1]) * ex) / den,
      u = ((c[0] - a[0]) * dy - (c[1] - a[1]) * dx) / den;
    return t >= 0 && t <= 1 && u >= 0 && u <= 1
      ? { kind: "point", points: [[a[0] + t * dx, a[1] + t * dy]] }
      : { kind: "none", points: [] };
  }
  const points = [
    ...new Map(
      [a, b, c, d]
        .filter((p) => on(p, a, b) && on(p, c, d))
        .map((p) => [JSON.stringify(p), [...p]]),
    ).values(),
  ].sort((p, q) => p[0] - q[0] || p[1] - q[1]);
  return {
    kind: points.length > 1 ? "overlap" : points.length ? "point" : "none",
    points: points.length > 1 ? [points[0], points.at(-1)!] : points,
  };
};
export const scalar = (v: unknown): string | number | boolean | null => {
  B.check(v === null || ["string", "number", "boolean"].includes(typeof v));
  if (typeof v === "number") B.num(v);
  return v as string | number | boolean | null;
};
export const typedKey = (v: unknown): string => {
  scalar(v);
  return v === null
    ? "z:"
    : typeof v === "boolean"
      ? "b:" + (v ? "1" : "0")
      : typeof v === "number"
        ? "n:" + (Object.is(v, -0) ? "-0" : String(v))
        : "s:" + (v as string).length + ":" + v;
};
export const untypedKey = (s: string): string | number | boolean | null => {
  if (s === "z:") return null;
  if (s === "b:1") return true;
  if (s === "b:0") return false;
  if (s.startsWith("n:")) {
    const v = B.numericToken(s.slice(2));
    B.check(typedKey(v) === s);
    return v;
  }
  const m = /^s:(0|[1-9]\d*):/.exec(s);
  B.check(m);
  const v = s.slice(m![0].length);
  B.check(v.length === Number(m![1]));
  return v;
};
export const keyNormalize = (s: string): string =>
  s.normalize("NFC").toLowerCase();
export const headerPairs = (s: string): { name: string; value: string }[] =>
  B.records(s).map((v) => {
    const name = B.str(v.name),
      value = B.str(v.value);
    B.check(token(name));
    B.check(
      value
        .split("")
        .every(
          (c) =>
            c.charCodeAt(0) === 9 ||
            (c.charCodeAt(0) >= 32 &&
              c.charCodeAt(0) !== 127 &&
              c.charCodeAt(0) <= 255),
        ),
    );
    return { name, value };
  });
export const httpSplit = (s: string, d: string): string[] => {
  const r = splitHeaderValue(s, d);
  B.check(r);
  B.check(r!.length <= 128);
  return r!;
};
export const parameters = (s: string): { name: string; value: string }[] =>
  httpSplit(s, ";")
    .filter((x) => x.trim() !== "")
    .map((v) => {
      const p = parseHeaderParameter(v);
      B.check(p);
      return { name: p!.name.toLowerCase(), value: p!.value };
    });
export const quoted = (s: string): string => {
  B.check(
    s
      .split("")
      .every(
        (c) =>
          c.charCodeAt(0) === 9 ||
          (c.charCodeAt(0) >= 32 &&
            c.charCodeAt(0) !== 127 &&
            c.charCodeAt(0) <= 255),
      ),
  );
  return '"' + s.replace(/["\\]/g, "\\$&") + '"';
};
export const parameterRecords = (
  s: string,
): { name: string; value: string }[] =>
  B.records(s).map((v) => {
    const name = B.str(v.name),
      value = B.str(v.value);
    B.check(token(name));
    quoted(value);
    return { name: name.toLowerCase(), value };
  });
export const parameterText = (
  p: readonly { name: string; value: string }[],
): string =>
  p
    .map((v) => v.name + "=" + (token(v.value) ? v.value : quoted(v.value)))
    .join("; ");
export const qualities = (s: string): { token: string; q: number }[] =>
  B.records(s).map((v) => {
    const t = B.str(v.token),
      q = B.num(v.q);
    B.check(token(t) || t === "*");
    unit(q);
    B.check(Math.abs(q * 1000 - Math.round(q * 1000)) < 1e-8);
    return { token: t, q };
  });
export const tag = (s: string): { weak: boolean; opaqueValue: string } => {
  const r = etagParser.execute({ etag: s });
  B.check(r.ok);
  if (!r.ok) return { weak: false, opaqueValue: "" };
  return r.output;
};
export const directives = (
  s: string,
): { name: string; value: string | null }[] =>
  B.records(s).map((v) => {
    const name = B.str(v.name);
    B.check(token(name) && (v.value === null || typeof v.value === "string"));
    return { name: name.toLowerCase(), value: v.value as string | null };
  });
export const media = (s: string): { type: string; subtype: string } => {
  const p = s.split("/");
  B.check(p.length === 2 && token(p[0]) && token(p[1]));
  return { type: p[0].toLowerCase(), subtype: p[1].toLowerCase() };
};
export const boundary = (s: string): void =>
  B.check(
    s.length >= 1 &&
      s.length <= 70 &&
      !s.endsWith(" ") &&
      s
        .split("")
        .every((c) =>
          "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'()+_,-./:=? ".includes(
            c,
          ),
        ),
  );
export const boundaryKind = (line: string, b: string): string => {
  boundary(b);
  if (!line.startsWith("--" + b)) return "none";
  const tail = line.slice(b.length + 2);
  return /^[ \t]*(?![\s\S])/.test(tail)
    ? "open"
    : /^--[ \t]*(?![\s\S])/.test(tail)
      ? "close"
      : "none";
};
export const icalEscape = (s: string): string => {
  B.check(!/\r(?!\n)/.test(s));
  return s
    .replace(/\\/g, "\\\\")
    .replace(/\r\n|\n/g, "\\n")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,");
};
export const icalUnescape = (s: string): string => {
  B.check(!/[\r\n]/.test(s));
  let out = "";
  for (let j = 0; j < s.length; j++) {
    if (s[j] !== "\\") {
      out += s[j];
      continue;
    }
    B.check(++j < s.length && "nN\\;,".includes(s[j]));
    out += s[j] === "n" || s[j] === "N" ? "\n" : s[j];
  }
  return out;
};
export const dateValid = (year: number, month: number, day: number): void => {
  B.int(year, 1, 9999);
  B.int(month, 1, 12);
  const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0),
    days = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  B.int(day, 1, days[month - 1]);
};
export const dateBasic = (
  s: string,
): { year: number; month: number; day: number } => {
  const m = /^(\d{4})(\d{2})(\d{2})(?![\s\S])/.exec(s);
  B.check(m);
  const year = Number(m![1]),
    month = Number(m![2]),
    day = Number(m![3]);
  dateValid(year, month, day);
  return { year, month, day };
};
export const timeBasic = (
  s: string,
): { hour: number; minute: number; second: number; utc: boolean } => {
  const m = /^(\d{2})(\d{2})(\d{2})(Z?)(?![\s\S])/.exec(s);
  B.check(m);
  const hour = B.int(Number(m![1]), 0, 23),
    minute = B.int(Number(m![2]), 0, 59),
    second = B.int(Number(m![3]), 0, 60);
  return { hour, minute, second, utc: m![4] === "Z" };
};
export const icalName = (s: string): void =>
  B.check(/^[A-Za-z0-9-]+(?![\s\S])/.test(s));
export const version = (s: string): SemanticVersion => {
  B.check(s.length <= 1024 && !/\s/.test(s));
  const v = parseSemanticVersion(s);
  [
    v.major,
    v.minor,
    v.patch,
    ...v.prerelease.filter((x) => typeof x === "number"),
  ].forEach((x) =>
    B.check(
      Number.isSafeInteger(x) && Number(x) >= 0,
      "SemVer numeric component must be safe",
    ),
  );
  return v;
};
export const versionText = (v: SemanticVersion): string => {
  [v.major, v.minor, v.patch].forEach((x) =>
    B.check(Number.isSafeInteger(x) && x >= 0),
  );
  v.prerelease.forEach((x) => {
    B.check(
      (typeof x === "number" && Number.isSafeInteger(x) && x >= 0) ||
        (typeof x === "string" &&
          /^[0-9A-Za-z-]+(?![\s\S])/.test(x) &&
          (!/^\d+$/.test(x) || x === "0" || !x.startsWith("0"))),
      "Invalid SemVer prerelease identifier",
    );
  });
  v.build.forEach((x) =>
    B.check(
      typeof x === "string" && /^[0-9A-Za-z-]+(?![\s\S])/.test(x),
      "Invalid SemVer build identifier",
    ),
  );
  const s =
    [v.major, v.minor, v.patch].join(".") +
    (v.prerelease.length ? "-" + v.prerelease.join(".") : "") +
    (v.build.length ? "+" + v.build.join(".") : "");
  version(s);
  return s;
};
export const versionCompare = compareSemanticVersions;
export const assignments = (s: string): { name: string; value: string }[] =>
  B.records(s).map((v) => {
    const name = B.str(v.name),
      value = B.str(v.value);
    B.check(
      /^[A-Za-z_][A-Za-z0-9_]*(?![\s\S])/.test(name) &&
        !value.includes("\u0000"),
    );
    return { name, value };
  });
export const envRefs = (
  s: string,
): { name: string; start: number; end: number }[] =>
  [
    ...s.matchAll(/\$\{([A-Za-z_][A-Za-z0-9_]*)\}|\$([A-Za-z_][A-Za-z0-9_]*)/g),
  ].map((m) => ({
    name: m[1] ?? m[2],
    start: m.index,
    end: m.index + m[0].length,
  }));
export const iniName = (s: string): void =>
  B.check(s.length > 0 && s === s.trim() && !/[\r\n\u0000\[\]]/.test(s));
export const iniAssignment = (
  line: string,
): { name: string; value: string } => {
  B.check(!/[\r\n\u0000]/.test(line));
  const j = line.indexOf("=");
  B.check(j > 0);
  const name = line.slice(0, j).trim(),
    value = line.slice(j + 1).trim();
  iniName(name);
  return { name, value };
};
export const iniRecords = (
  s: string,
): { section: string; name: string; value: string }[] =>
  B.records(s).map((v) => {
    const section = B.str(v.section),
      name = B.str(v.name),
      value = B.str(v.value);
    if (section) iniName(section);
    iniName(name);
    B.check(!/[\r\n\u0000]/.test(value) && !name.includes("="));
    return { section, name, value };
  });
export type SgrStyle = {
  bold: boolean;
  faint: boolean;
  italic: boolean;
  underline: boolean;
  inverse: boolean;
  strike: boolean;
  foreground: string;
  background: string;
};
export const emptyStyle = (): SgrStyle => ({
  bold: false,
  faint: false,
  italic: false,
  underline: false,
  inverse: false,
  strike: false,
  foreground: "default",
  background: "default",
});
export const colorParams = (value: string, bg: boolean): number[] => {
  if (value === "default") return [bg ? 49 : 39];
  const p = value.split(":");
  B.check(
    p.slice(1).every((s) => /^(0|[1-9][0-9]{0,2})(?![\s\S])/.test(s)),
    "Canonical byte color components required",
  );
  if (p[0] === "index") {
    B.check(p.length === 2);
    return [bg ? 48 : 38, 5, B.int(Number(p[1]), 0, 255)];
  }
  B.check(p.length === 4 && p[0] === "rgb");
  return [bg ? 48 : 38, 2, ...p.slice(1).map((x) => B.int(Number(x), 0, 255))];
};
export const styleRecord = (s: string): SgrStyle => {
  const r = B.rec(B.json(s)),
    v = emptyStyle();
  B.check(Object.keys(r).length === Object.keys(v).length);
  for (const k of [
    "bold",
    "faint",
    "italic",
    "underline",
    "inverse",
    "strike",
  ] as const) {
    B.check(typeof r[k] === "boolean");
    v[k] = r[k] as boolean;
  }
  v.foreground = B.str(r.foreground);
  v.background = B.str(r.background);
  colorParams(v.foreground, false);
  colorParams(v.background, true);
  return v;
};
export const replaySgr = (
  params: readonly number[],
  initial: SgrStyle = emptyStyle(),
): SgrStyle => {
  params.forEach((x) => B.int(x, 0, 255));
  let s = { ...initial };
  for (let j = 0; j < params.length; j++) {
    const p = params[j];
    if (p === 0) s = emptyStyle();
    else if (p === 1) s.bold = true;
    else if (p === 2) s.faint = true;
    else if (p === 22) {
      s.bold = false;
      s.faint = false;
    } else if ([3, 23, 4, 24, 7, 27, 9, 29].includes(p)) {
      if (p === 3 || p === 23) s.italic = p === 3;
      if (p === 4 || p === 24) s.underline = p === 4;
      if (p === 7 || p === 27) s.inverse = p === 7;
      if (p === 9 || p === 29) s.strike = p === 9;
    } else if (p === 39 || p === 49)
      s[p === 39 ? "foreground" : "background"] = "default";
    else if (
      (p >= 30 && p <= 37) ||
      (p >= 40 && p <= 47) ||
      (p >= 90 && p <= 97) ||
      (p >= 100 && p <= 107)
    ) {
      const bg = (p >= 40 && p <= 47) || p >= 100;
      s[bg ? "background" : "foreground"] =
        "index:" + (p >= 90 ? (p % 10) + 8 : p % 10);
    } else if (p === 38 || p === 48) {
      const mode = params[++j];
      let color = "";
      if (mode === 5) {
        B.check(j + 1 < params.length);
        color = "index:" + B.int(params[++j], 0, 255);
      } else {
        B.check(mode === 2 && j + 3 < params.length);
        color =
          "rgb:" +
          params
            .slice(j + 1, j + 4)
            .map((x) => B.int(x, 0, 255))
            .join(":");
        j += 3;
      }
      s[p === 38 ? "foreground" : "background"] = color;
    } else B.check(false, "Unsupported SGR parameter");
  }
  return s;
};
export const sgrDelta = (a: SgrStyle, b: SgrStyle): number[] => {
  const p: number[] = [];
  if (a.bold !== b.bold || a.faint !== b.faint) {
    p.push(22);
    if (b.bold) p.push(1);
    if (b.faint) p.push(2);
  }
  for (const [key, on, off] of [
    ["italic", 3, 23],
    ["underline", 4, 24],
    ["inverse", 7, 27],
    ["strike", 9, 29],
  ] as const)
    if (a[key] !== b[key]) p.push(b[key] ? on : off);
  if (a.foreground !== b.foreground)
    p.push(...colorParams(b.foreground, false));
  if (a.background !== b.background) p.push(...colorParams(b.background, true));
  return p;
};
export const escapeTokens = (
  s: string,
): {
  start: number;
  end: number;
  type: string;
  text: string;
  complete: boolean;
}[] => {
  const out: {
    start: number;
    end: number;
    type: string;
    text: string;
    complete: boolean;
  }[] = [];
  for (let j = 0; j < s.length;) {
    if (s[j] !== "\x1b") {
      j++;
      continue;
    }
    const start = j++;
    let type = "ESC",
      complete = false;
    if (s[j] === "[") {
      type = "CSI";
      j++;
      while (j < s.length && s.charCodeAt(j) >= 0x30 && s.charCodeAt(j) <= 0x3f)
        j++;
      while (j < s.length && s.charCodeAt(j) >= 0x20 && s.charCodeAt(j) <= 0x2f)
        j++;
      if (j < s.length && s.charCodeAt(j) >= 0x40 && s.charCodeAt(j) <= 0x7e) {
        j++;
        complete = true;
      }
    } else if (s[j] === "]") {
      type = "OSC";
      j++;
      while (j < s.length) {
        if (s[j] === "\x07") {
          j++;
          complete = true;
          break;
        }
        if (s[j] === "\x1b" && s[j + 1] === "\\") {
          j += 2;
          complete = true;
          break;
        }
        j++;
      }
    } else if (j < s.length) {
      j++;
      complete = true;
    }
    out.push({ start, end: j, type, text: s.slice(start, j), complete });
  }
  return out;
};
export const sqlQuote = (s: string, style: string): string => {
  B.check(!s.includes("\u0000"));
  const q =
    style === "single"
      ? "'"
      : style === "double"
        ? '"'
        : style === "backtick"
          ? "`"
          : style === "bracket"
            ? "]"
            : "";
  B.check(q);
  return (style === "bracket" ? "[" : q) + s.split(q).join(q + q) + q;
};
export const sqlUnquote = (s: string, style: string): string => {
  const q =
    style === "single"
      ? "'"
      : style === "double"
        ? '"'
        : style === "backtick"
          ? "`"
          : style === "bracket"
            ? "]"
            : "";
  B.check(
    q &&
      s.length >= 2 &&
      s[0] === (style === "bracket" ? "[" : q) &&
      s.at(-1) === q,
  );
  let value = "";
  for (let j = 1; j < s.length - 1; j++) {
    const c = s[j];
    if (c === q) {
      B.check(s[j + 1] === q && j + 1 < s.length - 1);
      j++;
    }
    value += c;
  }
  B.check(!value.includes("\u0000"));
  return value;
};
export const polynomial = (v: readonly number[]): number[] => {
  B.check(v.length > 0);
  const a = [...v];
  while (a.length > 1 && a.at(-1) === 0) a.pop();
  return a;
};
export const polyProduct = (
  a: readonly number[],
  b: readonly number[],
): number[] => {
  B.check(a.length > 0 && b.length > 0 && a.length + b.length - 1 <= 128);
  const out = Array(a.length + b.length - 1).fill(0) as number[];
  a.forEach((x, j) => b.forEach((y, k) => (out[j + k] += x * y)));
  return polynomial(out);
};
export const polyValue = (p: readonly number[], x: number): number => {
  let y = 0;
  for (let j = p.length - 1; j >= 0; j--) y = y * x + p[j];
  return y;
};
export const affine = (v: readonly number[]): void => B.check(v.length === 6);
export const affinePoint = (
  m: readonly number[],
  p: readonly number[],
  translation = true,
): number[] => {
  affine(m);
  point(p);
  return [
    m[0] * p[0] + m[2] * p[1] + (translation ? m[4] : 0),
    m[1] * p[0] + m[3] * p[1] + (translation ? m[5] : 0),
  ];
};
export const affineCompose = (
  a: readonly number[],
  b: readonly number[],
): number[] => {
  affine(a);
  affine(b);
  return [
    b[0] * a[0] + b[2] * a[1],
    b[1] * a[0] + b[3] * a[1],
    b[0] * a[2] + b[2] * a[3],
    b[1] * a[2] + b[3] * a[3],
    b[0] * a[4] + b[2] * a[5] + b[4],
    b[1] * a[4] + b[3] * a[5] + b[5],
  ];
};
export const affineInverse = (m: readonly number[]): number[] => {
  affine(m);
  const d = m[0] * m[3] - m[1] * m[2];
  B.check(d !== 0 && Number.isFinite(d));
  return [
    m[3] / d,
    -m[1] / d,
    -m[2] / d,
    m[0] / d,
    (m[2] * m[5] - m[3] * m[4]) / d,
    (m[1] * m[4] - m[0] * m[5]) / d,
  ];
};
export const quat = (q: readonly number[]): void => B.check(q.length === 4);
export const qNorm = (q: readonly number[]): number[] => {
  quat(q);
  const n = Math.hypot(...q);
  B.check(n > 0 && Number.isFinite(n));
  return q.map((x) => x / n);
};
export const qUnit = (q: readonly number[]): void => {
  quat(q);
  B.check(Math.abs(Math.hypot(...q) - 1) <= 1e-10, "Unit quaternion required");
};
export const qConjugate = (q: readonly number[]): number[] => {
  quat(q);
  return [q[0], -q[1], -q[2], -q[3]];
};
export const qProduct = (
  a: readonly number[],
  b: readonly number[],
): number[] => {
  quat(a);
  quat(b);
  const [w, x, y, z] = a,
    [v, i, j, k] = b;
  return [
    w * v - x * i - y * j - z * k,
    w * i + x * v + y * k - z * j,
    w * j - x * k + y * v + z * i,
    w * k + x * j - y * i + z * v,
  ];
};
export const qRotate = (
  q: readonly number[],
  v: readonly number[],
): number[] => {
  qUnit(q);
  B.check(v.length === 3);
  return qProduct(qProduct(q, [0, ...v]), qConjugate(q)).slice(1);
};
export const qCanonical = (q: readonly number[]): number[] => {
  qUnit(q);
  const first = q.find((x) => x !== 0) ?? 1;
  return q.map((x) => (x === 0 ? 0 : first < 0 ? -x : x));
};
export const qInterpolate = (
  a: readonly number[],
  b: readonly number[],
  t: number,
  spherical: boolean,
): number[] => {
  qUnit(a);
  qUnit(b);
  unit(t);
  let right = [...b],
    dot = a.reduce((s, x, j) => s + x * b[j], 0);
  if (dot < 0) {
    dot = -dot;
    right = right.map((x) => -x);
  }
  dot = Math.max(-1, Math.min(1, dot));
  if (!spherical || dot > 0.9995)
    return qNorm(a.map((x, j) => (1 - t) * x + t * right[j]));
  const theta = Math.acos(dot),
    sin = Math.sin(theta);
  return qNorm(
    a.map(
      (x, j) =>
        (Math.sin((1 - t) * theta) * x + Math.sin(t * theta) * right[j]) / sin,
    ),
  );
};
export const curve = (
  p: readonly (readonly number[])[],
  degree?: number,
): void => {
  B.check(
    degree === undefined
      ? p.length === 3 || p.length === 4
      : p.length === degree + 1,
  );
  p.forEach(point);
};
export const bezier = (
  p: readonly (readonly number[])[],
  t: number,
): number[] => {
  unit(t);
  B.check(p.length > 0 && p.length <= 4);
  p.forEach(point);
  let a = p.map((v) => [...v]);
  while (a.length > 1)
    a = a
      .slice(1)
      .map((v, j) => [0, 1].map((k) => (1 - t) * a[j][k] + t * v[k]));
  return a[0];
};
export const bezierDerivative = (
  p: readonly (readonly number[])[],
): number[][] =>
  p.slice(1).map((v, j) => v.map((x, k) => (p.length - 1) * (x - p[j][k])));
export const bezierSplit = (
  p: readonly (readonly number[])[],
  t: number,
): { left: number[][]; right: number[][] } => {
  curve(p);
  unit(t);
  let a = p.map((v) => [...v]);
  const left = [a[0]],
    right = [a.at(-1)!];
  while (a.length > 1) {
    a = a
      .slice(1)
      .map((v, j) => [0, 1].map((k) => (1 - t) * a[j][k] + t * v[k]));
    left.push(a[0]);
    right.unshift(a.at(-1)!);
  }
  return { left, right };
};
export const bezierPower = (p: readonly (readonly number[])[]): number[][] => {
  curve(p);
  const n = p.length - 1;
  return Array.from({ length: n + 1 }, (_, k) =>
    [0, 1].map((axis) => {
      let sum = 0;
      for (let j = 0; j <= k; j++)
        sum += Number(B.choose(k, j)) * ((k - j) % 2 ? -1 : 1) * p[j][axis];
      return Number(B.choose(n, k)) * sum;
    }),
  );
};
export const curveFromPower = (
  p: readonly (readonly number[])[],
): number[][] => {
  curve(p);
  const n = p.length - 1;
  return Array.from({ length: n + 1 }, (_, i) =>
    [0, 1].map((axis) => {
      let v = 0;
      for (let k = 0; k <= i; k++)
        v += (Number(B.choose(i, k)) / Number(B.choose(n, k))) * p[k][axis];
      return v;
    }),
  );
};
export const cube = (p: readonly number[], integer = true): void => {
  B.check(p.length === 3 && Math.abs(p[0] + p[1] + p[2]) <= 1e-8);
  if (integer) p.forEach((x) => B.int(x, -1e9, 1e9));
};
export const cubeRound = (p: readonly number[]): number[] => {
  cube(p, false);
  const r = p.map(Math.round),
    d = r.map((x, j) => Math.abs(x - p[j]));
  if (d[0] > d[1] && d[0] > d[2]) r[0] = -r[1] - r[2];
  else if (d[1] > d[2]) r[1] = -r[0] - r[2];
  else r[2] = -r[0] - r[1];
  return r;
};
export const hexDirs = [
  [1, 0],
  [1, -1],
  [0, -1],
  [-1, 0],
  [-1, 1],
  [0, 1],
] as const;
export const hexRing = (q: number, r: number, radius: number): number[][] => {
  B.int(q, -1e9, 1e9);
  B.int(r, -1e9, 1e9);
  B.int(radius, 0, 21);
  if (!radius) return [[q, r]];
  let x = q - radius,
    y = r + radius;
  const out: number[][] = [];
  for (const [dx, dy] of hexDirs)
    for (let j = 0; j < radius; j++) {
      out.push([x, y]);
      x += dx;
      y += dy;
    }
  return out;
};
export const voxel = (p: readonly number[]): void => {
  B.check(p.length === 3);
  p.forEach((x) => B.int(x, -1e9, 1e9));
};
export const dimensions = (d: readonly number[]): void => {
  B.check(d.length === 3);
  d.forEach((x) => B.int(x, 1, 1e6));
};
export const voxelBox = (
  lo: readonly number[],
  hi: readonly number[],
): void => {
  voxel(lo);
  voxel(hi);
  B.check(lo.every((x, j) => hi[j] >= x));
};
export const voxelVolume = (d: readonly number[]): bigint =>
  d.reduce((s, x) => s * BigInt(x), 1n);
export const voxels = (p: readonly (readonly number[])[]): number[][] => {
  p.forEach(voxel);
  return [...new Map(p.map((v) => [JSON.stringify(v), [...v]])).values()];
};
export const floatLayout = (
  width: number,
): { exponentBits: number; fractionBits: number; bias: number } => {
  B.check([16, 32, 64].includes(width));
  return width === 16
    ? { exponentBits: 5, fractionBits: 10, bias: 15 }
    : width === 32
      ? { exponentBits: 8, fractionBits: 23, bias: 127 }
      : { exponentBits: 11, fractionBits: 52, bias: 1023 };
};
export const floatFields = (
  pattern: string,
  width: number,
): {
  bits: bigint;
  sign: number;
  exponent: number;
  fraction: bigint;
  kind: string;
  exponentBits: number;
  fractionBits: number;
  bias: number;
} => {
  const l = floatLayout(width),
    bits = B.bigint(pattern);
  B.check(bits >= 0n && bits < 1n << BigInt(width));
  const sign = Number(bits >> BigInt(width - 1)),
    exponent = Number(
      (bits >> BigInt(l.fractionBits)) & ((1n << BigInt(l.exponentBits)) - 1n),
    ),
    fraction = bits & ((1n << BigInt(l.fractionBits)) - 1n),
    max = 2 ** l.exponentBits - 1;
  return {
    bits,
    sign,
    exponent,
    fraction,
    kind:
      exponent === max
        ? fraction === 0n
          ? "infinity"
          : "nan"
        : exponent === 0
          ? fraction === 0n
            ? "zero"
            : "subnormal"
          : "normal",
    ...l,
  };
};
export const confusion = (
  matrix: readonly (readonly number[])[],
  labels: readonly string[],
): void => {
  B.check(
    B.unique(labels).length === labels.length &&
      matrix.length === labels.length &&
      matrix.every((r) => r.length === labels.length && r.every((x) => x >= 0)),
  );
};
export const confusionBuild = (
  actual: readonly string[],
  predicted: readonly string[],
  labels: readonly string[],
  weights?: readonly number[],
): number[][] => {
  B.check(
    actual.length === predicted.length &&
      B.unique(labels).length === labels.length,
  );
  if (weights)
    B.check(weights.length === actual.length && weights.every((x) => x >= 0));
  const out = labels.map(() => labels.map(() => 0));
  actual.forEach((a, j) => {
    const x = labels.indexOf(a),
      y = labels.indexOf(predicted[j]);
    B.check(x >= 0 && y >= 0);
    out[x][y] += weights?.[j] ?? 1;
  });
  return out;
};
export const scoreRows = (
  matrix: readonly (readonly number[])[],
  labels: readonly string[],
): void => {
  B.check(labels.length > 0 && B.unique(labels).length === labels.length);
  matrix.forEach((row) => {
    B.check(row.length === labels.length);
    row.forEach(unit);
    B.check(
      Math.abs(row.reduce((s, x) => s + x, 0) - 1) <= 1e-8,
      "Explicit probability rows must sum to one",
    );
  });
};
export const histogramEdges = (edges: readonly number[]): void =>
  B.check(
    edges.length >= 2 && edges.every((x, j) => j === 0 || x > edges[j - 1]),
  );
export const binIndex = (
  x: number,
  edges: readonly number[],
): number | null => {
  histogramEdges(edges);
  if (x < edges[0] || x > edges.at(-1)!) return null;
  if (x === edges.at(-1)) return edges.length - 2;
  for (let j = 0; j < edges.length - 1; j++)
    if (x >= edges[j] && x < edges[j + 1]) return j;
  return null;
};

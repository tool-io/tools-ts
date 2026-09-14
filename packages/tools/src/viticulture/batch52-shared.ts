export * from "../fun/batch51-shared.js";
export { referenceInterpolation as lerpTable } from "../neuroscience/batch47-shared.js";
import {
  simpleError,
  bounded,
  positive,
  fraction,
  finite,
  sum,
  aligned,
  unique,
} from "../fun/batch51-shared.js";

/** Real inclusive bounds, unlike bounded(), which checks integer counts. */
export const angle = (
  v: number,
  field: string,
  lo: number,
  hi: number,
): number => {
  if (!Number.isFinite(v) || v < lo || v > hi)
    simpleError(field, `Finite value in [${lo}, ${hi}] required.`);
  return v;
};
export const rgb3 = (v: readonly number[]): void => {
  if (v.length !== 3)
    simpleError("RGB", "Three normalized sRGB coordinates required.");
  v.forEach((x) => fraction(x, "RGB"));
};
export const srgbLinear = (v: number): number =>
  v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
export const srgbEncode = (v: number): number =>
  v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055;
export const hexRgb = (s: string): number[] => {
  if (s.length !== 7 || !/^#[0-9a-fA-F]{6}$(?![\s\S])/.test(s))
    simpleError("hex", "Exactly #RRGGBB sRGB notation.");
  return [1, 3, 5].map((j) => parseInt(s.slice(j, j + 2), 16));
};
export const box = (v: readonly number[]): readonly number[] => {
  if (v.length !== 4 || v[2] < v[0] || v[3] < v[1])
    simpleError("bounds", "Ordered xmin,ymin,xmax,ymax rectangle required.");
  return v;
};
export const stego = (
  s: string,
  mode: "zero" | "white",
  encode: boolean,
): string => {
  if (s.length > 8192) simpleError("text", "At most 8192 actual code units.");
  if (encode) {
    if (!/^(?:[0-9a-fA-F]{2})*$(?![\s\S])/.test(s) || s.length > 256)
      simpleError("payload", "Even-length hex for at most 128 bytes.");
    const bits = (s.match(/../g) ?? [])
      .map((h) => parseInt(h, 16).toString(2).padStart(8, "0"))
      .join("");
    return [...bits]
      .map((b) =>
        mode === "zero"
          ? b === "0"
            ? "\u200b"
            : "\u200c"
          : b === "0"
            ? " "
            : "\t",
      )
      .join(mode === "white" ? "\n" : "");
  }
  if (!s) return "";
  const a = mode === "zero" ? [...s] : s.split("\n"),
    zero = mode === "zero" ? "\u200b" : " ",
    one = mode === "zero" ? "\u200c" : "\t";
  if (a.length % 8 || a.length > 1024 || a.some((c) => c !== zero && c !== one))
    simpleError(
      "encoding",
      "Complete strict bit-byte sequence required; no normalization or surrounding cover text.",
    );
  const bits = a.map((c) => (c === zero ? "0" : "1")).join("");
  return (bits.match(/.{8}/g) ?? [])
    .map((b) => parseInt(b, 2).toString(16).padStart(2, "0"))
    .join("");
};
export const niceInterval = (v: number): number => {
  positive(v, "interval");
  const p = 10 ** Math.floor(Math.log10(v));
  if (p === 0) simpleError("interval", "Subnormal decade unsupported.");
  const u = v / p;
  return finite(p * (u <= 1 ? 1 : u <= 2 ? 2 : u <= 5 ? 5 : 10));
};
export const topo = (
  ids: readonly string[],
  from: readonly number[],
  to: readonly number[],
): Record<string, unknown> => {
  if (!ids.length) simpleError("nodes", "Nonempty explicit node inventory.");
  unique(ids, "nodes");
  if (from.length !== to.length) simpleError("edges", "Matched edge arrays.");
  const edges = Array.from({ length: ids.length }, () => new Set<number>()),
    deg = ids.map(() => 0),
    out: string[] = [];
  from.forEach((a, j) => {
    const b = to[j];
    bounded(a, "from", 0, ids.length - 1);
    bounded(b, "to", 0, ids.length - 1);
    if (!edges[a].has(b)) {
      edges[a].add(b);
      deg[b]++;
    }
  });
  while (out.length < ids.length) {
    const j = deg.findIndex((v) => v === 0);
    if (j < 0)
      simpleError("cycle", "Explicit prerequisite graph must be acyclic.");
    out.push(ids[j]);
    deg[j] = -1;
    edges[j].forEach((b) => deg[b]--);
  }
  return { orderedItemIds: out };
};
export const jenks = (
  x: readonly number[],
  k: number,
): Record<string, unknown> => {
  bounded(x.length, "observations", 1, 128);
  bounded(k, "classes", 1, x.length);
  const a = [...x].sort((a, b) => a - b),
    n = a.length,
    cost = Array.from({ length: n }, () => Array<number>(n).fill(0));
  for (let start = 0; start < n; start++) {
    let m = 0,
      sse = 0;
    for (let end = start; end < n; end++) {
      const count = end - start + 1,
        d = a[end] - m;
      m += d / count;
      sse += d * (a[end] - m);
      cost[start][end] = finite(Math.max(0, sse));
    }
  }
  const dp = Array.from({ length: k + 1 }, () =>
      Array<number>(n + 1).fill(Infinity),
    ),
    prev = Array.from({ length: k + 1 }, () => Array<number>(n + 1).fill(-1));
  dp[0][0] = 0;
  for (let c = 1; c <= k; c++)
    for (let end = c; end <= n; end++)
      for (let start = c - 1; start < end; start++) {
        const v = dp[c - 1][start] + cost[start][end - 1];
        if (v < dp[c][end]) {
          dp[c][end] = v;
          prev[c][end] = start;
        }
      }
  const starts: number[] = [],
    upper: number[] = [];
  let end = n;
  for (let c = k; c > 0; c--) {
    upper.unshift(a[end - 1]);
    const start = prev[c][end];
    starts.unshift(start);
    end = start;
  }
  return {
    upperBounds: upper,
    withinClassSquaredError: finite(dp[k][n]),
    classStartIndices: starts,
  };
};
export const areaBreaks = (
  x: readonly number[],
  area: readonly number[],
  k: number,
): Record<string, unknown> => {
  aligned(x, area, "feature areas");
  bounded(k, "classes", 1, Math.min(128, x.length));
  area.forEach((v) => positive(v, "area"));
  const total = positive(sum(area), "area"),
    order = x.map((_, j) => j).sort((a, b) => x[a] - x[b] || a - b),
    bounds: number[] = [];
  for (let c = 1; c <= k; c++) {
    const target = (total * c) / k;
    let acc = 0,
      j = 0;
    for (; j < order.length - 1; j++) {
      acc += area[order[j]];
      if (acc >= target) break;
    }
    bounds.push(x[order[j]]);
  }
  return { upperBounds: bounds, totalArea: total };
};
export const minecraftXp = (n: number): number =>
  n <= 16
    ? n * n + 6 * n
    : n <= 31
      ? 2.5 * n * n - 40.5 * n + 360
      : 4.5 * n * n - 162.5 * n + 2220;
export const languageTagShape = (s: string): Record<string, unknown> => {
  const grandfathered = new Set(
    "en-gb-oed i-ami i-bnn i-default i-enochian i-hak i-klingon i-lux i-mingo i-navajo i-pwn i-tao i-tay i-tsu sgn-be-fr sgn-be-nl sgn-ch-de art-lojban cel-gaulish no-bok no-nyn zh-guoyu zh-hakka zh-min zh-min-nan zh-xiang".split(
      " ",
    ),
  );
  const syntax = (): boolean => {
    if (s.trim() !== s || /\s/.test(s)) return false;
    const a = s.toLowerCase().split("-");
    if (grandfathered.has(s.toLowerCase())) return true;
    if (a.some((v) => !v || !/^[a-z0-9]{1,8}$(?![\s\S])/.test(v))) return false;
    let j = 0;
    if (a[0] === "x") return a.length > 1;
    if (!/^[a-z]{2,8}$(?![\s\S])/.test(a[j])) return false;
    const short = a[j++].length <= 3;
    if (short)
      for (let k = 0; k < 3 && /^[a-z]{3}$(?![\s\S])/.test(a[j] ?? ""); k++)
        j++;
    if (/^[a-z]{4}$(?![\s\S])/.test(a[j] ?? "")) j++;
    if (/^(?:[a-z]{2}|\d{3})$(?![\s\S])/.test(a[j] ?? "")) j++;
    const variants = new Set<string>(),
      extensions = new Set<string>();
    while (/^(?:[a-z0-9]{5,8}|\d[a-z0-9]{3})$(?![\s\S])/.test(a[j] ?? "")) {
      if (variants.has(a[j])) return false;
      variants.add(a[j++]);
    }
    while (/^[0-9a-wy-z]$(?![\s\S])/.test(a[j] ?? "")) {
      const key = a[j++];
      if (extensions.has(key)) return false;
      extensions.add(key);
      const start = j;
      while (/^[a-z0-9]{2,8}$(?![\s\S])/.test(a[j] ?? "")) j++;
      if (j === start) return false;
    }
    if (a[j] === "x") {
      j++;
      const start = j;
      while (/^[a-z0-9]{1,8}$(?![\s\S])/.test(a[j] ?? "")) j++;
      if (j === start) return false;
    }
    return j === a.length;
  };
  return { wellFormedSyntax: syntax(), registeredSubtagsVerified: false };
};
export const firstStrong = (s: string): string => {
  for (const c of s) {
    if (/[A-Za-z]/.test(c)) return "ltr";
    if (/\p{Letter}/u.test(c)) {
      const n = c.codePointAt(0)!;
      if ((n >= 0x590 && n <= 0x5ff) || (n >= 0x600 && n <= 0x6ff))
        return "rtl";
      return "unsupported";
    }
  }
  return "none";
};
export const manuscriptRoman = (s: string): number => {
  const t = s.toUpperCase().replace(/J$(?![\s\S])/, "I");
  if (
    !/^(M{0,3})(CM|CD|D?C{0,4})(XC|XL|L?X{0,4})(IX|IV|V?I{0,4})$(?![\s\S])/.test(
      t,
    ) ||
    !t
  )
    simpleError(
      "numeral",
      "Bounded conventional subtractive or up-to-four additive Roman groups, final j as i.",
    );
  const values: Record<string, number> = {
    I: 1,
    V: 5,
    X: 10,
    L: 50,
    C: 100,
    D: 500,
    M: 1000,
  };
  return sum(
    [...t].map((c, j) =>
      values[c] < (values[t[j + 1]] ?? 0) ? -values[c] : values[c],
    ),
  );
};
export const legacyFrame = (
  ra: number,
  dec: number,
  inverse: boolean,
): Record<string, unknown> => {
  const m = [
      [0.9999256782, -0.0111820611, -0.0048579477],
      [0.011182061, 0.9999374784, -0.0000271765],
      [0.0048579479, -0.0000271474, 0.9999881997],
    ],
    r = (ra * Math.PI) / 180,
    d = (dec * Math.PI) / 180,
    v = [Math.cos(d) * Math.cos(r), Math.cos(d) * Math.sin(r), Math.sin(d)];
  const out = m.map((row, j) =>
    sum(v.map((x, k) => x * (inverse ? m[k][j] : row[k]))),
  );
  return {
    approximateRightAscensionDegrees:
      ((Math.atan2(out[1], out[0]) * 180) / Math.PI + 360) % 360,
    approximateDeclinationDegrees:
      (Math.atan2(out[2], Math.hypot(out[0], out[1])) * 180) / Math.PI,
    fullFk4Fk5ConversionApplied: false,
  };
};
export const equationOfTime = (day: number): number => {
  const b = (2 * Math.PI * (day - 81)) / 364;
  return 9.87 * Math.sin(2 * b) - 7.53 * Math.cos(b) - 1.5 * Math.sin(b);
};
export const identifier = (s: string): void => {
  if (!/^[A-Za-z][A-Za-z0-9_]{0,31}$(?![\s\S])/.test(s))
    simpleError(
      "identifier",
      "Explicit ASCII identifier of at most 32 characters.",
    );
};
export const atom = (s: string): void => {
  if (!/^[A-Z][A-Z0-9_]{0,31}$(?![\s\S])/.test(s))
    simpleError("atom", "Explicit uppercase propositional atom.");
};
export const literal = (s: string): void =>
  atom(s.startsWith("!") ? s.slice(1) : s);
type Node =
  | { op: "atom"; name: string }
  | { op: "not"; a: Node }
  | { op: "and" | "or"; a: Node; b: Node };
export const cnfCounts = (s: string): Record<string, unknown> => {
  if (s.length > 1024) simpleError("expression", "At most 1024 characters.");
  const tokens = s.match(/[A-Z][A-Z0-9_]*|[!&|()]/g) ?? [];
  if (tokens.join("") !== s.replace(/\s/g, ""))
    simpleError("expression", "Only uppercase atoms and ! & | parentheses.");
  let at = 0,
    depth = 0,
    events = 0;
  const unary = (): Node => {
    if (++depth > 64) simpleError("depth", "At most 64 nested terms.");
    const token = tokens[at++];
    let out: Node;
    if (token === "!") out = { op: "not", a: unary() };
    else if (token === "(") {
      out = disjunction();
      if (tokens[at++] !== ")")
        simpleError("expression", "Missing closing parenthesis.");
    } else {
      atom(token ?? "");
      out = { op: "atom", name: token };
    }
    depth--;
    return out;
  };
  const conjunction = (): Node => {
    let n = unary();
    while (tokens[at] === "&") {
      at++;
      n = { op: "and", a: n, b: unary() };
    }
    return n;
  };
  const disjunction = (): Node => {
    let n = conjunction();
    while (tokens[at] === "|") {
      at++;
      n = { op: "or", a: n, b: conjunction() };
    }
    return n;
  };
  const root = disjunction();
  if (at !== tokens.length)
    simpleError("expression", "Unexpected trailing token.");
  const convert = (n: Node, neg = false): string[][] => {
    if (n.op === "atom") return [[(neg ? "!" : "") + n.name]];
    if (n.op === "not") return convert(n.a, !neg);
    const a = convert(n.a, neg),
      b = convert(n.b, neg),
      and = (n.op === "and") !== neg;
    let out: string[][];
    if (and) out = [...a, ...b];
    else {
      if (a.length > 1 || b.length > 1) events++;
      if (a.length * b.length > 256)
        simpleError("budget", "At most 256 CNF clauses.");
      out = a.flatMap((x) => b.map((y) => [...x, ...y]));
    }
    if (out.length > 256 || sum(out.map((x) => x.length)) > 4096)
      simpleError("budget", "At most 256 clauses/4096 literal occurrences.");
    return out;
  };
  const clauses = convert(root);
  return {
    clauseCount: clauses.length,
    literalCount: sum(clauses.map((x) => x.length)),
    distributionEvents: events,
  };
};

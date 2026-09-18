import * as B from "../css/batch55-shared.js";
import type { ToolExecutionContext } from "../core/definition.js";
import { sourceFor } from "../random/batch42-shared.js";
import { calculateRandomInteger } from "../random/number/tool.js";
import { calculateRandomItem } from "../random/item/tool.js";
export * from "../css/batch55-shared.js";
export const nonnegative = (a: readonly number[]): void =>
  B.check(a.every((x) => x >= 0));
export const histogram = (
  edges: readonly number[],
  mass: readonly number[],
): void => {
  B.histogramEdges(edges);
  B.check(mass.length === edges.length - 1);
  nonnegative(mass);
};
export type Transition = { from: string; symbol: string; to: string };
export const transitions = (s: string): Transition[] =>
  B.records(s).map((v) => ({
    from: B.str(v.from),
    symbol: B.str(v.symbol),
    to: B.str(v.to),
  }));
export const dfa = (
  states: readonly string[],
  alphabet: readonly string[],
  r: readonly Transition[],
): void => {
  B.check(
    states.length > 0 &&
      B.unique(states).length === states.length &&
      B.unique(alphabet).length === alphabet.length,
  );
  r.forEach((v) =>
    B.check(
      states.includes(v.from) &&
        states.includes(v.to) &&
        alphabet.includes(v.symbol),
    ),
  );
  B.check(
    B.duplicates(r, (v) => JSON.stringify([v.from, v.symbol])).length === 0,
  );
};
export const trace = (
  r: readonly Transition[],
  start: string,
  symbols: readonly string[],
): { states: string[]; edges: number[]; undefinedAt: number | null } => {
  B.check(
    B.duplicates(r, (v) => JSON.stringify([v.from, v.symbol])).length === 0,
  );
  const states = [start],
    edges: number[] = [];
  for (let j = 0; j < symbols.length; j++) {
    const k = r.findIndex(
      (v) => v.from === states.at(-1) && v.symbol === symbols[j],
    );
    if (k < 0) return { states, edges, undefinedAt: j };
    edges.push(k);
    states.push(r[k].to);
  }
  return { states, edges, undefinedAt: null };
};
export const reach = (
  r: readonly Transition[],
  initial: readonly string[],
  reverse = false,
): string[] => {
  const seen = new Set(initial),
    q = [...initial];
  for (let j = 0; j < q.length; j++)
    for (const e of r)
      if ((reverse ? e.to : e.from) === q[j]) {
        const next = reverse ? e.from : e.to;
        if (!seen.has(next)) {
          seen.add(next);
          q.push(next);
        }
      }
  B.check(q.length <= 256);
  return q;
};
export const rename = (
  values: readonly string[],
  names: readonly string[],
  replacements: readonly string[],
): string[] => {
  B.check(
    names.length === replacements.length &&
      B.unique(names).length === names.length,
  );
  const result = values.map((v) => {
    const j = names.indexOf(v);
    return j < 0 ? v : replacements[j];
  });
  B.check(
    B.unique(values).length === B.unique(result).length,
    "Renaming must be injective",
  );
  return result;
};
export type Run = { value: string; length: bigint };
export const lengthRuns = (s: string): Run[] =>
  B.records(s).map((v) => {
    const value = B.str(v.value),
      length = B.bigint(B.str(v.length));
    B.check(length > 0n);
    return { value, length };
  });
export const runTotal = (r: readonly Run[]): bigint =>
  r.reduce((s, v) => s + v.length, 0n);
export const runOffsets = (r: readonly Run[]): bigint[] => {
  let offset = 0n;
  return r.map((v) => {
    const start = offset;
    offset += v.length;
    return start;
  });
};
export const runJson = (
  r: readonly Run[],
): { value: string; length: string }[] => {
  B.check(r.length <= 128);
  return r.map((v) => ({ value: v.value, length: String(v.length) }));
};
export const runCompact = (r: readonly Run[]): Run[] => {
  const out: Run[] = [];
  for (const v of r) {
    const p = out.at(-1);
    if (p && p.value === v.value) p.length += v.length;
    else out.push({ ...v });
  }
  return out;
};
export const runSlice = (
  r: readonly Run[],
  start: bigint,
  end: bigint,
): Run[] => {
  B.check(start >= 0n && end >= start && end <= runTotal(r));
  const offsets = runOffsets(r);
  return r.flatMap((v, j) => {
    const lo = start > offsets[j] ? start : offsets[j],
      hi = end < offsets[j] + v.length ? end : offsets[j] + v.length;
    return hi > lo ? [{ value: v.value, length: hi - lo }] : [];
  });
};
export const runPairs = (
  a: readonly Run[],
  b: readonly Run[],
): { start: string; end: string; left: string; right: string }[] => {
  B.check(runTotal(a) === runTotal(b));
  let j = 0,
    k = 0,
    x = 0n,
    y = 0n,
    p = 0n;
  const out: { start: string; end: string; left: string; right: string }[] = [];
  while (j < a.length && k < b.length) {
    const left = a[j].length - x,
      right = b[k].length - y,
      n = left < right ? left : right;
    out.push({
      start: String(p),
      end: String(p + n),
      left: a[j].value,
      right: b[k].value,
    });
    p += n;
    x += n;
    y += n;
    if (x === a[j].length) {
      j++;
      x = 0n;
    }
    if (y === b[k].length) {
      k++;
      y = 0n;
    }
  }
  B.check(out.length <= 255);
  return out;
};
export type Parent = { id: string; parent: string | null };
export const parentRecords = (s: string): Parent[] =>
  B.records(s).map((v) => {
    B.check(v.parent === null || typeof v.parent === "string");
    return { id: B.str(v.id), parent: v.parent as string | null };
  });
export const ancestorChain = (
  r: readonly Parent[],
  id: string,
): { chain: string[]; cycle: string | null; missing: string | null } => {
  const chain: string[] = [];
  let next: string | null = id;
  while (next !== null) {
    if (chain.includes(next)) return { chain, cycle: next, missing: null };
    chain.push(next);
    const p = r.find((v) => v.id === next);
    if (!p) return { chain, cycle: null, missing: next };
    next = p.parent;
  }
  return { chain, cycle: null, missing: null };
};
export const forest = (r: readonly Parent[]): void => {
  B.check(B.unique(r.map((v) => v.id)).length === r.length);
  for (const v of r) {
    const a = ancestorChain(r, v.id);
    B.check(
      a.cycle === null && a.missing === null,
      "Complete acyclic parent forest required",
    );
  }
};
export const descendants = (r: readonly Parent[], id: string): string[] => {
  B.check(r.some((v) => v.id === id));
  return r
    .filter((v) => v.id !== id && ancestorChain(r, v.id).chain.includes(id))
    .map((v) => v.id);
};
export const treeOrder = (r: readonly Parent[], post = false): string[] => {
  forest(r);
  const out: string[] = [];
  const visit = (id: string): void => {
    if (!post) out.push(id);
    for (const v of r) if (v.parent === id) visit(v.id);
    if (post) out.push(id);
  };
  for (const v of r) if (v.parent === null) visit(v.id);
  return out;
};
export type TrieNode = {
  id: number;
  parent: number | null;
  character: string;
  terminal: boolean;
};
export const makeTrie = (words: readonly string[]): TrieNode[] => {
  const r: TrieNode[] = [
    { id: 0, parent: null, character: "", terminal: false },
  ];
  for (const word of words) {
    B.check(word.length <= 127);
    let parent = 0;
    for (const character of word.split("")) {
      let node = r.find(
        (v) => v.parent === parent && v.character === character,
      );
      if (!node) {
        node = { id: r.length, parent, character, terminal: false };
        r.push(node);
        B.check(r.length <= 128);
      }
      parent = node.id;
    }
    r[parent].terminal = true;
  }
  return r;
};
export const trieNodes = (s: string): TrieNode[] => {
  const r = B.records(s).map((v) => {
    B.check(v.parent === null || typeof v.parent === "number");
    B.check(typeof v.terminal === "boolean");
    return {
      id: B.int(B.num(v.id), 0, 127),
      parent: v.parent === null ? null : B.int(B.num(v.parent), 0, 127),
      character: B.str(v.character),
      terminal: v.terminal as boolean,
    };
  });
  B.check(r.length > 0 && B.unique(r.map((v) => v.id)).length === r.length);
  const root = r.filter((v) => v.parent === null);
  B.check(root.length === 1 && root[0].id === 0 && root[0].character === "");
  B.check(
    B.duplicates(
      r.filter((v) => v.parent !== null),
      (v) => JSON.stringify([v.parent, v.character]),
    ).length === 0,
  );
  r.filter((v) => v.parent !== null).forEach((v) =>
    B.check(v.character.length === 1),
  );
  forest(
    r.map((v) => ({
      id: String(v.id),
      parent: v.parent === null ? null : String(v.parent),
    })),
  );
  return r;
};
export const trieWord = (r: readonly TrieNode[], id: number): string => {
  let s = "",
    p = r.find((v) => v.id === id);
  B.check(p);
  while (p!.parent !== null) {
    s = p!.character + s;
    p = r.find((v) => v.id === p!.parent);
  }
  return s;
};
export const trieLookup = (
  r: readonly TrieNode[],
  word: string,
): { node: number | null; matched: number; missing: string | null } => {
  let node = 0;
  for (let j = 0; j < word.length; j++) {
    const p = r.find((v) => v.parent === node && v.character === word[j]);
    if (!p) return { node: null, matched: j, missing: word[j] };
    node = p.id;
  }
  return { node, matched: word.length, missing: null };
};
export const trieCompletions = (
  r: readonly TrieNode[],
  prefix: string,
): { id: number; word: string }[] =>
  r
    .filter((v) => v.terminal)
    .map((v) => ({ id: v.id, word: trieWord(r, v.id) }))
    .filter((v) => v.word.startsWith(prefix));
export const trieCompressed = (
  r: readonly TrieNode[],
): { from: number; to: number; label: string; terminal: boolean }[] => {
  const out: { from: number; to: number; label: string; terminal: boolean }[] =
    [];
  const visit = (id: number): void => {
    for (const child of r.filter((v) => v.parent === id)) {
      let end = child,
        label = end.character;
      while (
        !end.terminal &&
        r.filter((v) => v.parent === end.id).length === 1
      ) {
        end = r.find((v) => v.parent === end.id)!;
        label += end.character;
      }
      out.push({ from: id, to: end.id, label, terminal: end.terminal });
      visit(end.id);
    }
  };
  visit(0);
  return out;
};
export const mask = (m: readonly (readonly number[])[]): void => {
  B.check(
    m.length <= 64 &&
      m.every(
        (r) =>
          r.length < 65 &&
          r.length === (m[0]?.length ?? 0) &&
          r.every((x) => x === 0 || x === 1),
      ),
  );
};
export const stencil = (m: readonly (readonly number[])[]): void => {
  B.check(m.length > 0);
  m.forEach((p) => {
    B.check(p.length === 2);
    p.forEach((x) => B.int(x, -16, 16));
  });
  B.check(B.unique(m.map((v) => JSON.stringify(v))).length === m.length);
};
export const morph = (
  m: readonly (readonly number[])[],
  s: readonly (readonly number[])[],
  erode = false,
): number[][] => {
  mask(m);
  stencil(s);
  return m.map((r, y) =>
    r.map((_, x) =>
      Number(
        erode
          ? s.every(([dy, dx]) => (m[y + dy]?.[x + dx] ?? 0) === 1)
          : s.some(([dy, dx]) => (m[y - dy]?.[x - dx] ?? 0) === 1),
      ),
    ),
  );
};
export const components = (
  m: readonly (readonly number[])[],
  eight: boolean,
  target = 1,
): { labels: number[][]; cells: number[][][] } => {
  mask(m);
  const labels = m.map((r) => r.map(() => 0)),
    cells: number[][][] = [];
  for (let y = 0; y < m.length; y++)
    for (let x = 0; x < m[y].length; x++)
      if (m[y][x] === target && !labels[y][x]) {
        const id = cells.length + 1,
          q = [[y, x]];
        labels[y][x] = id;
        for (let k = 0; k < q.length; k++) {
          const [r, c] = q[k];
          for (let dy = -1; dy <= 1; dy++)
            for (let dx = -1; dx <= 1; dx++)
              if (
                (dy || dx) &&
                (eight || Math.abs(dy) + Math.abs(dx) === 1) &&
                m[r + dy]?.[c + dx] === target &&
                !labels[r + dy][c + dx]
              ) {
                labels[r + dy][c + dx] = id;
                q.push([r + dy, c + dx]);
              }
        }
        cells.push(q);
      }
  return { labels, cells };
};
export type OffsetSpan = { start: number; end: number; offset: number };
export const zoneSpans = (s: string): OffsetSpan[] =>
  B.records(s).map((v) => {
    const start = B.num(v.start),
      end = B.num(v.end),
      offset = B.num(v.offset);
    B.check(
      start < end &&
        Math.abs(start) <= 1e12 &&
        Math.abs(end) <= 1e12 &&
        Math.abs(offset) <= 86400,
    );
    return { start, end, offset };
  });
export const zoneTransitions = (
  s: string,
): { at: number; before: number; after: number }[] =>
  B.records(s).map((v) => {
    const at = B.num(v.at),
      before = B.num(v.before),
      after = B.num(v.after);
    B.check(
      Math.abs(at) <= 1e12 &&
        Math.abs(before) <= 86400 &&
        Math.abs(after) <= 86400,
    );
    return { at, before, after };
  });
export const localCandidates = (
  r: readonly OffsetSpan[],
  local: number,
): { index: number; utc: number; offset: number }[] =>
  r.flatMap((v, index) => {
    const utc = local - v.offset;
    return utc >= v.start && utc < v.end
      ? [{ index, utc, offset: v.offset }]
      : [];
  });
export const ballots = (
  s: string,
  candidates: readonly string[],
  unique = true,
): string[][] => {
  B.check(B.unique(candidates).length === candidates.length);
  return B.arr(s).map((v) => {
    B.check(Array.isArray(v));
    B.dense(v as unknown[]);
    const r = (v as unknown[]).map(B.str);
    B.check(
      r.every((x) => candidates.includes(x)) &&
        (!unique || B.unique(r).length === r.length),
    );
    return r;
  });
};
export const pairwise = (
  r: readonly (readonly string[])[],
  c: readonly string[],
): number[][] =>
  c.map((a) =>
    c.map((b) =>
      a === b
        ? 0
        : r.filter(
            (v) =>
              v.includes(a) && v.includes(b) && v.indexOf(a) < v.indexOf(b),
          ).length,
    ),
  );
export const randomSource = (
  seed: string,
  context?: ToolExecutionContext,
): (() => number) => sourceFor(seed, context);
export const draw = (n: number, source: () => number): number => {
  B.int(n, 1, 1000000);
  const v = calculateRandomItem(
    Array.from({ length: n }, (_, j) => j),
    source,
  );
  B.check(v !== null, "Invalid random source");
  return v!;
};
export const randint = (
  lo: number,
  hi: number,
  source: () => number,
): number => {
  const v = calculateRandomInteger(lo, hi, source);
  B.check(v !== null, "Invalid random source or integer range");
  return v!;
};
export const shuffle = <T>(a: readonly T[], source: () => number): T[] => {
  const r = [...a];
  for (let j = r.length - 1; j > 0; j--) {
    const k = randint(0, j, source);
    [r[j], r[k]] = [r[k], r[j]];
  }
  return r;
};
export const choosePositions = (
  size: number,
  count: number,
  source: () => number,
): number[] => {
  B.int(size, 0, 128);
  B.int(count, 0, size);
  const pool = Array.from({ length: size }, (_, j) => j),
    out: number[] = [];
  for (let j = 0; j < count; j++) {
    const k = randint(j, size - 1, source);
    [pool[j], pool[k]] = [pool[k], pool[j]];
    out.push(pool[j]);
  }
  return out;
};
export const uniqueIds = (a: readonly string[]): void =>
  B.check(B.unique(a).length === a.length);
export const buckets = (s: string): string[][] =>
  B.arr(s).map((v) => {
    B.check(Array.isArray(v));
    B.dense(v as unknown[]);
    return (v as unknown[]).map(B.str);
  });
export const randomBig = (limit: bigint, source: () => number): bigint => {
  B.check(limit > 0n && limit.toString(2).length <= 256);
  if (limit <= BigInt(Number.MAX_SAFE_INTEGER))
    return BigInt(randint(0, Number(limit) - 1, source));
  const width = (limit - 1n).toString(2).length;
  for (let attempt = 0; attempt < 128; attempt++) {
    let v = 0n;
    for (let j = 0; j < width; j++)
      v = (v << 1n) | BigInt(randint(0, 1, source));
    if (v < limit) return v;
  }
  B.check(false, "Bounded entropy rejection budget exhausted");
  return 0n;
};
export const weightedChoice = (
  weights: readonly number[],
  source: () => number,
): number => {
  nonnegative(weights);
  const total = weights.reduce((s, x) => s + x, 0);
  B.check(total > 0 && Number.isFinite(total));
  const sample = source();
  B.check(Number.isFinite(sample) && sample >= 0 && sample < 1);
  let remaining = sample * total;
  for (let j = 0; j < weights.length; j++) {
    if (remaining < weights[j]) return j;
    remaining -= weights[j];
  }
  for (let j = weights.length - 1; j >= 0; j--) if (weights[j] > 0) return j;
  B.check(false, "Positive weighted support required");
  return -1;
};
export const chunkCounts = (
  length: number,
  count: number,
  minimum: number,
  maximum: number,
): { ways: (n: number, k: number) => bigint; total: bigint } => {
  B.int(length, 0, 128);
  B.int(count, 0, 128);
  B.int(minimum, 1, 128);
  B.int(maximum, minimum, 128);
  const memo = new Map<string, bigint>();
  const ways = (n: number, k: number): bigint => {
    if (!k) return n === 0 ? 1n : 0n;
    if (n < k * minimum || n > k * maximum) return 0n;
    const key = n + "," + k;
    if (memo.has(key)) return memo.get(key)!;
    let total = 0n;
    for (let j = minimum; j <= maximum && j <= n; j++)
      total += ways(n - j, k - 1);
    memo.set(key, total);
    return total;
  };
  return { ways, total: ways(length, count) };
};
export const dyckCounts = (
  pairs: number,
): ((opens: number, closes: number) => bigint) => {
  B.int(pairs, 0, 64);
  const memo = new Map<string, bigint>();
  const ways = (a: number, b: number): bigint => {
    if (a === pairs && b === pairs) return 1n;
    if (a > pairs || b > a) return 0n;
    const k = a + "," + b;
    if (memo.has(k)) return memo.get(k)!;
    const n = (a < pairs ? ways(a + 1, b) : 0n) + (b < a ? ways(a, b + 1) : 0n);
    memo.set(k, n);
    return n;
  };
  return ways;
};
export const gridOrbits = (
  height: number,
  width: number,
  quarter: boolean,
): number[][][] => {
  B.int(height, 1, 11);
  B.int(width, 1, 11);
  B.check(!quarter || height === width);
  const seen = new Set<string>(),
    out: number[][][] = [];
  for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++) {
      if (seen.has(y + "," + x)) continue;
      const orbit: number[][] = [],
        q = [[y, x]];
      for (let j = 0; j < q.length; j++) {
        const [r, c] = q[j],
          k = r + "," + c;
        if (seen.has(k)) continue;
        seen.add(k);
        orbit.push([r, c]);
        const next = quarter ? [c, width - 1 - r] : [r, width - 1 - c];
        if (!seen.has(next.join(","))) q.push(next);
      }
      out.push(orbit);
    }
  return out;
};

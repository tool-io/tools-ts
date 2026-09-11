export * from "../psychology/batch49-shared.js";
import {
  simpleError,
  positive,
  nonnegative,
  aligned,
  shape,
  finite,
  sum,
} from "../psychology/batch49-shared.js";
export const bandRatio = (
  f: readonly number[],
  p: readonly number[],
  w: number,
  lo: number,
  hi: number,
  a: number,
  b: number,
): number => {
  aligned(f, p, "PSD");
  positive(w, "width");
  f.forEach((v, i) => {
    nonnegative(v, "frequency");
    nonnegative(p[i], "PSD");
    if (
      i &&
      (v <= f[i - 1] || Math.abs(v - f[i - 1] - w) > 1e-9 * Math.max(1, w))
    )
      simpleError("bins", "Actualuniformorderedcenters,widthmatching.");
  });
  const power = (l: number, h: number) =>
    sum(p.map((v, i) => (f[i] >= l && f[i] < h ? v * w : 0)));
  return finite(power(lo, hi) / positive(power(a, b), "denominatorpower"));
};
export const fractionalFall = (
  t: readonly number[],
  v: readonly number[],
  peak: number,
  base: number,
): number => {
  aligned(t, v, "trace");
  positive(peak - base, "amplitude");
  if (
    t.length < 2 ||
    t.some((x, i) => i > 0 && (x <= t[i - 1] || v[i] >= v[i - 1]))
  )
    simpleError("trace", "Increasingtime,strictlydecreasingactualbranch.");
  const at = (target: number) => {
    if (target > v[0] || target < v.at(-1)!)
      simpleError("trace", "Actualbracketedfalltarget,noextrapolation.");
    const k = v.findIndex((x) => x <= target);
    if (v[k] === target) return t[k];
    return (
      t[k - 1] + ((target - v[k - 1]) / (v[k] - v[k - 1])) * (t[k] - t[k - 1])
    );
  };
  return finite(
    at(base + 0.1 * (peak - base)) - at(base + 0.9 * (peak - base)),
  );
};
export const betweenness = (a: readonly (readonly number[])[]): number[] => {
  const n = shape(a, "adjacency");
  if (a.length !== n || n > 64) simpleError("adjacency", "Square≤64nodes.");
  a.forEach((r, i) =>
    r.forEach((v, j) => {
      if ((v !== 0 && v !== 1) || v !== a[j][i] || (i === j && v !== 0))
        simpleError("adjacency", "Binarysymmetriczerodiagonal.");
    }),
  );
  const out = Array(n).fill(0) as number[];
  for (let s = 0; s < n; s++) {
    const queue = [s],
      stack: number[] = [],
      pred = Array.from({ length: n }, () => [] as number[]),
      dist = Array(n).fill(-1) as number[],
      paths = Array(n).fill(0) as number[],
      delta = Array(n).fill(0) as number[];
    dist[s] = 0;
    paths[s] = 1;
    for (let q = 0; q < queue.length; q++) {
      const v = queue[q];
      stack.push(v);
      for (let w = 0; w < n; w++)
        if (a[v][w]) {
          if (dist[w] < 0) {
            queue.push(w);
            dist[w] = dist[v] + 1;
          }
          if (dist[w] === dist[v] + 1) {
            paths[w] += paths[v];
            pred[w].push(v);
          }
        }
    }
    for (const w of stack.reverse()) {
      for (const v of pred[w])
        delta[v] += (paths[v] / paths[w]) * (1 + delta[w]);
      if (w !== s) out[w] += delta[w];
    }
  }
  return out.map((v) => finite(v / 2));
};

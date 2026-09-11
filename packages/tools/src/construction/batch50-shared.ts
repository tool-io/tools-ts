export * from "../psychology/batch49-shared.js";
import {
  simpleError,
  positive,
  nonnegative,
  bounded,
  finite,
  money,
  roundMinor,
  aligned,
  sum,
} from "../psychology/batch49-shared.js";
export const powFinite = (a: number, b: number): number => finite(a ** b);
export const npvScope = (cash: readonly number[], rate: number): number => {
  if (!cash.length || rate <= -1)
    simpleError("cashflows", "Actual cash flows with discount rate>-1.");
  return finite(sum(cash.map((v, i) => v / (1 + rate) ** i)));
};
export const irrScope = (
  cash: readonly number[],
  low: number,
  high: number,
): number => {
  if (
    cash.length < 2 ||
    cash[0] >= 0 ||
    cash.slice(1).some((v) => v < 0) ||
    !cash.slice(1).some((v) => v > 0) ||
    low <= -1 ||
    high <= low
  )
    simpleError(
      "IRR",
      "Conventional negative initial/nonnegative future flows, actual ordered bracket>-1.",
    );
  let a = low,
    b = high;
  const fa = npvScope(cash, a),
    fb = npvScope(cash, b);
  if (fa === 0) return a;
  if (fb === 0) return b;
  if (fa * fb > 0)
    simpleError("bracket", "ActualfiniteNPVsign-changingbracket.");
  for (let i = 0; i < 100; i++) {
    const m = (a + b) / 2,
      f = npvScope(cash, m);
    if (f === 0) return m;
    if (f > 0) a = m;
    else b = m;
  }
  return (a + b) / 2;
};
export const splitMinor = (
  amount: number,
  weights: readonly number[],
): number[] => {
  money(amount, "amount");
  if (!weights.length) simpleError("weights", "Actual nonempty shares.");
  weights.forEach((v) => bounded(v, "weight", 0, 1000000));
  const t = BigInt(positive(sum(weights), "totalweight")),
    n = BigInt(amount),
    a = weights.map((w) => (n * BigInt(w)) / t),
    order = weights
      .map((_, i) => i)
      .sort((i, j) => {
        const x = (n * BigInt(weights[i])) % t,
          y = (n * BigInt(weights[j])) % t;
        return x === y ? i - j : x > y ? -1 : 1;
      });
  let left = n - a.reduce((x, y) => x + y, 0n);
  for (const i of order) {
    if (!left) break;
    a[i]++;
    left--;
  }
  return a.map((v) => {
    const x = Number(v);
    money(x, "share");
    return x;
  });
};
export const graphDistances = (
  a: readonly (readonly number[])[],
): number[][] => {
  const n = a.length;
  if (
    !n ||
    n > 64 ||
    a.some((r) => r.length !== n) ||
    a.some(
      (r, i) =>
        r.length !== n ||
        r.some(
          (v, j) =>
            (v !== 0 && v !== 1) || v !== a[j][i] || (i === j && v !== 0),
        ),
    )
  )
    simpleError(
      "adjacency",
      "Actualbinaryundirectedsquarezerodiagonal≤64nodes.",
    );
  return a.map((_, s) => {
    const d = Array(n).fill(-1) as number[],
      q = [s];
    d[s] = 0;
    for (let k = 0; k < q.length; k++)
      for (let j = 0; j < n; j++)
        if (a[q[k]][j] && d[j] < 0) {
          d[j] = d[q[k]] + 1;
          q.push(j);
        }
    return d;
  });
};

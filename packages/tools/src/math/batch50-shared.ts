export * from "../construction/batch50-shared.js";
export {
  primes,
  prime,
  properDivisors,
  aliquot,
  factorial,
  choose,
  inverseMod,
  integer,
} from "./batch-arithmetic.js";
export { simpson } from "./batch-shared.js";
export {
  erf,
  erfc,
  gamma,
  logGamma,
  besselJ0,
  hypergeometric,
  gammaRatios,
} from "./batch-special.js";
import {
  bounded,
  simpleError,
  positive,
  finite,
  aligned,
  sum,
} from "../construction/batch50-shared.js";
import { primes, prime, choose, aliquot } from "./batch-arithmetic.js";
import { simpson } from "./batch-shared.js";
import { besselJ0 } from "./batch-special.js";
export const subfactorial = (n: number): string => {
  bounded(n, "n", 0, 1000);
  let a = 1n,
    b = 0n;
  if (n === 0) return "1";
  for (let i = 2; i <= n; i++) [a, b] = [b, BigInt(i - 1) * (a + b)];
  return b.toString();
};
export const cauchy = (x: readonly number[], y: readonly number[]): number => {
  if (x.length !== 2 || y.length !== 2)
    simpleError("nodes", "Actual two x/two ynodes.");
  if (x.some((a) => y.some((b) => a + b === 0)))
    simpleError("nodes", "Nonzerox_i+y_j.");
  return finite(
    ((x[1] - x[0]) * (y[1] - y[0])) /
      ((x[0] + y[0]) * (x[0] + y[1]) * (x[1] + y[0]) * (x[1] + y[1])),
  );
};
export const pascalDet = (n: number): string => {
  bounded(n, "size", 1, 64);
  return "1";
};
export const modPow = (a: bigint, e: bigint, m: bigint): bigint => {
  let x = ((a % m) + m) % m,
    out = 1n;
  while (e) {
    if (e % 2n) out = (out * x) % m;
    x = (x * x) % m;
    e /= 2n;
  }
  return out;
};
export const exactDecimal = (s: string): bigint => {
  if (!/^(0|[1-9][0-9]{0,127})$/.test(s))
    simpleError("integer", "Actualcanonical0–128digitdecimalinteger.");
  return BigInt(s);
};
export const bigCollatz = (s: string, steps: number): string => {
  let n = exactDecimal(s);
  if (n === 0n) simpleError("integer", "Positiveactualstart.");
  bounded(steps, "steps", 1, 100000);
  let max = n;
  for (let i = 0; i <= steps; i++) {
    if (n === 1n) return max.toString();
    if (i === steps) break;
    n = n % 2n ? 3n * n + 1n : n / 2n;
    if (n > max) max = n;
  }
  return simpleError(
    "steps",
    "Declared budget exhausted, no globalCollatzterminationclaim.",
  );
};
export const tauCoefficient = (n: number): bigint => {
  bounded(n, "n", 1, 64);
  const c = Array(n).fill(0n) as bigint[];
  c[0] = 1n;
  for (let k = 1; k < n; k++) {
    const a = [...c];
    c.fill(0n);
    for (let i = 0; i < n; i++)
      for (let j = 0; j <= 24 && i + j * k < n; j++)
        c[i + j * k] += a[i] * choose(24, j) * (j % 2 ? -1n : 1n);
  }
  return c[n - 1];
};
const conv = (
  a: readonly bigint[],
  b: readonly bigint[],
  n: number,
): bigint[] =>
  Array.from({ length: n }, (_, i) =>
    a.slice(0, i + 1).reduce((s, v, j) => s + v * (b[i - j] ?? 0n), 0n),
  );
export const modularJ = (index: number): string => {
  bounded(index, "index", 0, 12);
  const n = index + 2,
    e = Array(n).fill(0n) as bigint[];
  e[0] = 1n;
  for (let i = 1; i < n; i++) {
    let sigma = 0n;
    for (let d = 1; d <= i; d++) if (i % d === 0) sigma += BigInt(d) ** 3n;
    e[i] = 240n * sigma;
  }
  const e3 = conv(conv(e, e, n), e, n),
    p = Array.from({ length: n }, (_, i) => tauCoefficient(i + 1)),
    j = Array(n).fill(0n) as bigint[];
  for (let i = 0; i < n; i++)
    j[i] =
      e3[i] - p.slice(1, i + 1).reduce((s, v, k) => s + v * j[i - k - 1], 0n);
  return j[index + 1].toString();
};
export const airy = (x: number, bi: boolean, derivative = false): number => {
  if (Math.abs(x) > 4) simpleError("x", "BoundedAiryseries |x|≤4.");
  const c = Array(160).fill(0) as number[];
  c[0] = bi ? 0.6149266274460007 : 0.3550280538878172;
  c[1] = bi ? 0.4482883573538264 : -0.2588194037928068;
  for (let n = 0; n < 157; n++) c[n + 3] = c[n] / ((n + 3) * (n + 2));
  let y = 0;
  for (let n = 159; n >= 0; n--)
    y = y * x + (derivative ? (n + 1) * (c[n + 1] ?? 0) : c[n]);
  return finite(y);
};
export const besselY0 = (x: number): number => {
  positive(x, "x");
  if (x > 12) simpleError("x", "Real Y0series branch0<x≤12.");
  let t = 1,
    h = 0,
    s = 0;
  for (let k = 1; k <= 100; k++) {
    t *= (-x * x) / (4 * k * k);
    h += 1 / k;
    s += h * t;
  }
  return finite(
    (2 / Math.PI) * ((Math.log(x / 2) + 0.5772156649015329) * besselJ0(x) - s),
  );
};
export const hankel = (x: number): { real: number; imaginary: number } => ({
  real: besselJ0(x),
  imaginary: besselY0(x),
});
export const ellipticJacobi = (
  u: number,
  m: number,
): { sn: number; cn: number; dn: number } => {
  if (m < 0 || m > 0.9) simpleError("m", "Realparameter0≤m≤.9.");
  const f = (t: number) => 1 / Math.sqrt(1 - m * Math.sin(t) ** 2),
    k = simpson(f, 0, Math.PI / 2, 512);
  if (Math.abs(u) > k)
    simpleError("u", "Declared first quarter |u|≤K(m), no extension.");
  let a = 0,
    b = Math.PI / 2;
  for (let i = 0; i < 60; i++) {
    const p = (a + b) / 2;
    if (simpson(f, 0, p, 512) < Math.abs(u)) a = p;
    else b = p;
  }
  const t = (a + b) / 2,
    s = Math.sign(u) * Math.sin(t);
  return { sn: s, cn: Math.cos(t), dn: Math.sqrt(1 - m * s * s) };
};
type Complex = readonly [number, number];
const mul = (a: Complex, b: Complex): [number, number] => [
    a[0] * b[0] - a[1] * b[1],
    a[0] * b[1] + a[1] * b[0],
  ],
  plus = (a: Complex, b: Complex): [number, number] => [
    a[0] + b[0],
    a[1] + b[1],
  ],
  neg = (a: Complex): [number, number] => [-a[0], -a[1]],
  inv = (a: Complex): [number, number] => {
    const d = positive(a[0] * a[0] + a[1] * a[1], "nonpole");
    return [a[0] / d, -a[1] / d];
  },
  exp = (a: Complex): [number, number] => {
    const r = Math.exp(a[0]);
    return [r * Math.cos(a[1]), r * Math.sin(a[1])];
  };
export const latticeSum = (
  z: readonly number[],
  periods: readonly (readonly number[])[],
  cutoff: number,
  mode: "p" | "zeta" | "sigma",
): { real: number; imaginary: number } => {
  if (
    z.length !== 2 ||
    periods.length !== 2 ||
    periods.some((v) => v.length !== 2)
  )
    simpleError("lattice", "Actualcomplexzandtwoindependentcomplexperiods.");
  bounded(cutoff, "cutoff", 0, 10);
  const [a, b] = periods;
  if (a[0] * b[1] - a[1] * b[0] === 0)
    simpleError("periods", "Real-linearlyindependentperiods.");
  const q: [number, number] = [z[0], z[1]],
    iz: [number, number] = mode === "sigma" ? [0, 0] : inv(q);
  let out: [number, number] =
    mode === "p" ? mul(iz, iz) : mode === "zeta" ? iz : q;
  for (let i = -cutoff; i <= cutoff; i++)
    for (let j = -cutoff; j <= cutoff; j++) {
      if (!i && !j) continue;
      const w: [number, number] = [i * a[0] + j * b[0], i * a[1] + j * b[1]],
        iw = inv(w);
      if (mode === "p") {
        const diff = inv(plus(q, neg(w)));
        out = plus(out, plus(mul(diff, diff), neg(mul(iw, iw))));
      } else if (mode === "zeta") {
        const diff = inv(plus(q, neg(w)));
        out = plus(out, plus(plus(diff, iw), mul(q, mul(iw, iw))));
      } else {
        const t = mul(q, iw),
          t2 = mul(t, t),
          ex = exp(plus(t, [t2[0] / 2, t2[1] / 2]));
        out = mul(out, mul(plus([1, 0], neg(t)), ex));
      }
    }
  return { real: finite(out[0]), imaginary: finite(out[1]) };
};
export const phiSum = (n: number): string => {
  bounded(n, "limit", 0, 1000000);
  const a = Array.from({ length: n + 1 }, (_, i) => i);
  for (let p = 2; p <= n; p++)
    if (a[p] === p) for (let k = p; k <= n; k += p) a[k] -= a[k] / p;
  return a
    .slice(1)
    .reduce((s, v) => s + BigInt(v), 0n)
    .toString();
};
export const smoothCount = (
  limit: number,
  bound: number,
  smooth: boolean,
): number => {
  bounded(limit, "limit", 1, 100000);
  bounded(bound, "bound", 2, 100000);
  const ps = primes(limit),
    largest = new Uint32Array(limit + 1),
    smallest = new Uint32Array(limit + 1);
  for (const p of ps)
    for (let k = p; k <= limit; k += p) {
      largest[k] = p;
      if (!smallest[k]) smallest[k] = p;
    }
  let n = 1;
  for (let k = 2; k <= limit; k++)
    if (smooth ? largest[k] <= bound : smallest[k] >= bound) n++;
  return n;
};
export const rationalApprox = (
  x: number,
  n: number,
): { numerator: number; denominator: number; absoluteError: number } => {
  bounded(n, "budget", 1, 10000);
  if (Math.abs(x) > 1e8)
    simpleError("x", "Representable bounded approximation |x|≤1e8.");
  let p = 0,
    q = 1,
    error = Infinity;
  for (let d = 1; d <= n; d++) {
    const a = Math.round(x * d),
      e = Math.abs(x - a / d);
    if (e < error) {
      p = a;
      q = d;
      error = e;
    }
  }
  return { numerator: p, denominator: q, absoluteError: error };
};
export const sigmaDigital = (
  s: string,
  power: number,
  mode: "power" | "hyper" | "super",
): string => {
  const n = exactDecimal(s);
  bounded(power, "power", 1, 128);
  const f = (d: number): bigint => {
    if (mode === "power") return BigInt(d) ** BigInt(power);
    let v = 1n,
      fact = 1n;
    for (let k = 1; k <= d; k++) {
      fact *= BigInt(k);
      v *= mode === "hyper" ? BigInt(k) ** BigInt(k) : fact;
    }
    return v;
  };
  return s
    .split("")
    .reduce((sum, c) => sum + f(Number(c)), 0n)
    .toString();
};

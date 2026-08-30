import { simpleError } from "../core/simple.js";
import { integer, bounded } from "./batch-arithmetic.js";
type Q = readonly [bigint, bigint];
const gcd = (a: bigint, b: bigint): bigint => {
  a = a < 0n ? -a : a;
  b = b < 0n ? -b : b;
  while (b) [a, b] = [b, a % b];
  return a;
};
const q = (a: bigint, b = 1n): Q => {
  if (b === 0n)
    return simpleError("polynomial", "Division by zero coefficient.");
  if (b < 0n) {
    a = -a;
    b = -b;
  }
  const g = gcd(a, b);
  const r: [bigint, bigint] = [a / g, b / g];
  if (r.some((v) => v.toString().length > 4096))
    simpleError(
      "polynomial",
      "Exact rational coefficient exceeds bounded 4096-digit budget.",
    );
  return r;
};
const add = (a: Q, b: Q): Q => q(a[0] * b[1] + b[0] * a[1], a[1] * b[1]),
  neg = (a: Q): Q => [-a[0], a[1]],
  mul = (a: Q, b: Q): Q => q(a[0] * b[0], a[1] * b[1]),
  div = (a: Q, b: Q): Q => q(a[0] * b[1], a[1] * b[0]);
const zero: Q = [0n, 1n],
  one: Q = [1n, 1n];
const trim = (p: readonly Q[]): Q[] => {
  const r = [...p];
  while (r.length > 1 && r.at(-1)![0] === 0n) r.pop();
  return r.length ? r : [zero];
};
const isZero = (p: readonly Q[]): boolean => p.every((v) => v[0] === 0n);
export const polyCoefficients = (
  p: readonly number[],
  field = "coefficients",
): Q[] => {
  if (!p.length || p.length > 13)
    return simpleError(
      field,
      "Constant-first integer coefficients of degree at most 12 required.",
    );
  p.forEach((v) => integer(v, field));
  return trim(p.map((v) => q(BigInt(v))));
};
export const fractionString = (x: Q): string =>
  x[1] === 1n ? x[0].toString() : `${x[0]}/${x[1]}`;
export const polyString = (p: readonly Q[]): string[] =>
  trim(p).map(fractionString);
const scale = (p: readonly Q[], v: Q): Q[] => trim(p.map((x) => mul(x, v)));
const plus = (a: readonly Q[], b: readonly Q[]): Q[] =>
  trim(
    Array.from({ length: Math.max(a.length, b.length) }, (_, i) =>
      add(a[i] ?? zero, b[i] ?? zero),
    ),
  );
const product = (a: readonly Q[], b: readonly Q[]): Q[] => {
  const r: Q[] = Array(a.length + b.length - 1).fill(zero);
  a.forEach((x, i) =>
    b.forEach((y, j) => (r[i + j] = add(r[i + j], mul(x, y)))),
  );
  return trim(r);
};
const divide = (a: readonly Q[], b: readonly Q[]): [Q[], Q[]] => {
  if (isZero(b)) return simpleError("divisor", "Nonzero polynomial required.");
  let r = trim(a);
  const quotient: Q[] = Array(Math.max(1, a.length - b.length + 1)).fill(zero);
  for (let k = a.length - b.length; k >= 0; k--) {
    const v = div(r[k + b.length - 1] ?? zero, b.at(-1)!);
    quotient[k] = v;
    const next = [...r];
    for (let j = 0; j < b.length; j++)
      next[k + j] = add(next[k + j] ?? zero, neg(mul(v, b[j])));
    r = trim(next);
  }
  return [trim(quotient), r];
};
const monic = (p: readonly Q[]): Q[] =>
  isZero(p) ? [zero] : scale(p, div(one, p.at(-1)!));
export const polyGcd = (a: readonly Q[], b: readonly Q[]): Q[] => {
  let x = trim(a),
    y = trim(b);
  while (!isZero(y)) [x, y] = [y, divide(x, y)[1]];
  return monic(x);
};
export const polyLcm = (a: readonly Q[], b: readonly Q[]): Q[] =>
  isZero(a) || isZero(b)
    ? [zero]
    : monic(product(divide(a, polyGcd(a, b))[0], b));
export const polyExtended = (
  a: readonly Q[],
  b: readonly Q[],
): { gcd: Q[]; u: Q[]; v: Q[] } => {
  if (isZero(a) && isZero(b)) return { gcd: [zero], u: [zero], v: [zero] };
  let r = trim(a),
    s = trim(b),
    u: Q[] = [one],
    v: Q[] = [zero],
    x: Q[] = [zero],
    y: Q[] = [one];
  while (!isZero(s)) {
    const [quo, rem] = divide(r, s);
    [r, s] = [s, rem];
    [u, x] = [x, plus(u, scale(product(quo, x), q(-1n)))];
    [v, y] = [y, plus(v, scale(product(quo, y), q(-1n)))];
  }
  const factor = div(one, r.at(-1)!);
  return { gcd: scale(r, factor), u: scale(u, factor), v: scale(v, factor) };
};
const determinant = (a: readonly (readonly bigint[])[]): bigint => {
  const n = a.length;
  if (n === 0) return 1n;
  const m = a.map((r) => [...r]);
  let prev = 1n,
    sign = 1n;
  for (let k = 0; k < n - 1; k++) {
    let pivot = k;
    while (pivot < n && m[pivot][k] === 0n) pivot++;
    if (pivot === n) return 0n;
    if (pivot !== k) {
      [m[pivot], m[k]] = [m[k], m[pivot]];
      sign = -sign;
    }
    const p = m[k][k];
    for (let i = k + 1; i < n; i++) {
      for (let j = k + 1; j < n; j++)
        m[i][j] = (m[i][j] * p - m[i][k] * m[k][j]) / prev;
      m[i][k] = 0n;
    }
    prev = p;
  }
  return sign * m[n - 1][n - 1];
};
export const resultant = (a: readonly Q[], b: readonly Q[]): bigint => {
  if (a.some((v) => v[1] !== 1n) || b.some((v) => v[1] !== 1n))
    return simpleError(
      "coefficients",
      "Integer resultant coefficients required.",
    );
  if (isZero(a) || isZero(b)) return 0n;
  const m = a.length - 1,
    n = b.length - 1,
    size = m + n;
  if (size === 0) return 1n;
  const ar = [...a].reverse().map((v) => v[0]),
    br = [...b].reverse().map((v) => v[0]),
    matrix = Array.from({ length: size }, () => Array<bigint>(size).fill(0n));
  for (let i = 0; i < n; i++) ar.forEach((v, j) => (matrix[i][i + j] = v));
  for (let i = 0; i < m; i++) br.forEach((v, j) => (matrix[n + i][i + j] = v));
  return determinant(matrix);
};
export const discriminant = (p: readonly Q[]): bigint => {
  const n = p.length - 1;
  if (n < 1)
    return simpleError("coefficients", "Nonconstant polynomial required.");
  const derivative = p.slice(1).map((v, i) => mul(v, q(BigInt(i + 1))));
  return (
    ((((n * (n - 1)) / 2) % 2 ? -1n : 1n) * resultant(p, derivative)) /
    p.at(-1)![0]
  );
};
export const polyEval = (coeffs: readonly number[], x: number): number =>
  coeffs.reduceRight((s, v) => s * x + v, 0);
export const pade = (
  series: readonly number[],
  m: number,
  n: number,
): { numerator: number[]; denominator: number[] } => {
  bounded(m, "numeratorDegree", 0, 12);
  bounded(n, "denominatorDegree", 0, 12);
  if (series.length !== m + n + 1)
    return simpleError(
      "series",
      "Exactly m+n+1 coefficients from order zero required.",
    );
  const a = Array.from({ length: n }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) =>
      j === n ? -(series[m + 1 + i] ?? 0) : (series[m + 1 + i - j - 1] ?? 0),
    ),
  );
  for (let k = 0; k < n; k++) {
    let p = k;
    for (let i = k + 1; i < n; i++)
      if (Math.abs(a[i][k]) > Math.abs(a[p][k])) p = i;
    const scale = Math.max(...a[p].slice(0, n).map(Math.abs));
    if (scale === 0 || Math.abs(a[p][k]) < 1e-12 * scale)
      return simpleError(
        "series",
        "Padé system singular or numerically unresolved; no unique approximant.",
      );
    [a[k], a[p]] = [a[p], a[k]];
    const d = a[k][k];
    for (let j = k; j <= n; j++) a[k][j] /= d;
    for (let i = 0; i < n; i++)
      if (i !== k) {
        const f = a[i][k];
        for (let j = k; j <= n; j++) a[i][j] -= f * a[k][j];
      }
  }
  const den = [1, ...a.map((r) => r[n])],
    num = Array.from({ length: m + 1 }, (_, k) =>
      den.reduce((s, v, j) => s + (j <= k ? v * series[k - j] : 0), 0),
    );
  return { numerator: num, denominator: den };
};
export const partialFractions = (
  numerator: readonly number[],
  poles: readonly number[],
): number[] => {
  if (
    !poles.length ||
    poles.length > 32 ||
    numerator.length >= poles.length + 1 ||
    !numerator.length
  )
    return simpleError(
      "poles",
      "Strictly proper numerator and at most 32 distinct supplied simple real poles required; denominator is monic product (x-pole).",
    );
  poles.forEach((x, i) => {
    if (
      poles.some(
        (y, j) =>
          j !== i &&
          Math.abs(x - y) <= 1e-12 * Math.max(1, Math.abs(x), Math.abs(y)),
      )
    )
      simpleError("poles", "Distinct well-separated supplied poles required.");
  });
  return poles.map(
    (x, i) =>
      polyEval(numerator, x) /
      poles.reduce((v, y, j) => (j === i ? v : v * (x - y)), 1),
  );
};

import { simpleError } from "../core/simple.js";
import { count } from "../neuroscience/shared.js";
export const bounded = (
  v: number,
  field: string,
  min: number,
  max: number,
): number => {
  count(v, field, min);
  if (v > max) simpleError(field, `Integer must be within ${min}–${max}.`);
  return v;
};
export const integer = (v: number, field: string, max = 1000000): number => {
  if (!Number.isSafeInteger(v) || Math.abs(v) > max)
    simpleError(
      field,
      `Signed safe integer with absolute value at most ${max} required.`,
    );
  return v;
};
export const primes = (limit: number): number[] => {
  bounded(limit, "limit", 0, 1000000);
  const composite = new Uint8Array(limit + 1);
  for (let p = 2; p * p <= limit; p++)
    if (!composite[p]) for (let k = p * p; k <= limit; k += p) composite[k] = 1;
  const result: number[] = [];
  for (let p = 2; p <= limit; p++) if (!composite[p]) result.push(p);
  return result;
};
export const prime = (n: number): boolean => {
  integer(n, "n", 1000000000);
  if (n < 2) return false;
  if (n % 2 === 0) return n === 2;
  for (let d = 3; d * d <= n; d += 2) if (n % d === 0) return false;
  return true;
};
export const properDivisors = (n: number): number[] => {
  bounded(n, "n", 1, 1000000);
  if (n === 1) return [];
  const out = [1];
  for (let d = 2; d * d <= n; d++)
    if (n % d === 0) {
      out.push(d);
      if (d * d !== n) out.push(n / d);
    }
  return out.sort((a, b) => a - b);
};
export const aliquot = (n: number): number =>
  properDivisors(n).reduce((a, b) => a + b, 0);
export const factorial = (n: number): bigint => {
  bounded(n, "n", 0, 2000);
  let f = 1n;
  for (let i = 2; i <= n; i++) f *= BigInt(i);
  return f;
};
export const choose = (n: number, k: number): bigint => {
  bounded(n, "n", 0, 2000);
  bounded(k, "k", 0, n);
  let v = 1n;
  for (let j = 1; j <= Math.min(k, n - k); j++)
    v = (v * BigInt(n - j + 1)) / BigInt(j);
  return v;
};
export const fibMod = (n: bigint, m: bigint): bigint => {
  const pair = (k: bigint): [bigint, bigint] => {
    if (k === 0n) return [0n, 1n];
    const [a, b] = pair(k / 2n),
      c = (a * ((2n * b - a + m) % m)) % m,
      d = (a * a + b * b) % m;
    return k % 2n ? [d, (c + d) % m] : [c, d];
  };
  return pair(n)[0];
};
export const inverseMod = (a: number, m: number): number => {
  integer(a, "a");
  bounded(m, "modulus", 2, 10000);
  let x = ((a % m) + m) % m,
    b = m,
    u = 1,
    v = 0;
  while (b) {
    const q = Math.floor(x / b);
    [x, b] = [b, x - q * b];
    [u, v] = [v, u - q * v];
  }
  if (x !== 1)
    return simpleError(
      "a",
      "Residue must be invertible modulo declared modulus.",
    );
  return ((u % m) + m) % m;
};
export const jumps = (limit: number): { ps: number[]; gaps: number[] } => {
  const ps = primes(limit);
  return { ps, gaps: ps.slice(1).map((p, i) => p - ps[i]) };
};

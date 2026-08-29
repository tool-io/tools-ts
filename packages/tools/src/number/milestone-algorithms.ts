import { simpleError } from "../core/simple.js";

export const gcd = (a: bigint, b: bigint): bigint => {
  while (b !== 0n) [a, b] = [b, a % b];
  return a < 0n ? -a : a;
};

export const egyptianFraction = (
  numerator: number,
  denominator: number,
): string[] => {
  if (numerator < 1 || denominator < 1)
    simpleError("numerator", "Use positive numerator and denominator.");
  let n = BigInt(numerator);
  let d = BigInt(denominator);
  const whole = n / d;
  n %= d;
  const result: string[] = whole > 0n ? [whole.toString()] : [];
  for (let i = 0; n > 0n && i < 100; i += 1) {
    const unit = (d + n - 1n) / n;
    result.push(`1/${unit}`);
    n = n * unit - d;
    d *= unit;
    if (n > 0n) {
      const divisor = gcd(n, d);
      n /= divisor;
      d /= divisor;
    }
  }
  if (n > 0n)
    simpleError(
      "numerator",
      "Expansion exceeds the 100-term limit.",
      "resource_limit",
    );
  return result;
};

export const continuedFraction = (
  numerator: number,
  denominator: number,
): number[] => {
  if (denominator === 0)
    simpleError("denominator", "Denominator cannot be zero.");
  let a = BigInt(numerator);
  let b = BigInt(denominator);
  if (b < 0n) {
    a = -a;
    b = -b;
  }
  const result: number[] = [];
  while (b !== 0n) {
    let q = a / b;
    let r = a % b;
    if (r < 0n) {
      q -= 1n;
      r += b;
    }
    result.push(Number(q));
    a = b;
    b = r;
  }
  return result;
};

export const modularPower = (
  base: number,
  exponent: number,
  modulus: number,
): number => {
  if (modulus < 1 || exponent < 0)
    simpleError("modulus", "Use positive modulus and nonnegative exponent.");
  let b =
    ((BigInt(base) % BigInt(modulus)) + BigInt(modulus)) % BigInt(modulus);
  let e = BigInt(exponent);
  const m = BigInt(modulus);
  let result = 1n % m;
  while (e > 0n) {
    if (e & 1n) result = (result * b) % m;
    b = (b * b) % m;
    e >>= 1n;
  }
  return Number(result);
};

export const chineseRemainder = (
  residues: number[],
  moduli: number[],
): { solution: string; period: string } => {
  if (
    !residues.length ||
    residues.length !== moduli.length ||
    residues.length > 100
  )
    simpleError(
      "moduli",
      "Provide equally sized nonempty residue and modulus lists (at most 100).",
      "invalid_length",
    );
  let solution = 0n;
  let period = 1n;
  for (let i = 0; i < moduli.length; i += 1) {
    if (
      !Number.isSafeInteger(moduli[i]) ||
      moduli[i]! < 1 ||
      !Number.isSafeInteger(residues[i])
    )
      simpleError(
        "moduli",
        "Residues and moduli must be safe integers; moduli must be positive.",
      );
    const m = BigInt(moduli[i]!);
    const r = ((BigInt(residues[i]!) % m) + m) % m;
    const divisor = gcd(period, m);
    if ((r - solution) % divisor !== 0n)
      simpleError("residues", "Congruences are inconsistent.", "no_solution");
    const reduced = m / divisor;
    let inverse = 0n;
    // Extended Euclidean inverse of period/divisor modulo reduced.
    let [oldR, newR] = [period / divisor, reduced];
    let [oldS, newS] = [1n, 0n];
    while (newR !== 0n) {
      const q = oldR / newR;
      [oldR, newR] = [newR, oldR - q * newR];
      [oldS, newS] = [newS, oldS - q * newS];
    }
    inverse = ((oldS % reduced) + reduced) % reduced;
    const step =
      (((((r - solution) / divisor) * inverse) % reduced) + reduced) % reduced;
    solution += period * step;
    period *= reduced;
    solution = ((solution % period) + period) % period;
  }
  return { solution: solution.toString(), period: period.toString() };
};

export const kaprekarSteps = (
  value: number,
): { steps: number; sequence: number[] } => {
  if (!Number.isSafeInteger(value) || value < 0 || value > 9999)
    simpleError("value", "Enter a four-digit value from 0000 to 9999.");
  const sequence = [value];
  for (let step = 0; step < 20 && value !== 6174 && value !== 0; step += 1) {
    const ascending = [...String(value).padStart(4, "0")].sort().join("");
    const descending = [...ascending].reverse().join("");
    value = Number(descending) - Number(ascending);
    sequence.push(value);
  }
  return { steps: sequence.length - 1, sequence };
};

import { simpleError } from "../core/simple.js";
import { bounded } from "./batch-arithmetic.js";
import { positive } from "../neuroscience/shared.js";
const lanczos = [
  676.5203681218851, -1259.1392167224028, 771.32342877765313,
  -176.61502916214059, 12.507343278686905, -0.13857109526572012,
  9.9843695780195716e-6, 1.5056327351493116e-7,
];
export const logGamma = (x: number): number => {
  positive(x, "gammaArgument");
  if (x < 0.5)
    return (
      Math.log(Math.PI) - Math.log(Math.sin(Math.PI * x)) - logGamma(1 - x)
    );
  const z = x - 1;
  let a = 0.99999999999980993;
  for (let i = 0; i < lanczos.length; i++) a += lanczos[i] / (z + i + 1);
  const t = z + 7.5;
  return (
    0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(t) - t + Math.log(a)
  );
};
export const gamma = (x: number): number => Math.exp(logGamma(x));
export const digamma = (x: number): number => {
  positive(x, "x");
  let y = x,
    s = 0;
  while (y < 10) {
    s -= 1 / y;
    y++;
  }
  const z = 1 / (y * y);
  return (
    s +
    Math.log(y) -
    1 / (2 * y) -
    z * (1 / 12 - z * (1 / 120 - z * (1 / 252 - z * (1 / 240 - z * (1 / 132)))))
  );
};
export const gammaRatios = (a: number, x: number): { p: number; q: number } => {
  positive(a, "shape");
  if (a > 1000 || x < 0 || x > 10000)
    return simpleError(
      "gamma",
      "Shape at most 1000 and x in [0,10000] required.",
    );
  if (x === 0) return { p: 0, q: 1 };
  const log = Math.exp(a * Math.log(x) - x - logGamma(a));
  if (x < a + 1) {
    let term = 1 / a,
      sum = term;
    for (let j = 1; j <= 10000; j++) {
      term *= x / (a + j);
      sum += term;
      if (Math.abs(term) < Math.abs(sum) * 1e-14) {
        const p = Math.max(0, Math.min(1, sum * log));
        return { p, q: 1 - p };
      }
    }
  } else {
    const tiny = 1e-300;
    let b = x + 1 - a,
      c = 1 / tiny,
      d = 1 / (Math.abs(b) < tiny ? tiny : b),
      h = d;
    for (let i = 1; i <= 10000; i++) {
      const an = -i * (i - a);
      b += 2;
      d = an * d + b;
      if (Math.abs(d) < tiny) d = tiny;
      c = b + an / c;
      if (Math.abs(c) < tiny) c = tiny;
      d = 1 / d;
      const delta = d * c;
      h *= delta;
      if (Math.abs(delta - 1) < 1e-14) {
        const q = Math.max(0, Math.min(1, log * h));
        return { p: 1 - q, q };
      }
    }
  }
  return simpleError(
    "gamma",
    "Incomplete gamma iteration did not converge within bounded work.",
  );
};
const betaCf = (a: number, b: number, x: number): number => {
  const tiny = 1e-300;
  let c = 1,
    d = 1 - ((a + b) * x) / (a + 1);
  if (Math.abs(d) < tiny) d = tiny;
  d = 1 / d;
  let h = d;
  for (let m = 1; m <= 10000; m++) {
    const m2 = 2 * m;
    let aa = (m * (b - m) * x) / ((a + m2 - 1) * (a + m2));
    d = 1 + aa * d;
    if (Math.abs(d) < tiny) d = tiny;
    c = 1 + aa / c;
    if (Math.abs(c) < tiny) c = tiny;
    d = 1 / d;
    h *= d * c;
    aa = (-(a + m) * (a + b + m) * x) / ((a + m2) * (a + m2 + 1));
    d = 1 + aa * d;
    if (Math.abs(d) < tiny) d = tiny;
    c = 1 + aa / c;
    if (Math.abs(c) < tiny) c = tiny;
    d = 1 / d;
    const delta = d * c;
    h *= delta;
    if (Math.abs(delta - 1) < 1e-14) return h;
  }
  return simpleError(
    "beta",
    "Incomplete beta iteration did not converge within bounded work.",
  );
};
export const betaRatio = (a: number, b: number, x: number): number => {
  positive(a, "a");
  positive(b, "b");
  if (a > 1000 || b > 1000 || x < 0 || x > 1)
    return simpleError(
      "beta",
      "Positive shapes at most 1000 and x in [0,1] required.",
    );
  if (x === 0 || x === 1) return x;
  const bt = Math.exp(
    logGamma(a + b) -
      logGamma(a) -
      logGamma(b) +
      a * Math.log(x) +
      b * Math.log1p(-x),
  );
  return Math.max(
    0,
    Math.min(
      1,
      x < (a + 1) / (a + b + 2)
        ? (bt * betaCf(a, b, x)) / a
        : 1 - (bt * betaCf(b, a, 1 - x)) / b,
    ),
  );
};
export const erf = (x: number): number => {
  if (Math.abs(x) > 26)
    return simpleError("x", "Real argument within [-26,26] required.");
  if (Math.abs(x) < 0.5) {
    let term = x,
      sum = term;
    for (let k = 1; k <= 40; k++) {
      term *= -(x * x) / k;
      const add = term / (2 * k + 1);
      sum += add;
      if (Math.abs(add) <= Number.EPSILON * Math.abs(sum)) break;
    }
    return (2 * sum) / Math.sqrt(Math.PI);
  }
  return x < 0 ? erfc(-x) - 1 : 1 - erfc(x);
};
export const erfc = (x: number): number => {
  if (Math.abs(x) > 26)
    return simpleError("x", "Real argument within [-26,26] required.");
  if (x === 0) return 1;
  if (Math.abs(x) < 0.5) return 1 - erf(x);
  const a = Math.abs(x),
    t = 1 / (1 + 0.5 * a),
    r =
      t *
      Math.exp(
        -a * a -
          1.26551223 +
          t *
            (1.00002368 +
              t *
                (0.37409196 +
                  t *
                    (0.09678418 +
                      t *
                        (-0.18628806 +
                          t *
                            (0.27886807 +
                              t *
                                (-1.13520398 +
                                  t *
                                    (1.48851587 +
                                      t * (-0.82215223 + t * 0.17087277)))))))),
      );
  return x < 0 ? 2 - r : r;
};
export const besselJ0 = (x: number): number => {
  if (Math.abs(x) > 20)
    return simpleError("x", "Series argument within [-20,20] required.");
  let t = 1,
    s = 1;
  for (let k = 1; k <= 200; k++) {
    t *= -((x * x) / 4) / (k * k);
    s += t;
    if (Math.abs(t) < 1e-16 * Math.max(1, Math.abs(s))) return s;
  }
  return simpleError("x", "Bessel series did not converge.");
};
export const kelvin = (x: number): { ber: number; bei: number } => {
  if (Math.abs(x) > 20)
    return simpleError("x", "Kelvin series argument within [-20,20] required.");
  let mag = 1,
    ber = 1,
    bei = 0;
  for (let k = 1; k <= 200; k++) {
    mag *= (x * x) / (4 * k * k);
    const v = (Math.floor(k / 2) % 2 ? -1 : 1) * mag;
    if (k % 2) bei += v;
    else ber += v;
    if (
      k > 1 &&
      Math.abs(mag) < 1e-16 * Math.max(1, Math.abs(ber), Math.abs(bei))
    )
      return { ber, bei };
  }
  return simpleError("x", "Kelvin series did not converge.");
};
export const struve = (order: number, x: number): number => {
  bounded(order, "order", 0, 5);
  if (x < 0 || x > 20)
    return simpleError("x", "Struve H series x in [0,20] required.");
  if (x === 0) return 0;
  let t = Math.exp(
      (order + 1) * Math.log(x / 2) - logGamma(1.5) - logGamma(order + 1.5),
    ),
    s = t;
  for (let k = 1; k <= 200; k++) {
    t *= -((x * x) / 4) / ((k + 0.5) * (k + order + 0.5));
    s += t;
    if (Math.abs(t) < 1e-16 * Math.max(1, Math.abs(s))) return s;
  }
  return simpleError("x", "Struve series did not converge.");
};
export const orthogonal = (
  family: string,
  n: number,
  x: number,
  alpha = 0,
  beta = 0,
): number => {
  bounded(n, "degree", 0, 128);
  if (Math.abs(x) > 100 || Math.abs(alpha) > 100 || Math.abs(beta) > 100)
    return simpleError(
      "parameters",
      "Arguments bounded in absolute value by 100 required.",
    );
  if (n === 0) return 1;
  let a = 1,
    b =
      family === "laguerre"
        ? 1 + alpha - x
        : family === "hermite"
          ? 2 * x
          : family === "legendre" || family === "chebyshev"
            ? x
            : family === "gegenbauer"
              ? 2 * alpha * x
              : 0.5 * (alpha - beta + (alpha + beta + 2) * x);
  for (let k = 1; k < n; k++) {
    let c = 0;
    if (family === "laguerre")
      c = ((2 * k + 1 + alpha - x) * b - (k + alpha) * a) / (k + 1);
    else if (family === "hermite") c = 2 * x * b - 2 * k * a;
    else if (family === "legendre") c = ((2 * k + 1) * x * b - k * a) / (k + 1);
    else if (family === "chebyshev") c = 2 * x * b - a;
    else if (family === "gegenbauer")
      c = (2 * (k + alpha) * x * b - (k + 2 * alpha - 1) * a) / (k + 1);
    else {
      const j = k + 1,
        s = 2 * j + alpha + beta;
      const den = 2 * j * (j + alpha + beta) * (s - 2);
      if (Math.abs(den) < 1e-14)
        return simpleError(
          "parameters",
          "Jacobi recurrence singular for supplied parameters.",
        );
      c =
        ((s - 1) * (s * (s - 2) * x + alpha * alpha - beta * beta) * b -
          2 * (j + alpha - 1) * (j + beta - 1) * s * a) /
        den;
    }
    a = b;
    b = c;
  }
  return b;
};
export const hypergeometric = (
  a: number,
  b: number,
  c: number,
  x: number,
  confluent: boolean,
  terms: number,
): { value: number; lastTermMagnitude: number; terminated: boolean } => {
  bounded(terms, "terms", 1, 1000);
  if (
    [a, b, c].some((v) => Math.abs(v) > 100) ||
    Math.abs(x) > (confluent ? 20 : 0.95) ||
    (c <= 0 && Number.isInteger(c))
  )
    return simpleError(
      "parameters",
      "Bounded parameters, denominator parameter away from nonpositive integer poles and |x|≤0.95 (2F1) or ≤20 (1F1) required.",
    );
  let t = 1,
    s = 1,
    terminated = false;
  for (let k = 1; k < terms; k++) {
    const top = (a + k - 1) * (confluent ? 1 : b + k - 1);
    if (top === 0) {
      t = 0;
      terminated = true;
      break;
    }
    t *= (top * x) / ((c + k - 1) * k);
    s += t;
  }
  return { value: s, lastTermMagnitude: Math.abs(t), terminated };
};

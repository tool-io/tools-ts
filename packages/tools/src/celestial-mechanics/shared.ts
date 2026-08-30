import { simpleError } from "../core/simple.js";

export const positive = (v: number, f: string): number => {
  if (!Number.isFinite(v) || v <= 0)
    simpleError(f, "A positive finite value is required.");
  return v;
};
export const nonnegative = (v: number, f: string): number => {
  if (!Number.isFinite(v) || v < 0)
    simpleError(f, "A nonnegative finite value is required.");
  return v;
};
export const fraction = (v: number, f: string): number => {
  nonnegative(v, f);
  if (v > 1) simpleError(f, "A fraction in [0,1] is required.");
  return v;
};
export const count = (v: number, f: string, min = 0): number => {
  if (!Number.isSafeInteger(v) || v < min)
    simpleError(f, `An integer of at least ${min} is required.`);
  return v;
};
export const aligned = (
  a: readonly unknown[],
  b: readonly unknown[],
  f: string,
): void => {
  if (!a.length || a.length !== b.length)
    simpleError(f, "Aligned nonempty lists are required.");
};
export const rad = (deg: number): number => (deg * Math.PI) / 180;
export const deg = (r: number): number => (r * 180) / Math.PI;
export const wrap = (v: number, period = 360): number =>
  ((v % period) + period) % period;
export const signedAngle = (v: number): number => wrap(v + 180) - 180;
export const clamp = (v: number): number => Math.max(-1, Math.min(1, v));
export const eccentricity = (v: number): number => {
  fraction(v, "eccentricity");
  if (v === 1)
    simpleError(
      "eccentricity",
      "An elliptical eccentricity below one is required.",
    );
  return v;
};
export const vector = (
  v: readonly number[],
  field: string,
): readonly number[] => {
  if (v.length !== 3 || v.some((x) => !Number.isFinite(x)))
    simpleError(field, "A finite three-component vector is required.");
  return v;
};
export const norm = (v: readonly number[]): number => Math.hypot(...v);
export const dot = (a: readonly number[], b: readonly number[]): number =>
  a.reduce((sum, v, i) => sum + v * b[i], 0);
export const cross = (a: readonly number[], b: readonly number[]): number[] => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];
export const rotate = (
  v: readonly number[],
  axis: readonly number[],
  angle: number,
): number[] => {
  vector(v, "vector");
  vector(axis, "axis");
  const length = positive(norm(axis), "axis"),
    u = axis.map((x) => x / length),
    c = Math.cos(angle),
    s = Math.sin(angle),
    uv = cross(u, v),
    projection = dot(u, v);
  return v.map((x, i) => x * c + uv[i] * s + u[i] * projection * (1 - c));
};
export const speed = (mu: number, r: number, a: number): number => {
  positive(mu, "mu");
  positive(r, "radius");
  if (!Number.isFinite(a) || a === 0)
    simpleError(
      "semimajorAxis",
      "A finite nonzero semimajor axis is required.",
    );
  const squared = mu * (2 / r - 1 / a);
  if (squared < 0)
    simpleError(
      "radius",
      "Radius is outside the supplied conic's physically accessible speed range.",
    );
  return Math.sqrt(squared);
};
export const period = (mu: number, a: number): number => {
  positive(mu, "mu");
  positive(a, "semimajorAxis");
  return 2 * Math.PI * Math.sqrt(a ** 3 / mu);
};
export const j2Factor = (
  mu: number,
  a: number,
  e: number,
  radius: number,
  j2: number,
): number => {
  positive(mu, "mu");
  positive(a, "semimajorAxis");
  eccentricity(e);
  positive(radius, "referenceRadius");
  nonnegative(j2, "j2");
  return 1.5 * j2 * Math.sqrt(mu / a ** 3) * (radius / (a * (1 - e * e))) ** 2;
};
export const tisserand = (
  a: number,
  e: number,
  i: number,
  planetA: number,
): number => {
  positive(a, "semimajorAxis");
  eccentricity(e);
  positive(planetA, "planetSemimajorAxis");
  if (i < 0 || i > 180)
    simpleError("inclination", "Inclination must be within [0,180] degrees.");
  return (
    planetA / a + 2 * Math.cos(rad(i)) * Math.sqrt((a / planetA) * (1 - e * e))
  );
};
export const collinearRoot = (mu: number, point: "L1" | "L2"): number => {
  positive(mu, "massFraction");
  if (mu < 1e-15 || mu > 0.5)
    simpleError(
      "massFraction",
      "Numerically supported smaller-primary mass fraction is [1e-15,0.5].",
    );
  const derivative = (x: number) =>
    x -
    ((1 - mu) * (x + mu)) / Math.abs(x + mu) ** 3 -
    (mu * (x - 1 + mu)) / Math.abs(x - 1 + mu) ** 3;
  let low = point === "L1" ? -mu + 1e-12 : 1 - mu + 1e-12,
    high = point === "L1" ? 1 - mu - 1e-12 : 2;
  for (let i = 0; i < 150; i++) {
    const mid = (low + high) / 2;
    if (derivative(mid) > 0) high = mid;
    else low = mid;
  }
  return (low + high) / 2;
};
export const kepler = (mean: number, e: number): number => {
  eccentricity(e);
  const m = wrap(mean, 2 * Math.PI);
  let low = 0,
    high = 2 * Math.PI;
  for (let i = 0; i < 100; i++) {
    const mid = (low + high) / 2;
    if (mid - e * Math.sin(mid) > m) high = mid;
    else low = mid;
  }
  return (low + high) / 2;
};

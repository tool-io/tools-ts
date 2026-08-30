import { simpleError, type SimpleField } from "../core/simple.js";
import { toolResourceLimits } from "../core/limits.js";

export const positive = (x: number, f: string): number => {
  if (!Number.isFinite(x) || x <= 0)
    simpleError(f, "A positive finite value is required.");
  return x;
};
export const nonnegative = (x: number, f: string): number => {
  if (!Number.isFinite(x) || x < 0)
    simpleError(f, "A nonnegative finite value is required.");
  return x;
};
export const fraction = (x: number, f: string): number => {
  nonnegative(x, f);
  if (x > 1) simpleError(f, "A fraction within [0,1] is required.");
  return x;
};
export const count = (x: number, f: string, min = 0): number => {
  if (!Number.isSafeInteger(x) || x < min)
    simpleError(f, `A safe integer of at least ${min} is required.`);
  return x;
};
export const aligned = (
  a: readonly unknown[],
  b: readonly unknown[],
  f: string,
): void => {
  if (!a.length || a.length !== b.length)
    simpleError(f, "Aligned nonempty lists are required.");
};
export const ordered = (x: readonly number[], f: string): void => {
  if (
    x.length < 2 ||
    x.some((v, i) => !Number.isFinite(v) || (i > 0 && v <= x[i - 1]))
  )
    simpleError(
      f,
      "At least two strictly increasing finite samples are required.",
    );
};
export const mean = (x: readonly number[]): number => {
  if (!x.length) simpleError("samples", "Nonempty samples are required.");
  return x.reduce((s, v) => s + v, 0) / x.length;
};
export const variance = (x: readonly number[]): number => {
  if (x.length < 2)
    simpleError(
      "samples",
      "At least two samples required for sample variance.",
    );
  const m = mean(x);
  return x.reduce((s, v) => s + (v - m) ** 2, 0) / (x.length - 1);
};
export const median = (x: readonly number[]): number => {
  if (!x.length) simpleError("samples", "Nonempty samples required.");
  const a = [...x].sort((a, b) => a - b),
    k = Math.floor(a.length / 2);
  return a.length % 2 ? a[k] : (a[k - 1] + a[k]) / 2;
};
export const quantile = (x: readonly number[], p: number): number => {
  fraction(p, "probability");
  if (!x.length) simpleError("samples", "Nonempty samples required.");
  const a = [...x].sort((a, b) => a - b),
    h = (a.length - 1) * p,
    k = Math.floor(h);
  return a[k] + (a[Math.min(k + 1, a.length - 1)] - a[k]) * (h - k);
};
export const regression = (
  x: readonly number[],
  y: readonly number[],
): { slope: number; intercept: number; rSquared: number } => {
  aligned(x, y, "samples");
  if (x.length < 2)
    simpleError("samples", "At least two observations required.");
  const mx = mean(x),
    my = mean(y),
    ssx = x.reduce((s, v) => s + (v - mx) ** 2, 0);
  positive(ssx, "samples");
  const slope = x.reduce((s, v, i) => s + (v - mx) * (y[i] - my), 0) / ssx,
    intercept = my - slope * mx,
    ssy = y.reduce((s, v) => s + (v - my) ** 2, 0),
    sse = y.reduce((s, v, i) => s + (v - intercept - slope * x[i]) ** 2, 0);
  return {
    slope,
    intercept,
    rSquared: ssy === 0 ? 1 : Math.max(0, Math.min(1, 1 - sse / ssy)),
  };
};
export const integral = (
  t: readonly number[],
  y: readonly number[],
): number => {
  aligned(t, y, "times");
  ordered(t, "times");
  return t
    .slice(1)
    .reduce((s, v, i) => s + ((v - t[i]) * (y[i] + y[i + 1])) / 2, 0);
};
export const window = (
  t: readonly number[],
  y: readonly number[],
  start: number,
  end: number,
): number[] => {
  aligned(t, y, "times");
  ordered(t, "times");
  if (end < start)
    simpleError("windowEnd", "Ordered inclusive window bounds required.");
  const values = y.filter((_, i) => t[i] >= start && t[i] <= end);
  if (!values.length)
    simpleError("windowStart", "Window must contain at least one sample.");
  return values;
};
export const onset = (
  t: readonly number[],
  y: readonly number[],
  start: number,
  threshold: number,
  direction: number,
): number => {
  aligned(t, y, "times");
  ordered(t, "times");
  if (direction !== 1 && direction !== -1)
    simpleError("direction", "Direction must be +1 or -1.");
  if (start < t[0] || start > t[t.length - 1])
    simpleError(
      "start",
      "Onset observation must start within the sampled interval.",
    );
  for (let i = 0; i < t.length; i++) {
    if (t[i] < start) continue;
    if (i === 0) {
      if (direction * (y[i] - threshold) > 0)
        simpleError(
          "start",
          "Criterion was already exceeded at observation start; onset is left-censored.",
        );
      if (y[i] === threshold) return t[i];
      continue;
    }
    const left = Math.max(start, t[i - 1]),
      leftY =
        y[i - 1] + ((y[i] - y[i - 1]) * (left - t[i - 1])) / (t[i] - t[i - 1]);
    if (left === start && direction * (leftY - threshold) > 0)
      simpleError(
        "start",
        "Criterion was already exceeded at observation start; onset is left-censored.",
      );
    if (leftY === threshold) return left;
    if (direction * (y[i] - threshold) >= 0)
      return (
        t[i - 1] +
        ((threshold - y[i - 1]) / (y[i] - y[i - 1])) * (t[i] - t[i - 1])
      );
  }
  return simpleError(
    "threshold",
    "No threshold crossing was observed; latency cannot be inferred.",
  );
};
export const norm = (v: readonly number[]): number => Math.hypot(...v);
export const tensor = (
  e: readonly number[],
): { meanDiffusivity: number; fractionalAnisotropy: number } => {
  if (e.length !== 3 || e.some((v) => !Number.isFinite(v) || v < 0))
    simpleError(
      "eigenvalues",
      "Three nonnegative diffusion eigenvalues required.",
    );
  const m = mean(e),
    den = e.reduce((s, v) => s + v * v, 0);
  positive(den, "eigenvalues");
  return {
    meanDiffusivity: m,
    fractionalAnisotropy: Math.sqrt(
      (1.5 * e.reduce((s, v) => s + (v - m) ** 2, 0)) / den,
    ),
  };
};
export const spectrumEdge = (
  frequencies: readonly number[],
  powers: readonly number[],
  p: number,
): number => {
  aligned(frequencies, powers, "frequencies");
  ordered(frequencies, "frequencies");
  frequencies.forEach((v) => nonnegative(v, "frequencies"));
  powers.forEach((v) => nonnegative(v, "powers"));
  fraction(p, "powerFraction");
  positive(
    powers.reduce((a, b) => a + b, 0),
    "powers",
  );
  const target = integral(frequencies, powers) * p;
  positive(integral(frequencies, powers), "powers");
  if (p === 0) return frequencies[0];
  let cumulative = 0;
  for (let i = 1; i < frequencies.length; i++) {
    const width = frequencies[i] - frequencies[i - 1],
      area = (width * (powers[i - 1] + powers[i])) / 2;
    if (cumulative + area >= target) {
      let low = 0,
        high = width;
      const slope = (powers[i] - powers[i - 1]) / width;
      for (let k = 0; k < 60; k++) {
        const h = (low + high) / 2;
        if (powers[i - 1] * h + (slope * h * h) / 2 < target - cumulative)
          low = h;
        else high = h;
      }
      return frequencies[i - 1] + (low + high) / 2;
    }
    cumulative += area;
  }
  return frequencies[frequencies.length - 1];
};
// Acklam inverse-normal approximation (absolute error around 1e-9 centrally).
export const normalQuantile = (p: number): number => {
  if (p <= 0 || p >= 1)
    simpleError(
      "probability",
      "Normal quantiles require probability in (0,1).",
    );
  const a = [
      -39.6968302866538, 220.946098424521, -275.928510446969, 138.357751867269,
      -30.6647980661472, 2.50662827745924,
    ],
    b = [
      -54.4760987982241, 161.585836858041, -155.698979859887, 66.8013118877197,
      -13.2806815528857,
    ],
    c = [
      -0.00778489400243029, -0.322396458041136, -2.40075827716184,
      -2.54973253934373, 4.37466414146497, 2.93816398269878,
    ],
    d = [
      0.00778469570904146, 0.32246712907004, 2.445134137143, 3.75440866190742,
    ];
  if (p < 0.02425 || p > 0.97575) {
    const q = Math.sqrt(-2 * Math.log(p < 0.02425 ? p : 1 - p)),
      v = ((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5],
      w = (((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1;
    return ((p < 0.02425 ? 1 : -1) * v) / w;
  }
  const q = p - 0.5,
    r = q * q;
  return (
    ((((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) *
      q) /
    (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1)
  );
};

export const graph = (a: readonly (readonly number[])[]): number => {
  const n = a.length;
  if (n < 2 || n > 64 || a.some((row) => row.length !== n))
    simpleError(
      "adjacency",
      "A square binary undirected graph of 2–64 nodes required.",
    );
  for (let i = 0; i < n; i++)
    for (let j = 0; j < n; j++)
      if (
        !Number.isFinite(a[i][j]) ||
        (a[i][j] !== 0 && a[i][j] !== 1) ||
        a[i][j] !== a[j][i] ||
        (i === j && a[i][j] !== 0)
      )
        simpleError(
          "adjacency",
          "Binary symmetric adjacency with no self loops required.",
        );
  return n;
};
export const paths = (a: readonly (readonly number[])[]): number[][] => {
  const n = graph(a),
    d = a.map((row, i) => row.map((v, j) => (i === j ? 0 : v ? 1 : Infinity)));
  for (let k = 0; k < n; k++)
    for (let i = 0; i < n; i++)
      for (let j = 0; j < n; j++)
        d[i][j] = Math.min(d[i][j], d[i][k] + d[k][j]);
  return d;
};
export const efficiency = (a: readonly (readonly number[])[]): number => {
  if (a.length < 2) return 0;
  const d = paths(a);
  let sum = 0;
  for (let i = 0; i < d.length; i++)
    for (let j = 0; j < d.length; j++) if (i !== j) sum += 1 / d[i][j];
  return sum / (d.length * (d.length - 1));
};
export const dimensions = (
  shape: readonly number[],
  length: number,
  max = 100000,
): void => {
  if (
    shape.length !== 3 ||
    shape.some((v) => !Number.isSafeInteger(v) || v < 1) ||
    shape.reduce((s, v) => s * v, 1) !== length ||
    length > max
  )
    simpleError(
      "dimensions",
      "Three positive integer dimensions must match the bounded flat voxel array (x fastest, then y, then z).",
    );
};
export const components = (
  values: readonly number[],
  shape: readonly number[],
  threshold: number,
): number[][] => {
  dimensions(shape, values.length);
  const [nx, ny, nz] = shape,
    seen = new Set<number>(),
    result: number[][] = [];
  for (let seed = 0; seed < values.length; seed++) {
    if (seen.has(seed) || values[seed] < threshold) continue;
    seen.add(seed);
    const queue = [seed];
    for (let q = 0; q < queue.length; q++) {
      const index = queue[q],
        x = index % nx,
        y = Math.floor(index / nx) % ny,
        z = Math.floor(index / (nx * ny));
      const neighbors = [
        x > 0 ? index - 1 : -1,
        x + 1 < nx ? index + 1 : -1,
        y > 0 ? index - nx : -1,
        y + 1 < ny ? index + nx : -1,
        z > 0 ? index - nx * ny : -1,
        z + 1 < nz ? index + nx * ny : -1,
      ];
      for (const neighbor of neighbors)
        if (
          neighbor >= 0 &&
          !seen.has(neighbor) &&
          values[neighbor] >= threshold
        ) {
          seen.add(neighbor);
          queue.push(neighbor);
        }
    }
    result.push(queue);
  }
  return result;
};
export const validateInput = (
  input: unknown,
  fields: readonly SimpleField[],
): void => {
  if (!input || typeof input !== "object" || Array.isArray(input))
    simpleError("input", "An input object required.");
  const record = input as Record<string, unknown>,
    ids = new Set(fields.map((f) => f.id));
  if (Object.keys(record).some((k) => !ids.has(k)))
    simpleError("input", "Unknown input field.");
  for (const f of fields) {
    const v = record[f.id];
    let valid = false;
    if (f.kind === "number" || f.kind === "integer")
      valid =
        typeof v === "number" &&
        Number.isFinite(v) &&
        (f.kind !== "integer" || Number.isSafeInteger(v));
    else if (f.kind === "string")
      valid =
        typeof v === "string" && v.length <= toolResourceLimits.textCharacters;
    else if (f.kind === "boolean") valid = typeof v === "boolean";
    else if (f.kind === "numberList")
      valid =
        Array.isArray(v) &&
        v.length <= toolResourceLimits.generatedValues &&
        v.every((x) => typeof x === "number" && Number.isFinite(x));
    else if (f.kind === "matrix")
      valid =
        Array.isArray(v) &&
        v.length <= toolResourceLimits.matrixDimension &&
        v.every(
          (row) =>
            Array.isArray(row) &&
            row.length <= toolResourceLimits.matrixDimension &&
            row.every((x) => typeof x === "number" && Number.isFinite(x)),
        );
    if (!valid)
      simpleError(f.id, "A finite, correctly typed bounded value is required.");
  }
};
export const finish = <T extends Readonly<Record<string, unknown>>>(
  value: T,
): T => {
  const walk = (v: unknown): void => {
    if (typeof v === "number" && !Number.isFinite(v))
      simpleError("output", "Inputs produce a nonfinite result.");
    if (Array.isArray(v)) {
      if (v.length > toolResourceLimits.generatedValues)
        simpleError("output", "Output exceeds the generated-value budget.");
      v.forEach(walk);
    } else if (v && typeof v === "object") Object.values(v).forEach(walk);
  };
  walk(value);
  return value;
};

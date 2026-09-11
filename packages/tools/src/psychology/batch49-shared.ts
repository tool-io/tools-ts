import {
  simpleError,
  positive,
  sum,
  mean,
  aligned,
  bounded,
  finite,
  shape,
  nonnegative,
} from "../toxicology/batch48-shared.js";
import type { SimpleField } from "../core/simple.js";
import { validateInput as validateBase } from "../toxicology/batch48-shared.js";
export * from "../toxicology/batch48-shared.js";
export const validateInput = (
  input: unknown,
  fields: readonly SimpleField[],
): void => {
  if (!input || typeof input !== "object" || Array.isArray(input))
    simpleError("input", "Explicit input object required.");
  const record = input as Record<string, unknown>,
    ids = new Set(fields.map((f) => f.id));
  if (
    Object.keys(record).some((k) => !ids.has(k)) ||
    fields.some((f) => !Object.hasOwn(record, f.id))
  )
    simpleError("input", "Only explicit own required fields accepted.");
  for (const f of fields)
    if (f.kind === "stringList") {
      const v = record[f.id],
        limit = f.id === "callerReferenceTexts" ? 512 : 128;
      if (!Array.isArray(v) || v.length > 128)
        simpleError(f.id, "At most 128 actual strings.");
      for (let i = 0; i < v.length; i++)
        if (
          !Object.hasOwn(v, i) ||
          typeof v[i] !== "string" ||
          v[i].length > limit
        )
          simpleError(
            f.id,
            `Dense own strings of at most ${limit} UTF-16 units.`,
          );
    }
  const rest = fields.filter((f) => f.kind !== "stringList");
  validateBase(Object.fromEntries(rest.map((f) => [f.id, record[f.id]])), rest);
};
export { callerInstrument } from "../marriage/batch48-shared.js";
export { intervalUnion } from "../museology/shared.js";
export { quantile, normalQuantile } from "../neuroscience/shared.js";
export const sampleVariance = (x: readonly number[]): number => {
  if (x.length < 2)
    simpleError("variance", "At least two actual observations.");
  const m = mean(x);
  return finite(sum(x.map((v) => (v - m) ** 2)) / (x.length - 1));
};
export const determinant = (a: readonly (readonly number[])[]): number => {
  const n = shape(a, "matrix");
  if (a.length !== n || n < 1 || n > 8)
    simpleError("matrix", "Square1–8matrix.");
  if (n === 1) return a[0][0];
  return finite(
    sum(
      a[0].map(
        (v, i) =>
          (i % 2 ? -1 : 1) *
          v *
          determinant(a.slice(1).map((r) => r.filter((_, j) => i !== j))),
      ),
    ),
  );
};
export const triangleArea = (a: number, b: number, c: number): number => {
  [a, b, c].forEach((v) => positive(v, "side"));
  if (a + b <= c || a + c <= b || b + c <= a)
    simpleError("triangle", "Strict non degenerate triangle inequalities.");
  const s = (a + b + c) / 2;
  return positive(Math.sqrt(s * (s - a) * (s - b) * (s - c)), "area");
};
export const svd2 = (a: readonly (readonly number[])[]): number[] => {
  if (shape(a, "matrix") !== 2 || a.length !== 2)
    simpleError("matrix", "2×2matrix.");
  const scale = Math.max(...a.flat().map(Math.abs));
  if (scale === 0) return [0, 0];
  const [x, y, z, w] = a.flat().map((v) => v / scale),
    t = x * x + y * y + z * z + w * w,
    d = x * w - y * z,
    h = Math.sqrt(Math.max(0, t * t - 4 * d * d)),
    s = Math.sqrt((t + h) / 2);
  return [s * scale, (Math.abs(d) / s) * scale];
};
export const eigenvectors2 = (
  a: readonly (readonly number[])[],
): {
  realEigenvalues: number[];
  unitEigenvectors: number[][];
  repeatedEigenvalue: boolean;
} => {
  if (shape(a, "matrix") !== 2 || a.length !== 2)
    simpleError("matrix", "Actual2×2matrix.");
  const [x, y, z, w] = a.flat(),
    q = (x - w) ** 2 + 4 * y * z;
  if (q < 0)
    simpleError(
      "eigenvalues",
      "Real eigenvector branch requires nonnegative discriminant.",
    );
  const root = Math.sqrt(q),
    values = q === 0 ? [(x + w) / 2] : [(x + w - root) / 2, (x + w + root) / 2];
  const vectors = values.map((v) => {
    let u = Math.abs(y) >= Math.abs(z) ? [y, v - x] : [v - w, z];
    if (Math.hypot(...u) === 0) u = x === v ? [1, 0] : [0, 1];
    const norm = Math.hypot(...u);
    u = u.map((t) => t / norm);
    if (u[0] < 0 || (u[0] === 0 && u[1] < 0)) u = u.map((t) => -t);
    return u;
  });
  return {
    realEigenvalues: values,
    unitEigenvectors: vectors,
    repeatedEigenvalue: q === 0,
  };
};

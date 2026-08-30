import { simpleError } from "../core/simple.js";
export {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
  count,
  aligned,
  ordered,
  mean,
  variance,
  regression,
  integral,
  quantile,
  norm,
  normalQuantile,
} from "../neuroscience/shared.js";
export { maximum, minimum, interpolate } from "../mining/shared.js";
export { crossing } from "../glaciology/shared.js";
export { calculateMahalanobisDistance } from "../distance/mahalanobis/tool.js";
import { count, positive } from "../neuroscience/shared.js";
export const shape = (
  a: readonly (readonly number[])[],
  field: string,
): number => {
  const m = a[0]?.length ?? 0;
  if (
    !a.length ||
    a.length > 128 ||
    !m ||
    m > 128 ||
    a.some((row) => row.length !== m)
  )
    simpleError(
      field,
      "A nonempty rectangular matrix of at most 128×128 required.",
    );
  return m;
};
export const ids = (a: readonly number[], field: string): void => {
  if (!a.length || a.length > 128 || new Set(a).size !== a.length)
    simpleError(field, "1–128 distinct integer IDs required.");
  a.forEach((v) => count(v, field));
};
export const solve = (
  matrix: readonly (readonly number[])[],
  rhs: readonly number[],
): number[] => {
  const n = matrix.length;
  if (!n || n > 16 || rhs.length !== n || shape(matrix, "responseMatrix") !== n)
    simpleError(
      "responseMatrix",
      "Square identifiable response of 1–16 states required.",
    );
  const a = matrix.map((row, i) => [...row, rhs[i]]),
    scale = positive(
      Math.max(...matrix.flat().map(Math.abs)),
      "responseMatrix",
    );
  for (let k = 0; k < n; k++) {
    let p = k;
    for (let i = k + 1; i < n; i++)
      if (Math.abs(a[i][k]) > Math.abs(a[p][k])) p = i;
    if (Math.abs(a[p][k]) <= scale * 1e-12)
      simpleError("responseMatrix", "Singular or poorly conditioned response.");
    [a[p], a[k]] = [a[k], a[p]];
    for (let i = k + 1; i < n; i++) {
      const q = a[i][k] / a[k][k];
      for (let j = k; j <= n; j++) a[i][j] -= q * a[k][j];
    }
  }
  const x = Array<number>(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    let b = a[i][n];
    for (let j = i + 1; j < n; j++) b -= a[i][j] * x[j];
    x[i] = b / a[i][i];
  }
  return x;
};

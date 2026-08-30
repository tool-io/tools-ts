import { simpleError } from "../core/simple.js";
export {
  positive,
  nonnegative,
  fraction,
  count,
  aligned,
  rad,
  deg,
  wrap,
  signedAngle,
  clamp,
  vector,
  norm,
  dot,
  cross,
  rotate,
} from "../celestial-mechanics/shared.js";
import {
  rad,
  deg,
  wrap,
  norm,
  positive,
} from "../celestial-mechanics/shared.js";

export const skyVector = (ra: number, dec: number): number[] => {
  if (dec < -90 || dec > 90)
    simpleError("declination", "Declination must be in [-90,90] degrees.");
  const a = rad(ra),
    d = rad(dec);
  return [Math.cos(d) * Math.cos(a), Math.cos(d) * Math.sin(a), Math.sin(d)];
};
export const skyAngles = (v: readonly number[]): number[] => {
  positive(norm(v), "vector");
  return [
    wrap(deg(Math.atan2(v[1], v[0]))),
    deg(Math.atan2(v[2], Math.hypot(v[0], v[1]))),
  ];
};
export const galacticRotation = [
  [-0.0548755604162154, -0.873437090234885, -0.4838350155487132],
  [0.4941094278755837, -0.4448296299600112, 0.7469822444972189],
  [-0.8676661490190047, -0.1980763734312015, 0.4559837761750669],
] as const;
export const matrixVector = (
  m: readonly (readonly number[])[],
  v: readonly number[],
): number[] => m.map((row) => row.reduce((s, x, i) => s + x * v[i], 0));
export const plateMatrix = (m: readonly (readonly number[])[]): void => {
  if (
    m.length !== 2 ||
    m.some((row) => row.length !== 2 || row.some((v) => !Number.isFinite(v))) ||
    Math.abs(m[0][0] * m[1][1] - m[0][1] * m[1][0]) === 0
  )
    simpleError(
      "cdMatrix",
      "A finite nonsingular two-by-two CD matrix is required.",
    );
};
export const rank = (
  matrix: readonly (readonly number[])[],
  tolerance: number,
): number => {
  const a = matrix.map((row) => [...row]);
  let r = 0;
  for (let c = 0; c < (a[0]?.length ?? 0) && r < a.length; c++) {
    let p = r;
    for (let i = r + 1; i < a.length; i++)
      if (Math.abs(a[i][c]) > Math.abs(a[p][c])) p = i;
    if (Math.abs(a[p][c]) <= tolerance) continue;
    [a[r], a[p]] = [a[p], a[r]];
    const pivot = a[r][c];
    for (let j = c; j < a[r].length; j++) a[r][j] /= pivot;
    for (let i = r + 1; i < a.length; i++) {
      const f = a[i][c];
      for (let j = c; j < a[i].length; j++) a[i][j] -= f * a[r][j];
    }
    r++;
  }
  return r;
};
export const ordered = (v: readonly number[], field: string): void => {
  if (
    !v.length ||
    v.some((x, i) => !Number.isFinite(x) || (i > 0 && x <= v[i - 1]))
  )
    simpleError(
      field,
      "A nonempty strictly increasing finite list is required.",
    );
};

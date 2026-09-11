export * from "../psychology/batch49-shared.js";
import {
  simpleError,
  shape,
  positive,
  determinant,
} from "../psychology/batch49-shared.js";
export const quarticDiscriminant = (c: readonly number[]): number => {
  if (c.length !== 5 || c[0] === 0)
    simpleError(
      "coefficients",
      "Actualquarticfivecoefficients,leadingnonzero.",
    );
  const d = c.slice(0, 4).map((v, i) => v * (4 - i)),
    a = Array.from({ length: 7 }, () => Array(7).fill(0) as number[]);
  for (let i = 0; i < 3; i++) for (let j = 0; j < 5; j++) a[i][i + j] = c[j];
  for (let i = 0; i < 4; i++)
    for (let j = 0; j < 4; j++) a[3 + i][i + j] = d[j];
  return determinant(a) / c[0];
};
export const fermatPoint = (p: readonly (readonly number[])[]): number[] => {
  if (shape(p, "points") !== 2 || p.length !== 3)
    simpleError("points", "Threeactualxyvertices.");
  const origin = p[0],
    scale = Math.max(
      ...p.map((a) => Math.hypot(a[0] - origin[0], a[1] - origin[1])),
    );
  positive(scale, "scale");
  const q = p.map((a) => [
    (a[0] - origin[0]) / scale,
    (a[1] - origin[1]) / scale,
  ]);
  if (
    Math.abs(
      (q[1][0] - q[0][0]) * (q[2][1] - q[0][1]) -
        (q[1][1] - q[0][1]) * (q[2][0] - q[0][0]),
    ) < 1e-12
  )
    simpleError("triangle", "Nondegeneratewellresolvedtriangle.");
  for (let i = 0; i < 3; i++) {
    const a = q[(i + 1) % 3].map((v, j) => v - q[i][j]),
      b = q[(i + 2) % 3].map((v, j) => v - q[i][j]);
    if (a[0] * b[0] + a[1] * b[1] <= -0.5 * Math.hypot(...a) * Math.hypot(...b))
      return [...p[i]];
  }
  let x = [
    q.reduce((s, r) => s + r[0], 0) / 3,
    q.reduce((s, r) => s + r[1], 0) / 3,
  ];
  for (let k = 0; k < 10000; k++) {
    const w = q.map(
        (r) =>
          1 /
          positive(Math.hypot(r[0] - x[0], r[1] - x[1]), "iterationdistance"),
      ),
      s = w.reduce((a, b) => a + b, 0),
      y = [
        q.reduce((a, r, i) => a + r[0] * w[i], 0) / s,
        q.reduce((a, r, i) => a + r[1] * w[i], 0) / s,
      ];
    if (Math.hypot(y[0] - x[0], y[1] - x[1]) < 1e-12)
      return y.map((v, i) => origin[i] + scale * v);
    x = y;
  }
  return simpleError(
    "iteration",
    "DeclaredboundedFermatiterationdidnotconverge.",
  );
};

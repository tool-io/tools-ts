import { simpleError } from "../core/simple.js";
import { bounded } from "./batch-arithmetic.js";
export {
  validateInput,
  finish,
  positive,
  nonnegative,
  count,
  aligned,
  ordered,
  mean,
} from "../neuroscience/shared.js";
export { shape } from "../archaeology/shared.js";
export * from "./batch-arithmetic.js";
export * from "./batch-polynomial.js";
export * from "./batch-special.js";
export const triangle = (
  vertices: readonly (readonly number[])[],
): {
  area: number;
  centroid: number[];
  circumcenter: number[];
  orthocenter: number[];
  circumradius: number;
} => {
  if (vertices.length !== 3 || vertices.some((v) => v.length !== 2))
    return simpleError("vertices", "Three planar coordinate pairs required.");
  const [[ax, ay], [bx, by], [cx, cy]] = vertices,
    ux = bx - ax,
    uy = by - ay,
    vx = cx - ax,
    vy = cy - ay,
    d = 2 * (ux * vy - uy * vx),
    scale = Math.max(Math.hypot(ux, uy), Math.hypot(vx, vy));
  if (!Number.isFinite(d) || Math.abs(d) <= 1e-12 * scale * scale)
    return simpleError(
      "vertices",
      "Finite well-conditioned noncollinear triangle required.",
    );
  const u2 = ux * ux + uy * uy,
    v2 = vx * vx + vy * vy,
    ox = (vy * u2 - uy * v2) / d,
    oy = (ux * v2 - vx * u2) / d,
    O = [ax + ox, ay + oy],
    G = [ax + (ux + vx) / 3, ay + (uy + vy) / 3],
    H = [ax + ux + vx - 2 * ox, ay + uy + vy - 2 * oy];
  return {
    area: Math.abs(d) / 4,
    centroid: G,
    circumcenter: O,
    orthocenter: H,
    circumradius: Math.hypot(ox, oy),
  };
};
export const simpson = (
  f: (x: number) => number,
  a: number,
  b: number,
  panels: number,
): number => {
  bounded(panels, "panels", 2, 10000);
  if (panels % 2)
    return simpleError("panels", "Even Simpson panel count required.");
  if (b < a)
    return simpleError("bounds", "Ordered finite integration bounds required.");
  if (a === b) return 0;
  const h = (b - a) / panels;
  let s = f(a) + f(b);
  for (let j = 1; j < panels; j++) s += (j % 2 ? 4 : 2) * f(a + j * h);
  return (s * h) / 3;
};
export const finiteSet = (flags: readonly number[]): void => {
  if (
    !flags.length ||
    flags.length > 10000 ||
    flags.some((v) => v !== 0 && v !== 1)
  )
    simpleError(
      "membershipFlags",
      "Nonempty bounded binary membership for integers 1..N required.",
    );
};

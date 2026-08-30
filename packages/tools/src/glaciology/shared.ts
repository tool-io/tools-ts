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
} from "../neuroscience/shared.js";
export { maximum, minimum, interpolate } from "../mining/shared.js";
import {
  positive,
  nonnegative,
  aligned,
  ordered,
} from "../neuroscience/shared.js";
export const crossing = (
  x: readonly number[],
  y: readonly number[],
  target: number,
): number => {
  ordered(x, "coordinates");
  aligned(x, y, "coordinates");
  const roots: number[] = [];
  for (let i = 0; i < x.length; i++) {
    const d = y[i] - target;
    if (d === 0) roots.push(x[i]);
    if (i) {
      const p = y[i - 1] - target;
      if (d === 0 && p === 0)
        simpleError("values", "A coincident interval has no unique crossing.");
      if (Math.sign(p) * Math.sign(d) < 0) {
        const scale = Math.max(Math.abs(p), Math.abs(d)),
          weight = p / scale / (p / scale - d / scale);
        roots.push((1 - weight) * x[i - 1] + weight * x[i]);
      }
    }
  }
  if (roots.length !== 1)
    simpleError(
      "values",
      "Exactly one bracketed crossing required; absent or ambiguous crossings are not extrapolated.",
    );
  return roots[0];
};
export const layerGeometry = (
  boundaries: readonly number[],
  areas: readonly number[],
): { volumes: number[]; centers: number[]; surfaceArea: number } => {
  ordered(boundaries, "depthBoundariesM");
  aligned(boundaries.slice(1), areas, "layerAreasM2");
  if (boundaries[0] !== 0)
    simpleError("depthBoundariesM", "First depth must be zero.");
  areas.forEach((v) => positive(v, "layerAreasM2"));
  return {
    volumes: areas.map((a, i) => a * (boundaries[i + 1] - boundaries[i])),
    centers: areas.map((_, i) => (boundaries[i + 1] + boundaries[i]) / 2),
    surfaceArea: areas[0],
  };
};
export const clippedAreaIntegral = (
  depths: readonly number[],
  areas: readonly number[],
  start: number,
  end: number,
): number => {
  ordered(depths, "depthsM");
  aligned(depths, areas, "depthsM");
  areas.forEach((v) => nonnegative(v, "areasM2"));
  if (start < depths[0] || end > depths.at(-1)! || end < start)
    simpleError(
      "bounds",
      "Ordered bounds within the area-depth curve required.",
    );
  let sum = 0;
  for (let i = 1; i < depths.length; i++) {
    const a = Math.max(start, depths[i - 1]),
      b = Math.min(end, depths[i]);
    if (b <= a) continue;
    const slope = (areas[i] - areas[i - 1]) / (depths[i] - depths[i - 1]),
      aa = areas[i - 1] + slope * (a - depths[i - 1]),
      ab = areas[i - 1] + slope * (b - depths[i - 1]);
    sum += ((aa + ab) * (b - a)) / 2;
  }
  return sum;
};
export const logPowerFit = (
  x: readonly number[],
  y: readonly number[],
): { exponent: number; coefficient: number; rSquared: number } => {
  aligned(x, y, "observations");
  x.forEach((v) => positive(v, "x"));
  y.forEach((v) => positive(v, "y"));
  const lx = x.map(Math.log),
    ly = y.map(Math.log),
    mx = lx.reduce((a, b) => a + b, 0) / lx.length,
    my = ly.reduce((a, b) => a + b, 0) / ly.length,
    ssx = positive(
      lx.reduce((s, v) => s + (v - mx) ** 2, 0),
      "x",
    ),
    exponent = lx.reduce((s, v, i) => s + (v - mx) * (ly[i] - my), 0) / ssx,
    intercept = my - exponent * mx,
    ssy = ly.reduce((s, v) => s + (v - my) ** 2, 0),
    sse = ly.reduce(
      (s, v, i) => s + (v - intercept - exponent * lx[i]) ** 2,
      0,
    );
  return {
    exponent,
    coefficient: Math.exp(intercept),
    rSquared: ssy === 0 ? 1 : Math.max(0, Math.min(1, 1 - sse / ssy)),
  };
};

import { simpleError } from "../core/simple.js";
import { aligned, positive } from "../game/shared.js";
import { sum, mean } from "../horticulture/batch34-shared.js";
import { finite } from "../plumbing/batch35-shared.js";
import {
  strictlyIncreasing,
  interpolate,
} from "../glaciology/batch32-shared.js";
export * from "../plumbing/batch35-shared.js";
export const linearFit = (
  x: readonly number[],
  y: readonly number[],
): { slope: number; intercept: number; rSquared: number } => {
  aligned(x, y, "regression");
  if (x.length < 2 || x.length > 10000)
    simpleError(
      "regression",
      "2–10000 independent paired measurements required.",
    );
  const shiftedX = x.map((v) => finite(v - x[0])),
    shiftedY = y.map((v) => finite(v - y[0])),
    mx = mean(shiftedX),
    my = mean(shiftedY),
    dx = shiftedX.map((v) => v - mx),
    dy = shiftedY.map((v) => v - my),
    xx = sum(dx.map((v) => v * v)),
    yy = sum(dy.map((v) => v * v)),
    xy = sum(dx.map((v, i) => v * dy[i]));
  positive(xx, "predictorVariance");
  const slope = finite(xy / xx);
  return {
    slope,
    intercept: finite(y[0] + my - finite(slope * finite(x[0] + mx))),
    rSquared: yy === 0 ? 1 : Math.min(1, Math.max(0, ((xy / xx) * xy) / yy)),
  };
};
export const median = (values: readonly number[]): number => {
  if (!values.length)
    simpleError("observations", "Nonempty independent observations required.");
  const v = [...values].sort((a, b) => a - b),
    i = Math.floor(v.length / 2);
  return v.length % 2 ? v[i] : v[i - 1] / 2 + v[i] / 2;
};
export const curve = (
  x: readonly number[],
  y: readonly number[],
  q: number,
): { value: number; slope: number } => {
  const value = interpolate(x, y, q);
  const i =
    q === x.at(-1) ? x.length - 2 : x.findIndex((v, j) => j > 0 && q < v) - 1;
  return {
    value,
    slope: finite(finite(y[i + 1] - y[i]) / (x[i + 1] - x[i])),
  };
};
export const crossings = (
  x: readonly number[],
  y: readonly number[],
  level: number,
): number[] => {
  aligned(x, y, "crossings");
  strictlyIncreasing(x, "coordinates");
  const found: number[] = [];
  const append = (v: number) => {
    if (found.at(-1) !== v) found.push(v);
  };
  for (let i = 0; i < x.length; i++) {
    if (y[i] === level) append(x[i]);
    if (i + 1 < x.length) {
      const a = finite(y[i] - level),
        b = finite(y[i + 1] - level);
      if ((a < 0 && b > 0) || (a > 0 && b < 0)) {
        const scale = Math.max(Math.abs(a), Math.abs(b)),
          t = Math.abs(a / scale) / (Math.abs(a / scale) + Math.abs(b / scale));
        append(finite(x[i] * (1 - t) + x[i + 1] * t));
      }
    }
  }
  return found;
};
export const extrema = (
  x: readonly number[],
  y: readonly number[],
  maximum: boolean,
): { coordinates: number[]; value: number } => {
  aligned(x, y, "extrema");
  strictlyIncreasing(x, "coordinates", 1);
  const value = maximum ? Math.max(...y) : Math.min(...y);
  return { coordinates: x.filter((_, i) => y[i] === value), value };
};
export const fitPower = (
  x: readonly number[],
  y: readonly number[],
): { exponent: number; prefactor: number; rSquared: number } => {
  x.forEach((v) => positive(v, "positive predictor"));
  y.forEach((v) => positive(v, "positive response"));
  const fit = linearFit(x.map(Math.log), y.map(Math.log));
  return {
    exponent: fit.slope,
    prefactor: Math.exp(fit.intercept),
    rSquared: fit.rSquared,
  };
};

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
import {
  positive,
  nonnegative,
  fraction,
  ordered,
  aligned,
} from "../neuroscience/shared.js";
export const maximum = (x: readonly number[]): number => {
  if (!x.length) simpleError("samples", "Nonempty values required.");
  return x.reduce((a, b) => Math.max(a, b), -Infinity);
};
export const minimum = (x: readonly number[]): number => {
  if (!x.length) simpleError("samples", "Nonempty values required.");
  return x.reduce((a, b) => Math.min(a, b), Infinity);
};
export const interpolate = (
  x: readonly number[],
  y: readonly number[],
  target: number,
): number => {
  ordered(x, "coordinates");
  aligned(x, y, "coordinates");
  if (target < x[0] || target > x[x.length - 1])
    simpleError(
      "target",
      "Target must lie within sampled coordinates; no extrapolation.",
    );
  let i = 1;
  while (x[i] < target) i++;
  return (
    y[i - 1] + ((y[i] - y[i - 1]) * (target - x[i - 1])) / (x[i] - x[i - 1])
  );
};
export const bondSizeTerm = (
  feedMicrometers: number,
  productMicrometers: number,
): number => {
  positive(feedMicrometers, "feedP80Micrometers");
  positive(productMicrometers, "productP80Micrometers");
  if (productMicrometers >= feedMicrometers)
    simpleError(
      "productP80Micrometers",
      "Product P80 must be smaller than feed P80.",
    );
  return 10 / Math.sqrt(productMicrometers) - 10 / Math.sqrt(feedMicrometers);
};
export const recoveryFit = (
  times: readonly number[],
  recoveries: readonly number[],
  ultimate: number,
): { rate: number; intercept: number; rSquared: number } => {
  ordered(times, "timesMinutes");
  aligned(times, recoveries, "timesMinutes");
  positive(ultimate, "ultimateRecovery");
  fraction(ultimate, "ultimateRecovery");
  times.forEach((v) => nonnegative(v, "timesMinutes"));
  recoveries.forEach((v) => {
    nonnegative(v, "recoveries");
    if (v >= ultimate)
      simpleError(
        "recoveries",
        "Observed recovery must lie below supplied asymptote.",
      );
  });
  const x = times,
    y = recoveries.map((v) => Math.log1p(-v / ultimate)),
    mx = x.reduce((a, b) => a + b, 0) / x.length,
    my = y.reduce((a, b) => a + b, 0) / y.length,
    sx = x.reduce((s, v) => s + (v - mx) ** 2, 0),
    slope = x.reduce((s, v, i) => s + (v - mx) * (y[i] - my), 0) / sx,
    intercept = my - slope * mx,
    ssy = y.reduce((s, v) => s + (v - my) ** 2, 0),
    sse = y.reduce((s, v, i) => s + (v - intercept - slope * x[i]) ** 2, 0);
  if (slope >= 0)
    simpleError(
      "recoveries",
      "Increasing recovery is required for a positive fitted rate.",
    );
  return {
    rate: -slope,
    intercept,
    rSquared: ssy === 0 ? 1 : Math.max(0, Math.min(1, 1 - sse / ssy)),
  };
};

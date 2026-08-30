import { simpleError } from "../core/simple.js";
import { aligned, positive } from "../game/shared.js";
export * from "../accounting/batch-shared.js";
export const strictlyIncreasing = (
  x: readonly number[],
  field: string,
  minLength = 2,
): void => {
  if (
    x.length < minLength ||
    x.some(
      (v, i) =>
        !Number.isFinite(v) ||
        !Number.isFinite(v - x[0]) ||
        (i > 0 && v <= x[i - 1]),
    )
  )
    simpleError(
      field,
      "Finite strictly increasing sampled coordinates required.",
    );
};
export const monotone = (
  y: readonly number[],
  direction: "up" | "down",
  field: string,
): void => {
  if (
    y.length < 2 ||
    y.some(
      (v, i) =>
        !Number.isFinite(v) ||
        (i > 0 && (direction === "up" ? v <= y[i - 1] : v >= y[i - 1])),
    )
  )
    simpleError(
      field,
      "Strictly monotone unambiguous caller calibration required.",
    );
};
export const interpolate = (
  x: readonly number[],
  y: readonly number[],
  q: number,
): number => {
  aligned(x, y, "calibration");
  strictlyIncreasing(x, "coordinates");
  if (!Number.isFinite(q) || q < x[0] || q > x[x.length - 1])
    return simpleError(
      "query",
      "Query must lie within observed calibration; no extrapolation.",
    );
  const i = x.findIndex((v) => v >= q);
  if (i === 0 || x[i] === q) return y[i];
  const t = (q - x[i - 1]) / (x[i] - x[i - 1]);
  return y[i - 1] * (1 - t) + y[i] * t;
};
export const interpolateLog = (
  x: readonly number[],
  y: readonly number[],
  q: number,
): number => {
  x.forEach((v) => positive(v, "coordinates"));
  positive(q, "query");
  return interpolate(x.map(Math.log), y, Math.log(q));
};
export const crossing = (
  x: readonly number[],
  y: readonly number[],
  target: number,
): {
  value: number;
  found: boolean;
  lowerBound: number;
  upperBound: number;
} => {
  aligned(x, y, "curve");
  strictlyIncreasing(x, "coordinates");
  if (y.some((v) => !Number.isFinite(v)) || !Number.isFinite(target))
    return simpleError("curve", "Finite bounded observations required.");
  let results: number[] = [];
  for (let i = 0; i < y.length; i++) {
    if (y[i] === target) {
      if (i > 0 && y[i - 1] === target)
        return simpleError(
          "crossing",
          "Plateau at threshold is an ambiguous crossing.",
        );
      results.push(x[i]);
    }
    if (
      i > 0 &&
      ((y[i - 1] < target && y[i] > target) ||
        (y[i - 1] > target && y[i] < target))
    ) {
      const span = y[i] - y[i - 1];
      if (!Number.isFinite(span) || !Number.isFinite(target - y[i - 1]))
        simpleError(
          "crossing",
          "Threshold interpolation span exceeds finite numeric range.",
        );
      const t = (target - y[i - 1]) / span;
      results.push(x[i - 1] * (1 - t) + x[i] * t);
    }
  }
  if (results.length > 1)
    return simpleError(
      "crossing",
      "Multiple observed crossings; narrow a monotone branch.",
    );
  return {
    value: results[0] ?? 0,
    found: results.length === 1,
    lowerBound: x[0],
    upperBound: x[x.length - 1],
  };
};
export const integral = (
  x: readonly number[],
  y: readonly number[],
): number => {
  aligned(x, y, "curve");
  strictlyIncreasing(x, "coordinates");
  let value = 0;
  for (let i = 1; i < x.length; i++)
    value += ((x[i] - x[i - 1]) * (y[i] + y[i - 1])) / 2;
  return value;
};
export const density = (T: number): number => {
  if (!Number.isFinite(T) || T < 0 || T > 40)
    return simpleError(
      "temperature",
      "Pure freshwater approximation limited to 0–40 Celsius.",
    );
  return (
    1000 *
    (1 - ((T + 288.9414) / (508929.2 * (T + 68.12963))) * (T - 3.9863) ** 2)
  );
};
export const linearFit = (
  x: readonly number[],
  y: readonly number[],
): { slope: number; intercept: number } => {
  aligned(x, y, "observations");
  if (x.length < 2)
    return simpleError("observations", "At least two observations required.");
  const dx = x.map((v) => v - x[0]),
    dy = y.map((v) => v - y[0]),
    mx = dx.reduce((s, v) => s + v, 0) / x.length,
    my = dy.reduce((s, v) => s + v, 0) / y.length,
    variance = dx.reduce((s, v) => s + (v - mx) ** 2, 0);
  if (!Number.isFinite(variance) || variance <= 0)
    return simpleError(
      "coordinates",
      "Distinct coordinates required for a fit.",
    );
  const covariance = dx.reduce((s, v, i) => s + (v - mx) * (dy[i] - my), 0);
  if (!Number.isFinite(covariance))
    return simpleError(
      "observations",
      "Fit covariance exceeds finite numeric range.",
    );
  const slope = covariance / variance;
  return { slope, intercept: y[0] + my - slope * (x[0] + mx) };
};
export const lookup = (
  ids: readonly string[],
  values: readonly number[],
  requested: string,
): number => {
  aligned(ids, values, "callerCatalog");
  if (
    new Set(ids).size !== ids.length ||
    ids.some((s) => !s.trim()) ||
    !requested.trim()
  )
    return simpleError(
      "catalog",
      "Distinct explicit caller model identifiers required.",
    );
  const i = ids.indexOf(requested);
  if (i < 0)
    return simpleError(
      "model",
      "Unsupported model absent from caller verified catalog; no guessed specification.",
    );
  return values[i];
};
export const weights = (values: readonly number[]): number[] => {
  if (!values.length || values.some((v) => !Number.isFinite(v) || v < 0))
    return simpleError(
      "weights",
      "Explicit nonnegative finite weights required.",
    );
  const max = Math.max(...values);
  positive(max, "weights");
  const normalized = values.map((v) => v / max),
    total = normalized.reduce((s, v) => s + v, 0);
  return normalized.map((v) => v / total);
};

import { simpleError } from "../core/simple.js";
import {
  positive,
  nonnegative,
  fraction,
  aligned,
  bounded,
} from "../game/shared.js";
import { sum, mean, catalogIndex } from "../horticulture/batch34-shared.js";
import { strictlyIncreasing } from "../glaciology/batch32-shared.js";
export * from "../horticulture/batch34-shared.js";
export const finite = (v: number, f = "model"): number => {
  if (!Number.isFinite(v))
    return simpleError(f, "Finite intermediate model value required.");
  return v;
};
export const ordered = (a: number, b: number, f = "range"): void => {
  if (!Number.isFinite(a) || !Number.isFinite(b) || a > b)
    simpleError(f, "Finite ordered caller limits required.");
};
export const integral = (
  times: readonly number[],
  rates: readonly number[],
): number => {
  aligned(times, rates, "curve");
  strictlyIncreasing(times, "times");
  return sum(
    times
      .slice(1)
      .map((v, i) =>
        finite((v - times[i]) * finite(rates[i] / 2 + rates[i + 1] / 2)),
      ),
  );
};
export const peakStorage = (
  hours: readonly number[],
  inflow: readonly number[],
  outflow: readonly number[],
): { peak: number; end: number; overflow: number } => {
  aligned(hours, inflow, "flows");
  aligned(hours, outflow, "flows");
  let stored = 0,
    peak = 0,
    unmet = 0;
  hours.forEach((h, i) => {
    positive(h, "duration");
    nonnegative(inflow[i], "inflow");
    nonnegative(outflow[i], "outflow");
    const next = finite(stored + finite((inflow[i] - outflow[i]) * h));
    unmet = finite(unmet + Math.max(0, -next));
    stored = Math.max(0, next);
    peak = Math.max(peak, stored);
  });
  return { peak, end: stored, overflow: unmet };
};
export const catalog = (
  ids: readonly string[],
  values: readonly number[],
  query: string,
): number => {
  aligned(ids, values, "catalog");
  values.forEach((v) => nonnegative(v, "verified value"));
  return values[catalogIndex(ids, query)];
};
export const head = (pascal: number, rho: number, g: number): number => {
  positive(rho, "density");
  positive(g, "gravity");
  return finite(pascal / rho / g);
};
export const probability = (p: number): number => fraction(p, "probability");
export const variance = (v: readonly number[]): number => {
  if (!v.length) return simpleError("variance", "Observed values required.");
  const m = mean(v);
  return mean(v.map((x) => finite((x - m) * (x - m))));
};
export const polynomial = (
  coefficients: readonly number[],
  x: number,
): number => {
  if (coefficients.length < 1 || coefficients.length > 8)
    return simpleError(
      "coefficients",
      "1–8 caller verified constant-first coefficients required.",
    );
  return coefficients.reduceRight((s, c) => finite(s * x + c), 0);
};
export const capacity = (
  ids: readonly string[],
  caps: readonly number[],
  required: number,
): string[] => {
  aligned(ids, caps, "capacity");
  catalogIndex(ids, ids[0]);
  nonnegative(required, "required");
  caps.forEach((v) => nonnegative(v, "capacity"));
  return ids.filter((_, i) => caps[i] >= required);
};

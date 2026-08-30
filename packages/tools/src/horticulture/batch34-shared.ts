import { simpleError } from "../core/simple.js";
import { bounded } from "../game/shared.js";
import { unique } from "../accounting/batch-shared.js";
export * from "../theatre/batch33-shared.js";
export const sum = (values: readonly number[]): number => {
  let result = 0;
  for (const value of values) {
    result += value;
    if (!Number.isFinite(result))
      simpleError(
        "sum",
        "Finite evidence and finite accumulated totals required.",
      );
  }
  return result;
};
export const mean = (values: readonly number[]): number => {
  if (!values.length)
    return simpleError("mean", "Nonempty observations required.");
  return sum(values) / values.length;
};
export const catalogIndex = (ids: readonly string[], query: string): number => {
  unique(ids, "catalog");
  const index = ids.indexOf(query);
  if (index < 0)
    return simpleError(
      "query",
      "Query absent from caller verified catalog; no guessed specification.",
    );
  return index;
};
export const band = (value: number, lower: number, upper: number): number => {
  if (
    !Number.isFinite(value) ||
    !Number.isFinite(lower) ||
    !Number.isFinite(upper) ||
    lower > upper
  )
    return simpleError("range", "Finite ordered caller limits required.");
  return Math.min(value - lower, upper - value);
};
export const fittedCounts = (
  usable: number,
  item: number,
  gap: number,
): number => {
  if (
    !Number.isFinite(usable) ||
    usable < 0 ||
    !Number.isFinite(item) ||
    item <= 0 ||
    !Number.isFinite(gap) ||
    gap < 0 ||
    !Number.isFinite(item + gap) ||
    !Number.isFinite(usable + gap)
  )
    return simpleError(
      "layout",
      "Finite nonnegative usable dimension/gap and positive item required.",
    );
  return bounded(
    Math.floor((usable + gap) / (item + gap)),
    "count",
    0,
    1000000,
  );
};
export const clock = (minutes: number): number => {
  bounded(minutes, "clockMinute", 0, 1439);
  return minutes;
};

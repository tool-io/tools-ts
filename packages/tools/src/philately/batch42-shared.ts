import { simpleError } from "../core/simple.js";
import {
  aligned,
  positive,
  integer,
  sum,
  validateInput as validateBaseInput,
} from "../astronomy/batch41-shared.js";
import type { SimpleField } from "../core/simple.js";
export * from "../astronomy/batch41-shared.js";
export const validateInput = (
  input: unknown,
  fields: readonly SimpleField[],
): void => {
  validateBaseInput(input, fields);
  if (fields.some((f) => !Object.hasOwn(input as object, f.id)))
    simpleError("input", "Every input field must be an own explicit value.");
};
export const positiveCounts = (v: readonly number[]): void => {
  v.forEach((x) => {
    positive(x, "count");
    integer(x, "count");
  });
};
export const rowsMatch = (
  query: readonly number[],
  rows: readonly (readonly number[])[],
  labels: readonly string[],
): string[] => {
  aligned(rows, labels, "reference rows");
  if (
    query.length < 1 ||
    query.length > 32 ||
    rows.some((v) => v.length !== query.length)
  )
    simpleError("reference", "Explicit same-basis dimensions and labels.");
  return labels.filter((_, i) => rows[i].every((v, j) => v === query[j]));
};
export const slotCapacity = (
  extent: number,
  object: number,
  gap: number,
): number => {
  positive(object, "object dimension");
  if (extent < 0 || gap < 0)
    simpleError("layout", "Nonnegative usable extent and gap.");
  return integer(
    Math.max(0, Math.floor((extent + gap) / (object + gap))),
    "capacity",
  );
};
export const referenceBands = (
  value: number,
  lower: readonly number[],
  upper: readonly number[],
  labels: readonly string[],
): string[] => {
  aligned(lower, upper, "bands");
  aligned(lower, labels, "labels");
  lower.forEach((x, i) => {
    if (x >= upper[i])
      simpleError("band", "Positive half-open reference intervals.");
  });
  return labels.filter((_, i) => value >= lower[i] && value < upper[i]);
};
export const weightedKnown = (
  scores: readonly number[],
  weight: readonly number[],
  known: readonly number[],
): {
  knownWeightedScore: number;
  knownWeightFraction: number;
  unknownIndices: number[];
} => {
  aligned(scores, weight, "scores");
  aligned(scores, known, "knownflags");
  if (weight.some((v) => v < 0) || known.some((v) => v !== 0 && v !== 1))
    simpleError(
      "weights",
      "Nonnegative weights and explicit binary knownflags.",
    );
  const t = positive(sum(weight), "totalweights"),
    k = sum(weight.map((v, i) => v * known[i]));
  return {
    knownWeightedScore: k
      ? sum(scores.map((v, i) => v * weight[i] * known[i])) / k
      : 0,
    knownWeightFraction: k / t,
    unknownIndices: known.flatMap((v, i) => (v ? [] : [i])),
  };
};
export const datedRecord = (
  date: string,
  start: readonly string[],
  end: readonly string[],
  labels: readonly string[],
): string[] => {
  aligned(start, end, "periods");
  aligned(start, labels, "records");
  const valid = (s: string) => {
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(s) ||
      !Number.isFinite(Date.parse(s)) ||
      new Date(s).toISOString().slice(0, 10) !== s
    )
      simpleError("date", "Strict real Gregorian date.");
    return s;
  };
  valid(date);
  start.forEach((s, i) => {
    valid(s);
    valid(end[i]);
    if (s >= end[i])
      simpleError("period", "Positive half-open date intervals.");
  });
  return labels.filter((_, i) => date >= start[i] && date < end[i]);
};

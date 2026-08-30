import { simpleError } from "../core/simple.js";

export const positive = (value: number, field: string): number => {
  if (!Number.isFinite(value) || value <= 0)
    simpleError(field, "A positive finite value is required.");
  return value;
};
export const nonnegative = (value: number, field: string): number => {
  if (!Number.isFinite(value) || value < 0)
    simpleError(field, "A nonnegative finite value is required.");
  return value;
};
export const fraction = (value: number, field: string): number => {
  nonnegative(value, field);
  if (value > 1) simpleError(field, "A fraction in [0,1] is required.");
  return value;
};
export const count = (value: number, field: string, minimum = 0): number => {
  if (!Number.isSafeInteger(value) || value < minimum)
    simpleError(field, `An integer of at least ${minimum} is required.`);
  return value;
};
export const aligned = (
  first: readonly unknown[],
  second: readonly unknown[],
  field: string,
): void => {
  if (!first.length || first.length !== second.length)
    simpleError(field, "Aligned nonempty lists are required.");
};
export const ordered = (values: readonly number[], field: string): void => {
  if (
    !values.length ||
    values.some((v, i) => !Number.isFinite(v) || (i > 0 && v <= values[i - 1]))
  )
    simpleError(
      field,
      "A nonempty strictly increasing finite list is required.",
    );
};
export const mean = (values: readonly number[]): number => {
  if (!values.length) simpleError("values", "A nonempty list is required.");
  return values.reduce((a, b) => a + b, 0) / values.length;
};
export const median = (values: readonly number[]): number => {
  if (!values.length) simpleError("values", "A nonempty list is required.");
  const sorted = [...values].sort((a, b) => a - b),
    n = sorted.length;
  return n % 2 ? sorted[(n - 1) / 2] : (sorted[n / 2 - 1] + sorted[n / 2]) / 2;
};
export const endpoints = (
  concentrations: readonly number[],
  response: readonly number[],
  field: string,
): void => {
  aligned(concentrations, response, field);
  ordered(concentrations, "concentrations");
  concentrations.forEach((v) => positive(v, "concentrations"));
};

export type TubeDesign = Readonly<{
  volumesMl: readonly number[];
  positiveTubes: readonly number[];
  totalTubes: readonly number[];
}>;
export const tubeLikelihood = (
  design: TubeDesign,
  concentration: number,
): number => {
  let total = 0;
  design.volumesMl.forEach((v, i) => {
    const exposure = concentration * v,
      k = design.positiveTubes[i],
      n = design.totalTubes[i];
    if (k > 0) total += k * Math.log(-Math.expm1(-exposure));
    if (n > k) total -= (n - k) * exposure;
  });
  return total;
};
export const tubeMpn = (design: TubeDesign): number => {
  aligned(design.volumesMl, design.positiveTubes, "volumesMl");
  aligned(design.volumesMl, design.totalTubes, "volumesMl");
  if (design.volumesMl.length > 128)
    simpleError("volumesMl", "At most 128 tube groups are supported.");
  design.volumesMl.forEach((v, i) => {
    positive(v, "volumesMl");
    count(design.totalTubes[i], "totalTubes", 1);
    count(design.positiveTubes[i], "positiveTubes");
    if (design.positiveTubes[i] > design.totalTubes[i])
      simpleError(
        "positiveTubes",
        "Positive tubes cannot exceed tested tubes.",
      );
  });
  const k = design.positiveTubes.reduce((a, b) => a + b, 0),
    n = design.totalTubes.reduce((a, b) => a + b, 0);
  if (k === 0 || k === n)
    simpleError(
      "positiveTubes",
      "Both positive and negative tubes are required for a finite two-sided MPN estimate.",
    );
  const score = (c: number) =>
    design.volumesMl.reduce(
      (sum, v, i) =>
        sum +
        v *
          (design.positiveTubes[i] / Math.expm1(c * v) -
            (design.totalTubes[i] - design.positiveTubes[i])),
      0,
    );
  let low = 0,
    high = 1 / Math.min(...design.volumesMl);
  for (let i = 0; i < 100 && score(high) > 0; i++) high *= 2;
  if (!Number.isFinite(high) || score(high) > 0)
    simpleError(
      "volumesMl",
      "Design is too extreme for a finite numeric estimate.",
    );
  for (let i = 0; i < 150; i++) {
    const mid = (low + high) / 2;
    if (score(mid) > 0) low = mid;
    else high = mid;
  }
  return (low + high) / 2;
};

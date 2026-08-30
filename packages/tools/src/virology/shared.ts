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
export const dna = (value: string, field: string): string => {
  const sequence = value.trim().toUpperCase();
  if (!/^[ACGT]+$/.test(sequence))
    simpleError(field, "Canonical A/C/G/T DNA is required.");
  return sequence;
};

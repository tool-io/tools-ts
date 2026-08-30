import { simpleError } from "../core/simple.js";

export const nonnegative = (value: number, field: string): number => {
  if (!Number.isFinite(value) || value < 0)
    simpleError(field, "A nonnegative finite value is required.");
  return value;
};
export const positive = (value: number, field: string): number => {
  nonnegative(value, field);
  if (value === 0) simpleError(field, "A positive value is required.");
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
  labels: readonly string[],
  values: readonly number[],
  field: string,
): void => {
  if (
    !labels.length ||
    labels.length !== values.length ||
    new Set(labels).size !== labels.length ||
    labels.some((v) => !v.trim())
  )
    simpleError(
      field,
      "Distinct nonempty labels and aligned values are required.",
    );
  values.forEach((v) => nonnegative(v, field));
};

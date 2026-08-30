import { simpleError } from "../core/simple.js";

export const count = (value: number, field: string, minimum = 0): number => {
  if (!Number.isSafeInteger(value) || value < minimum)
    simpleError(field, `An integer of at least ${minimum} is required.`);
  return value;
};
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
export const aligned = (
  first: readonly unknown[],
  second: readonly unknown[],
  field: string,
): void => {
  if (!first.length || first.length !== second.length)
    simpleError(field, "Aligned nonempty lists are required.");
};

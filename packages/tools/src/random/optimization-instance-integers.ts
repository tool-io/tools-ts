import { simpleError } from "../core/simple.js";
export const nonnegativeInstanceIntegerSchema = {
  type: "integer",
  minimum: 0,
  maximum: Number.MAX_SAFE_INTEGER,
} as const;
export const positiveInstanceIntegerSchema = {
  type: "integer",
  minimum: 1,
  maximum: Number.MAX_SAFE_INTEGER,
} as const;
export const exactInstanceSum = (
  values: readonly number[],
  field: string,
): number => {
  const sum = values.reduce((total, value) => total + BigInt(value), 0n);
  if (sum < 0n || sum > BigInt(Number.MAX_SAFE_INTEGER))
    return simpleError(
      field,
      "The aggregate must remain a nonnegative safe integer.",
      "unsafe_aggregate",
    );
  return Number(sum);
};
export const orderedInstanceRange = (
  minimum: number,
  maximum: number,
  field: string,
): void => {
  if (maximum < minimum || !Number.isSafeInteger(maximum - minimum + 1))
    simpleError(
      field,
      "The inclusive integer range must be ordered and safely representable.",
      "invalid_integer_range",
    );
};

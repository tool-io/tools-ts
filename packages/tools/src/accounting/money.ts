import { simpleError } from "../core/simple.js";

export const integer = (value: number, field: string): number =>
  Number.isSafeInteger(value)
    ? value
    : simpleError(field, "Exactly representable signed integer required.");

export const money = (value: number, field: string): number => {
  integer(value, field);
  if (value < 0)
    simpleError(
      field,
      "Nonnegative integer minor-unit amount required; use a single caller currency throughout.",
    );
  return value;
};

export const signedSum = (values: readonly number[]): number => {
  const result = values.reduce(
    (sum, value) => sum + BigInt(integer(value, "amount")),
    0n,
  );
  return integer(Number(result), "total");
};

export const sumMoney = (values: readonly number[]): number => {
  values.forEach((value) => money(value, "amount"));
  return signedSum(values);
};

export const roundMinor = (numerator: bigint, denominator: bigint): number => {
  if (denominator <= 0n)
    return simpleError("denominator", "Positive integer denominator required.");
  const sign = numerator < 0n ? -1n : 1n;
  const absoluteNumerator = numerator * sign;
  return integer(
    Number(
      sign * ((2n * absoluteNumerator + denominator) / (2n * denominator)),
    ),
    "roundedAmount",
  );
};

export const weightedMinor = (
  amount: number,
  numerator: number,
  denominator: number,
): number =>
  roundMinor(
    BigInt(integer(amount, "amount")) * BigInt(integer(numerator, "numerator")),
    BigInt(integer(denominator, "denominator")),
  );

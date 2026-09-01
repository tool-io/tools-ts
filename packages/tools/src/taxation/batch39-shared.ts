export * from "../geology/batch39-shared.js";
export { money, sumMoney, signedSum, roundMinor } from "../accounting/money.js";
import { simpleError } from "../core/simple.js";
import { integer, money, roundMinor } from "../accounting/money.js";
import {
  strictlyIncreasing,
  aligned,
  sum,
} from "../engineering/batch38-shared.js";
export const brackets = (
  amount: number,
  starts: readonly number[],
  rateBasisPoints: readonly number[],
): { roundedBracketTaxMinor: number; sliceTaxableAmountsMinor: number[] } => {
  money(amount, "amount");
  aligned(starts, rateBasisPoints, "brackets");
  strictlyIncreasing(starts, "starts", 1);
  if (starts[0] !== 0)
    simpleError("start", "Explicit bottom bracket begins zero.");
  starts.forEach((v) => money(v, "start"));
  rateBasisPoints.forEach((v) => {
    integer(v, "basis points");
    if (v < 0 || v > 10000)
      simpleError(
        "rate",
        "Integer 0–10,000 basis points, where 10,000 = 100%.",
      );
  });
  const slices = starts.map((v, i) =>
    Math.max(0, Math.min(amount, starts[i + 1] ?? amount) - v),
  );
  const numerator = slices.reduce(
    (n, v, i) => n + BigInt(v) * BigInt(rateBasisPoints[i]),
    0n,
  );
  return {
    roundedBracketTaxMinor: roundMinor(numerator, 10000n),
    sliceTaxableAmountsMinor: slices,
  };
};
export const dayOffset = (date: string, days: number): string => {
  integer(days, "calendar days");
  if (Math.abs(days) > 100000)
    simpleError("days", "≤100000 explicit calendar days.");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date))
    simpleError(
      "date",
      "Strict GregorianYYYY-MM-DD, no timezone/business-day inference.",
    );
  const time = Date.parse(date + "T00:00:00Z");
  if (
    !Number.isFinite(time) ||
    new Date(time).toISOString().slice(0, 10) !== date
  )
    simpleError("date", "Real Gregorian date required.");
  const result = new Date(time + days * 86400000).toISOString();
  if (!/^\d{4}-/.test(result))
    simpleError("date", "Result must remain four-digit Gregorian year.");
  return result.slice(0, 10);
};
export const dateOrder = (a: string, b: string): number => {
  dayOffset(a, 0);
  dayOffset(b, 0);
  return (
    (Date.parse(b + "T00:00:00Z") - Date.parse(a + "T00:00:00Z")) / 86400000
  );
};
export const rateMinor = (amount: number, basisPoints: number): number => {
  money(amount, "amount");
  integer(basisPoints, "rate");
  if (basisPoints < 0 || basisPoints > 100000)
    simpleError("rate", "0..100000 integer basis points required.");
  return roundMinor(BigInt(amount) * BigInt(basisPoints), 10000n);
};
export const holdingDays = (start: string, end: string): number => {
  const n = dateOrder(start, end);
  if (n < 0) simpleError("dates", "Disposition cannot precede acquisition.");
  return n;
};

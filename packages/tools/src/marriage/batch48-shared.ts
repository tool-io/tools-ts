export * from "../toxicology/batch48-shared.js";
export { intervalUnion } from "../museology/shared.js";
import {
  simpleError,
  ownReference,
  aligned,
  unique,
  binary,
  nonnegative,
  sum,
  finite,
  daysBetween,
  shiftDate,
  bounded,
} from "../toxicology/batch48-shared.js";
export const callerInstrument = (
  source: string,
  context: string,
  asOf: string,
  ids: readonly string[],
  scores: readonly number[],
  minima: readonly number[],
  maxima: readonly number[],
  reverse: readonly number[],
  weights: readonly number[],
  known: readonly number[],
): {
  knownWeightedItemSum: number;
  minimumPossibleWeightedTotal: number;
  maximumPossibleWeightedTotal: number;
  unknownItemIds: string[];
} => {
  ownReference(source, context, asOf);
  unique(ids, "actualinstrumentitems");
  [scores, minima, maxima, reverse, weights, known].forEach((v) =>
    aligned(ids, v, "items"),
  );
  binary(reverse, "reversekeys");
  binary(known, "known");
  weights.forEach((v) => nonnegative(v, "weight"));
  if (
    !weights.some((v) => v > 0) ||
    scores.some(
      (v, i) => minima[i] >= maxima[i] || v < minima[i] || v > maxima[i],
    )
  )
    simpleError(
      "instrument",
      "Actual verified ordered non-zero-width item bounds, observed codes and positive total weight; unknown placeholders still valid codes.",
    );
  const k = finite(
    sum(
      scores.map(
        (v, i) =>
          weights[i] * known[i] * (reverse[i] ? minima[i] + maxima[i] - v : v),
      ),
    ),
  );
  return {
    knownWeightedItemSum: k,
    minimumPossibleWeightedTotal: finite(
      k + sum(minima.map((v, i) => v * weights[i] * (1 - known[i]))),
    ),
    maximumPossibleWeightedTotal: finite(
      k + sum(maxima.map((v, i) => v * weights[i] * (1 - known[i]))),
    ),
    unknownItemIds: ids.filter((_, i) => !known[i]),
  };
};
export const calendarAnniversary = (
  date: string,
  year: number,
  leapPolicy: string,
): string => {
  daysBetween(date, date);
  bounded(year, "year", 1, 9999);
  if (!["feb28", "mar1"].includes(leapPolicy))
    simpleError("policy", "Explicit Feb 29 anniversary policy: feb28 or mar1.");
  const leap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  const md =
    date.slice(5) === "02-29" && !leap
      ? leapPolicy === "feb28"
        ? "02-28"
        : "03-01"
      : date.slice(5);
  const result = String(year).padStart(4, "0") + "-" + md;
  daysBetween(result, result);
  return result;
};
export const calendarDuration = (
  start: string,
  end: string,
): {
  completedYears: number;
  completedAdditionalMonths: number;
  remainingDays: number;
} => {
  if (daysBetween(start, end) < 0)
    simpleError("dates", "End date must be on or after start date.");
  const y = Number(start.slice(0, 4)),
    m = Number(start.slice(5, 7)),
    d = Number(start.slice(8));
  const offset = (months: number): string => {
    const n = m - 1 + months,
      yy = y + Math.floor(n / 12),
      mm = (n % 12) + 1,
      leap = (yy % 4 === 0 && yy % 100 !== 0) || yy % 400 === 0,
      dim = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][
        mm - 1
      ];
    return (
      String(yy).padStart(4, "0") +
      "-" +
      String(mm).padStart(2, "0") +
      "-" +
      String(Math.min(d, dim)).padStart(2, "0")
    );
  };
  let months = (Number(end.slice(0, 4)) - y) * 12 + Number(end.slice(5, 7)) - m;
  while (daysBetween(offset(months), end) < 0) months--;
  return {
    completedYears: Math.floor(months / 12),
    completedAdditionalMonths: months % 12,
    remainingDays: daysBetween(offset(months), end),
  };
};
export const factorialText = (n: number): string => {
  bounded(n, "people", 0, 2000);
  let v = 1n;
  for (let i = 2; i <= n; i++) v *= BigInt(i);
  return v.toString();
};

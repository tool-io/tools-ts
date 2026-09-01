import { simpleError } from "../core/simple.js";
import { bounded, aligned, binary } from "../game/shared.js";
import {
  sumMoney,
  weightedMinor,
  dateDay,
  dayDate,
  unique,
} from "../accounting/batch-shared.js";
export * from "../insurance/batch35-shared.js";
export const payment = (
  principal: number,
  rateBps: number,
  months: number,
): number => {
  bounded(principal, "principal", 0, 1e12);
  bounded(rateBps, "annual bps", 0, 100000);
  bounded(months, "months", 1, 600);
  const r = rateBps / 120000;
  return principal === 0
    ? 0
    : r === 0
      ? Math.ceil(principal / months)
      : Math.ceil((principal * r) / -Math.expm1(-months * Math.log1p(r)));
};
export const amortize = (
  principal: number,
  annualBps: number,
  scheduledPayment: number,
  extra: number,
  maxMonths = 600,
): {
  months: number;
  interest: number;
  remaining: number;
  payments: number[];
} => {
  bounded(principal, "principal", 0, 1e12);
  bounded(annualBps, "annual bps", 0, 100000);
  bounded(scheduledPayment, "payment", 0, 1e12);
  bounded(extra, "extra", 0, 1e12);
  bounded(maxMonths, "months", 1, 600);
  let balance = principal;
  const charges: number[] = [],
    paid: number[] = [];
  for (let i = 0; i < maxMonths && balance > 0; i++) {
    const charge = weightedMinor(balance, annualBps, 120000),
      p = Math.min(balance + charge, sumMoney([scheduledPayment, extra]));
    if (p <= charge)
      simpleError(
        "payment",
        "Positive amortization required for every period.",
      );
    balance = balance + charge - p;
    charges.push(charge);
    paid.push(p);
  }
  return {
    months: paid.length,
    interest: sumMoney(charges),
    remaining: balance,
    payments: paid,
  };
};
export const businessDate = (
  start: string,
  lag: number,
  weekendDays: readonly number[],
  holidayDates: readonly string[],
): string => {
  bounded(lag, "lag", 0, 1000);
  if (holidayDates.length) unique(holidayDates, "holidays");
  weekendDays.forEach((v) => bounded(v, "weekday", 0, 6));
  if (new Set(weekendDays).size >= 7)
    simpleError("calendar", "At least one working weekday required.");
  const holidays = new Set(holidayDates.map(dateDay));
  let date = dateDay(start),
    left = lag;
  for (let n = 0; left > 0; n++) {
    if (n >= 10000) simpleError("calendar", "Bounded calendar walk exhausted.");
    date++;
    const weekday = (((date + 4) % 7) + 7) % 7;
    if (!weekendDays.includes(weekday) && !holidays.has(date)) left--;
  }
  return dayDate(date);
};
export const compareEvidence = (
  ids: readonly string[],
  required: readonly number[],
  present: readonly number[],
  known: readonly number[],
): { missing: string[]; unknown: string[]; complete: boolean } => {
  unique(ids, "criteria");
  for (const v of [required, present, known]) {
    aligned(ids, v, "criteria");
    binary(v, "criteria");
  }
  const missing = ids.filter((_, i) => required[i] && known[i] && !present[i]),
    unknown = ids.filter((_, i) => required[i] && !known[i]);
  return {
    missing,
    unknown,
    complete:
      required.some((v) => v === 1) && !missing.length && !unknown.length,
  };
};

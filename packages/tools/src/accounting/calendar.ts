import { simpleError } from "../core/simple.js";
import { bounded } from "../game/shared.js";
export const dateDay = (value: string): number => {
  if (!/^(?:19|20|21)[0-9]{2}-[0-9]{2}-[0-9]{2}$(?![\s\S])/.test(value))
    return simpleError(
      "date",
      "Exact real civil ISO date 1900–2199 required, without time zone/time suffix.",
    );
  const date = new Date(value + "T00:00:00.000Z");
  if (
    !Number.isFinite(date.getTime()) ||
    date.toISOString().slice(0, 10) !== value
  )
    return simpleError("date", "Real Gregorian calendar date required.");
  return date.getTime() / 86400000;
};
export const dayDate = (day: number): string => {
  if (!Number.isSafeInteger(day))
    return simpleError("date", "Integer civil day required.");
  const d = new Date(day * 86400000);
  if (!Number.isFinite(d.getTime()))
    return simpleError("date", "Bounded civil date required.");
  const s = d.toISOString().slice(0, 10);
  dateDay(s);
  return s;
};
export const addDays = (date: string, days: number): string => {
  if (!Number.isSafeInteger(days) || Math.abs(days) > 36600)
    return simpleError("days", "Bounded signed whole-day offset required.");
  return dayDate(dateDay(date) + days);
};
export const addMonths = (date: string, months: number): string => {
  bounded(months, "months", 0, 1200);
  const d = new Date(dateDay(date) * 86400000),
    month = d.getUTCMonth() + months,
    y = d.getUTCFullYear() + Math.floor(month / 12),
    m = month % 12,
    last = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
  return dayDate(Date.UTC(y, m, Math.min(d.getUTCDate(), last)) / 86400000);
};
export const businessDay = (
  day: number,
  holidayDates: readonly string[],
): boolean => {
  const holidays = new Set(holidayDates.map(dateDay)),
    weekday = new Date(day * 86400000).getUTCDay();
  return weekday !== 0 && weekday !== 6 && !holidays.has(day);
};
export const nextBusinessDay = (
  date: string,
  holidays: readonly string[],
): string => {
  let d = dateDay(date);
  for (let i = 0; i < 3660; i++, d++)
    if (businessDay(d, holidays)) return dayDate(d);
  return simpleError(
    "calendar",
    "Business-day search exceeds bounded calendar window.",
  );
};
export const businessAfter = (
  date: string,
  days: number,
  holidays: readonly string[],
): string => {
  bounded(days, "businessDays", 0, 1000);
  let d = dateDay(date),
    n = 0;
  for (let i = 0; i < 3660; i++) {
    if (n === days) return dayDate(d);
    d++;
    if (businessDay(d, holidays)) n++;
  }
  return simpleError(
    "calendar",
    "Business-day search exceeds bounded calendar window.",
  );
};
export const clockMinute = (text: string): number => {
  if (!/^(?:[01][0-9]|2[0-3]):[0-5][0-9]$(?![\s\S])/.test(text))
    return simpleError(
      "clock",
      "Exact local HH:mm in a caller-resolved single time zone required.",
    );
  return Number(text.slice(0, 2)) * 60 + Number(text.slice(3));
};

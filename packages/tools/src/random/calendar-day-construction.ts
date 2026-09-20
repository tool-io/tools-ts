import { parsePlainDate, millisecondsPerDay } from "../core/date.js";
import { runAddDays } from "../date/add-days/tool.js";
import { runDifference } from "../date/difference/tool.js";
import { SimpleToolError, simpleError } from "../core/simple.js";
const gregorianCycleMilliseconds = 146097 * millisecondsPerDay;
const minimumTimestamp =
  parsePlainDate("0400-01-01") - gregorianCycleMilliseconds;
const maximumTimestamp = parsePlainDate("9999-12-31");
export const generatedPlainDateSchema = {
  type: "string",
  minLength: 10,
  maxLength: 10,
  pattern: "^[0-9]{4}-[0-9]{2}-[0-9]{2}(?![\\s\\S])",
  format: "date",
} as const;
/** Shift a complete Gregorian cycle to avoid Date.UTC's 1900 offset for 0–99. */
export const generatedPlainDateTimestamp = (
  date: string,
  field: string,
): number => {
  if (!/^[0-9]{4}-[0-9]{2}-[0-9]{2}(?![\s\S])/.test(date))
    return simpleError(
      field,
      "Use an exact YYYY-MM-DD date.",
      "invalid_calendar_date",
    );
  const year = Number(date.slice(0, 4)),
    shifted = year < 100;
  try {
    return (
      parsePlainDate(
        shifted ? String(year + 400).padStart(4, "0") + date.slice(4) : date,
        field,
      ) - (shifted ? gregorianCycleMilliseconds : 0)
    );
  } catch (error) {
    if (error instanceof SimpleToolError)
      return simpleError(
        field,
        "Use a valid proleptic Gregorian calendar date.",
        "invalid_calendar_date",
      );
    throw error;
  }
};
export const generatedPlainDateAddDays = (
  date: string,
  days: number,
  field: string,
): string => {
  const timestamp =
    generatedPlainDateTimestamp(date, field) + days * millisecondsPerDay;
  if (
    !Number.isSafeInteger(days) ||
    !Number.isSafeInteger(timestamp) ||
    timestamp < minimumTimestamp ||
    timestamp > maximumTimestamp
  )
    return simpleError(
      field,
      "The calendar result must stay within years 0000–9999.",
      "date_range_exceeded",
    );
  const result = runAddDays({
    date: "1970-01-01",
    days: timestamp / millisecondsPerDay,
  });
  if (!result.ok)
    throw new Error(
      "A validated epoch-day offset was rejected by the date core.",
    );
  return result.output.date;
};
export const generatedPlainDateDifference = (
  start: string,
  end: string,
  field: string,
): number => {
  const first = generatedPlainDateTimestamp(start, field),
    last = generatedPlainDateTimestamp(end, field);
  if (Number(start.slice(0, 4)) >= 100 && Number(end.slice(0, 4)) >= 100) {
    const result = runDifference({ startDate: start, endDate: end });
    if (!result.ok)
      throw new Error(
        "Validated dates were rejected by the date-difference core.",
      );
    return result.output.days;
  }
  return (last - first) / millisecondsPerDay;
};

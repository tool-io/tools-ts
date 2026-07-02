import { simpleError } from "./simple.js";
const dayMilliseconds = 86_400_000;
export const parsePlainDate = (value: string, field = "date"): number => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/u.exec(value);
  if (!match) return simpleError(field, "Enter a date in YYYY-MM-DD format.");
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const timestamp = Date.UTC(year, month - 1, day);
  const date = new Date(timestamp);
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  )
    return simpleError(field, "Enter a valid calendar date.");
  return timestamp;
};
export const formatPlainDate = (timestamp: number): string =>
  new Date(timestamp).toISOString().slice(0, 10);
export const millisecondsPerDay = dayMilliseconds;
